const { supabase, getAuthClient } = require('../../config/supabase');
const { mapRoleToClient, mapRoleToDb, ROLES } = require('../../utils/constants');
const { generateTokens, verifyToken } = require('../../utils/jwt');
const ApiError = require('../../utils/ApiError');
const crypto = require('crypto');

const memoryProfiles = new Map();

class AuthService {
    normalizeUsername(rawUsername) {
        if (!rawUsername) return '';
        let cleaned = String(rawUsername).trim().toLowerCase();
        // Allow alphanumeric, underscores, and hyphens
        cleaned = cleaned.replace(/[^a-z0-9_-]/g, '');
        return cleaned;
    }

    generateDefaultUsername(email, userId) {
        const localPart = (email || '').split('@')[0] || 'user';
        const cleanedLocal = this.normalizeUsername(localPart) || 'user';
        const suffix = (userId || '').slice(0, 6) || Math.floor(1000 + Math.random() * 9000);
        return `${cleanedLocal}_${suffix}`;
    }

    async checkUsernameAvailability(username) {
        const normalized = this.normalizeUsername(username);
        if (!normalized || normalized.length < 3) return false;

        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', normalized)
            .maybeSingle();

        if (error) return true; // Fail open for checking if DB error
        return !data;
    }

    async ensureUserProfile(authUser, fallbackMetadata = {}) {
        if (!authUser || !authUser.id) {
            throw new ApiError(401, 'Invalid auth user');
        }

        // 1. Look up profile by id
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

        if (existingProfile) {
            return existingProfile;
        }

        // 2. Profile missing -> Create profile using Auth metadata / fallbackMetadata
        const email = authUser.email || fallbackMetadata.email || '';
        const metaName = authUser.user_metadata?.full_name || fallbackMetadata.full_name || fallbackMetadata.name || email.split('@')[0] || 'User';
        const rawRole = authUser.user_metadata?.role || fallbackMetadata.role || 'innovator';
        const dbRole = mapRoleToDb(rawRole);

        let requestedUsername = this.normalizeUsername(authUser.user_metadata?.username || fallbackMetadata.username);
        if (!requestedUsername || requestedUsername.length < 3) {
            requestedUsername = this.generateDefaultUsername(email, authUser.id);
        }

        // Ensure username is unique
        let finalUsername = requestedUsername;
        let attempts = 0;
        while (attempts < 5) {
            const isAvail = await this.checkUsernameAvailability(finalUsername);
            if (isAvail) break;
            finalUsername = `${requestedUsername}_${Math.floor(100 + Math.random() * 900)}`;
            attempts++;
        }

        const newProfile = {
            id: authUser.id,
            username: finalUsername,
            email,
            full_name: metaName,
            role: dbRole,
            profile_completed: false,
            created_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createErr } = await supabase
            .from('profiles')
            .upsert([newProfile], { onConflict: 'id' })
            .select('*')
            .single();

        if (createErr || !createdProfile) {
            // Fallback to in-memory representation if DB insert fails
            return newProfile;
        }

        return createdProfile;
    }

    calculateProfileCompletion(profile) {
        if (!profile) return 0;

        const fields = [
            'full_name',
            'username',
            'bio',
            'college',
            'specialization',
            'company',
            'designation',
            'location',
            'skills',
            'avatar_url'
        ];

        let count = 0;
        fields.forEach(field => {
            const val = profile[field] || profile[field === 'avatar_url' ? 'profile_picture' : field];
            if (val) {
                if (Array.isArray(val) && val.length > 0) count++;
                else if (typeof val === 'string' && val.trim().length > 0) count++;
                else if (typeof val !== 'string' && val) count++;
            }
        });

        return Math.round((count / fields.length) * 100);
    }

    formatProfileResponse(profile, emailFallback = '') {
        const canonicalRole = mapRoleToClient(profile?.role);
        const completion = this.calculateProfileCompletion(profile);

        let skillsArray = [];
        if (Array.isArray(profile?.skills)) {
            skillsArray = profile.skills;
        } else if (typeof profile?.skills === 'string') {
            skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
        }

        return {
            id: profile?.id,
            email: profile?.email || emailFallback,
            username: profile?.username || '',
            full_name: profile?.full_name || profile?.name || 'User',
            role: canonicalRole,
            bio: profile?.bio || '',
            avatar_url: profile?.avatar_url || profile?.profile_picture || null,
            college: profile?.college || '',
            specialization: profile?.specialization || '',
            company: profile?.company || '',
            designation: profile?.designation || '',
            location: profile?.location || '',
            github_url: profile?.github_url || '',
            linkedin_url: profile?.linkedin_url || '',
            portfolio_url: profile?.portfolio_url || '',
            whatsapp_number: profile?.whatsapp_number || '',
            skills: skillsArray,
            created_at: profile?.created_at || new Date().toISOString(),
            profile_completed: profile?.profile_completed || completion >= 80,
            completion_percentage: completion
        };
    }

    async registerUser(userData) {
        const { email, password, username, full_name, name, role } = userData;

        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        if (password.length < 6) {
            throw new ApiError(400, 'Password must be at least 6 characters');
        }

        const requestedName = full_name || name || 'User';
        const requestedRole = mapRoleToDb(role || 'innovator');
        let normalizedUsername = this.normalizeUsername(username);

        if (normalizedUsername && normalizedUsername.length < 3) {
            throw new ApiError(400, 'Username must be at least 3 characters long');
        }

        // Check username uniqueness if supplied
        if (normalizedUsername) {
            const isAvail = await this.checkUsernameAvailability(normalizedUsername);
            if (!isAvail) {
                throw new ApiError(409, 'Username already exists');
            }
        }

        const authClient = getAuthClient();
        let authUser = null;
        let accessToken = '';
        let refreshToken = '';

        try {
            const { data: signUpData, error: signUpErr } = await authClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: requestedName,
                        username: normalizedUsername,
                        role: requestedRole
                    }
                }
            });

            if (signUpErr) {
                if (signUpErr.message?.toLowerCase().includes('already registered')) {
                    throw new ApiError(409, 'User with this email already exists');
                }
                console.warn('Supabase Auth signUp warning:', signUpErr.message);
                // Fallthrough to create user & profile safely
            } else if (signUpData.user) {
                authUser = signUpData.user;
                accessToken = signUpData.session?.access_token || '';
                refreshToken = signUpData.session?.refresh_token || '';
            }
        } catch (e) {
            if (e instanceof ApiError) throw e;
            // Fallthrough to local auth generation if mock dev mode
        }

        if (!authUser) {
            const mockId = crypto.randomUUID();
            authUser = { id: mockId, email, user_metadata: { full_name: requestedName, username: normalizedUsername, role: requestedRole } };
            const tokens = generateTokens({ id: mockId, email, role: requestedRole });
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        }

        // Synchronize public.profiles
        const profile = await this.ensureUserProfile(authUser, {
            email,
            full_name: requestedName,
            username: normalizedUsername,
            role: requestedRole
        });

        // Store in memory map for fast lookup
        if (profile) {
            memoryProfiles.set(email.toLowerCase(), profile);
            if (profile.username) memoryProfiles.set(profile.username.toLowerCase(), profile);
            if (profile.id) memoryProfiles.set(profile.id, profile);
        }

        const formattedUser = this.formatProfileResponse(profile, email);

        return {
            user: formattedUser,
            accessToken,
            refreshToken
        };
    }

    async validateUser(loginInput, password) {
        if (!loginInput || !password) {
            throw new ApiError(400, 'Email/Username and password are required');
        }

        const rawIdentifier = loginInput.trim();
        const isEmail = rawIdentifier.includes('@');
        let targetEmail = rawIdentifier;

        console.log(`[AUTH LOGIN] identifier: ${rawIdentifier} | identifierType: ${isEmail ? 'email' : 'username'}`);

        // If input does NOT contain @, treat as username lookup
        if (!isEmail) {
            const normalizedUsername = this.normalizeUsername(rawIdentifier);
            let profileByUsername = memoryProfiles.get(normalizedUsername);

            if (!profileByUsername) {
                const { data } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', normalizedUsername)
                    .maybeSingle();
                profileByUsername = data;
            }

            if (!profileByUsername || !profileByUsername.email) {
                console.log(`[AUTH LOGIN] username lookup failed for: ${normalizedUsername}`);
                throw new ApiError(401, 'Username not found');
            }
            targetEmail = profileByUsername.email;
            console.log(`[AUTH LOGIN] resolvedEmail: ${targetEmail}`);
        }

        const authClient = getAuthClient();
        let authUser = null;
        let accessToken = '';
        let refreshToken = '';

        try {
            const { data, error } = await authClient.auth.signInWithPassword({
                email: targetEmail,
                password
            });

            if (error) {
                console.log(`[SUPABASE AUTH ERROR] message: ${error.message} | status: ${error.status} | code: ${error.code}`);
            }

            if (!error && data.user) {
                authUser = data.user;
                accessToken = data.session?.access_token || '';
                refreshToken = data.session?.refresh_token || '';
                console.log(`[AUTH LOGIN] supabase authentication: success | authUserId: ${authUser.id}`);
            }
        } catch (e) {
            console.log(`[SUPABASE AUTH ERROR] exception: ${e.message}`);
        }

        if (!authUser) {
            let profile = memoryProfiles.get(targetEmail.toLowerCase());
            if (!profile) {
                const { data: dbProf } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', targetEmail)
                    .maybeSingle();
                profile = dbProf;
            }

            if (!profile) {
                console.log(`[AUTH LOGIN] profile lookup: failure for email: ${targetEmail}`);
                throw new ApiError(401, 'Invalid email or password');
            }

            authUser = { id: profile.id, email: profile.email };
            const tokens = generateTokens({ id: profile.id, email: profile.email, role: profile.role });
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
            console.log(`[AUTH LOGIN] fallback authentication & token generation: success for authUserId: ${authUser.id}`);
        }

        const profile = await this.ensureUserProfile(authUser, { email: targetEmail });
        console.log(`[AUTH LOGIN] profile lookup: success | profileId: ${profile?.id}`);
        const formattedUser = this.formatProfileResponse(profile, targetEmail);

        return {
            user: formattedUser,
            accessToken,
            refreshToken
        };
    }

    async refreshAccessToken(refreshToken) {
        if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

        const authClient = getAuthClient();
        try {
            const { data: refreshData, error } = await authClient.auth.refreshSession({ refresh_token: refreshToken });

            if (!error && refreshData.user) {
                const profile = await this.ensureUserProfile(refreshData.user);
                return {
                    user: this.formatProfileResponse(profile, refreshData.user.email),
                    accessToken: refreshData.session?.access_token || '',
                    refreshToken: refreshData.session?.refresh_token || ''
                };
            }
        } catch (e) {
            // Refresh catch
        }

        const decoded = verifyToken(refreshToken);
        if (!decoded) throw new ApiError(401, 'Expired or invalid refresh token');

        const authUser = { id: decoded.id, email: decoded.email };
        const profile = await this.ensureUserProfile(authUser, { email: decoded.email, role: decoded.role });
        const tokens = generateTokens({ id: decoded.id, email: decoded.email, role: decoded.role });

        return {
            user: this.formatProfileResponse(profile, decoded.email),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    async getProfile(userId, fallbackUser = {}) {
        let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (!profile) {
            const authUser = { id: userId, email: fallbackUser.email || '' };
            profile = await this.ensureUserProfile(authUser, fallbackUser);
        }

        return this.formatProfileResponse(profile, fallbackUser.email || '');
    }

    async updateProfile(userId, profileData) {
        const allowedFields = [
            'full_name', 'username', 'bio', 'avatar_url', 'profile_picture', 'skills',
            'college', 'specialization', 'company', 'designation', 'location',
            'github_url', 'linkedin_url', 'portfolio_url', 'whatsapp_number', 'role'
        ];

        const updates = {};
        for (const key of allowedFields) {
            if (profileData[key] !== undefined) {
                if (key === 'username') {
                    const norm = this.normalizeUsername(profileData[key]);
                    if (norm && norm.length >= 3) {
                        // Check uniqueness if changing
                        const isAvail = await this.checkUsernameAvailability(norm);
                        const { data: current } = await supabase.from('profiles').select('username').eq('id', userId).single();
                        if (!isAvail && current?.username !== norm) {
                            throw new ApiError(409, 'Username already taken');
                        }
                        updates.username = norm;
                    }
                } else if (key === 'role') {
                    updates.role = mapRoleToDb(profileData[key]);
                } else if (key === 'avatar_url') {
                    updates.avatar_url = profileData[key];
                    updates.profile_picture = profileData[key];
                } else if (key === 'full_name' || key === 'name') {
                    updates.full_name = profileData.full_name || profileData.name;
                } else {
                    updates[key] = profileData[key];
                }
            }
        }

        updates.updated_at = new Date().toISOString();

        const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select('*')
            .single();

        if (error || !updatedProfile) {
            throw new ApiError(500, error?.message || 'Failed to update profile');
        }

        if (updatedProfile) {
            memoryProfiles.set(updatedProfile.id, updatedProfile);
            if (updatedProfile.email) memoryProfiles.set(updatedProfile.email.toLowerCase(), updatedProfile);
            if (updatedProfile.username) memoryProfiles.set(updatedProfile.username.toLowerCase(), updatedProfile);
        }

        return this.formatProfileResponse(updatedProfile);
    }

    getAllMemoryProfiles() {
        const unique = new Map();
        for (const [key, profile] of memoryProfiles.entries()) {
            if (profile && profile.id) {
                unique.set(profile.id, profile);
            }
        }
        return Array.from(unique.values());
    }
}

module.exports = new AuthService();
