const { supabase } = require('../../config/supabase');
const ApiError = require('../../utils/ApiError');



class CommunityService {
    async getMembers(filters = {}) {
        const { role, search, college, company, sort } = filters;
        console.log('Community API Query Filters:', { role, search, college, company, sort });

        let profiles = [];

        try {
            let query = supabase.from('profiles').select('*');

            if (role && role.toLowerCase() !== 'all') {
                query = query.ilike('role', role);
            }
            if (college && college.trim()) {
                query = query.ilike('college', `%${college.trim()}%`);
            }
            if (company && company.trim()) {
                query = query.ilike('company', `%${company.trim()}%`);
            }

            const { data, error } = await query;

            if (!error && data && data.length > 0) {
                profiles = data;
            }
        } catch (err) {
            console.error('Community Supabase query error:', err.message);
        }

        // Include any dynamically registered profiles from memory map
        const authService = require('../auth/service');
        const memoryList = authService.getAllMemoryProfiles ? authService.getAllMemoryProfiles() : [];
        for (const mp of memoryList) {
            if (!profiles.some(p => p.id === mp.id)) {
                profiles.push(mp);
            }
        }

        // Apply in-memory search filtering safely
        if (search && search.trim()) {
            const term = search.trim().toLowerCase();
            profiles = profiles.filter(p =>
                (p.username || '').toLowerCase().includes(term) ||
                (p.full_name || p.name || '').toLowerCase().includes(term) ||
                (p.bio || '').toLowerCase().includes(term) ||
                (Array.isArray(p.skills) ? p.skills.join(' ') : (p.skills || '')).toLowerCase().includes(term) ||
                (p.college || '').toLowerCase().includes(term) ||
                (p.specialization || '').toLowerCase().includes(term) ||
                (p.company || '').toLowerCase().includes(term)
            );
        }

        if (role && role.toLowerCase() !== 'all') {
            profiles = profiles.filter(p => (p.role || '').toLowerCase() === role.toLowerCase());
        }

        let members = profiles.map(p => this.formatProfile(p));

        if (sort === 'alphabetical') {
            members.sort((a, b) => a.full_name.localeCompare(b.full_name));
        } else if (sort === 'followers') {
            members.sort((a, b) => b.followers_count - a.followers_count);
        } else {
            members.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        }

        return members;
    }

    formatProfile(p) {
        let skillsArray = [];
        if (Array.isArray(p.skills)) {
            skillsArray = p.skills;
        } else if (typeof p.skills === 'string') {
            skillsArray = p.skills.split(',').map(s => s.trim()).filter(Boolean);
        }

        let availability = 'Looking for Team';
        if (p.role?.toLowerCase() === 'mentor') availability = 'Looking for Mentees';
        if (p.role?.toLowerCase() === 'sponsor') availability = 'Looking for Funding';
        if (p.availability) availability = p.availability;

        return {
            id: p.id,
            username: p.username || '',
            full_name: p.full_name || p.name || 'Community Member',
            avatar_url: p.avatar_url || p.profile_picture || null,
            role: p.role || 'innovator',
            college: p.college || '',
            specialization: p.specialization || '',
            company: p.company || '',
            bio: p.bio || '',
            skills: skillsArray,
            followers_count: p.followers_count || 0,
            availability,
            is_verified: true,
            created_at: p.created_at || new Date().toISOString()
        };
    }
}

module.exports = new CommunityService();
