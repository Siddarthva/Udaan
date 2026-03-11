import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_USER_KEY = 'udaan_user';
const STORAGE_SESSION_KEY = 'udaan_session';

const buildHandle = (name = '') => `@${name.trim().toLowerCase().replace(/\s+/g, '_') || 'udaan_user'}`;

const normalizeUser = (user = {}) => ({
    name: user.name || 'User',
    email: user.email || '',
    password: user.password || '',
    role: user.role || 'Innovator',
    bio:
        user.bio ||
        'Builder in the Udaan ecosystem, collaborating on high-impact innovation projects.',
    avatar: user.avatar || '',
    handle: user.handle || buildHandle(user.name),
});

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            /**
             * Signup: create a local user and log them in.
             * Expects: { name, email, password, role? }
             */
            signup: ({ name, email, password, role = 'Innovator' }) => {
                const user = normalizeUser({ name, email, password, role });

                // Persist user and session to localStorage
                try {
                    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
                    localStorage.setItem(
                        STORAGE_SESSION_KEY,
                        JSON.stringify({ isAuthenticated: true, email })
                    );
                } catch (e) {
                    console.error('[AUTH]: Failed to persist signup data', e);
                }

                set({ user, isAuthenticated: true });
                return user;
            },

            /**
             * Login: validate credentials against stored user.
             * Expects: { email, password }
             */
            login: ({ email, password }) => {
                let storedUser;

                try {
                    const raw = localStorage.getItem(STORAGE_USER_KEY);
                    if (!raw) {
                        throw new Error('No account found. Please sign up first.');
                    }
                    storedUser = JSON.parse(raw);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new Error('Stored user data is corrupted. Please clear your session.');
                    }
                    throw e;
                }

                if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
                    throw new Error('Invalid email or password.');
                }

                const normalizedUser = normalizeUser(storedUser);

                try {
                    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(normalizedUser));
                    localStorage.setItem(
                        STORAGE_SESSION_KEY,
                        JSON.stringify({ isAuthenticated: true, email })
                    );
                } catch (e) {
                    console.error('[AUTH]: Failed to persist session', e);
                }

                set({ user: normalizedUser, isAuthenticated: true });
                return normalizedUser;
            },

            /**
             * Logout: clear session and reset auth state.
             * The registered user data (STORAGE_USER_KEY) is kept so
             * the user can log in again without re-registering.
             */
            logout: () => {
                try {
                    localStorage.removeItem(STORAGE_SESSION_KEY);
                } catch (e) {
                    console.error('[AUTH]: Failed to clear session', e);
                }
                set({ user: null, isAuthenticated: false });
            },

            /**
             * Restore session on app startup.
             * Supports both the new schema and the older mock session shape.
             */
            loadUserFromStorage: () => {
                let session = null;
                let storedUser = null;

                try {
                    const sessionRaw = localStorage.getItem(STORAGE_SESSION_KEY);
                    const userRaw = localStorage.getItem(STORAGE_USER_KEY);

                    if (sessionRaw) session = JSON.parse(sessionRaw);
                    if (userRaw) storedUser = JSON.parse(userRaw);
                } catch (e) {
                    console.error('[AUTH]: Failed to parse stored auth data', e);
                    set({ user: null, isAuthenticated: false });
                    return;
                }

                // Backwards compatibility: handle old mock session shape
                if (session && session.user && !storedUser) {
                    const legacyUser = normalizeUser(session.user);
                    try {
                        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(legacyUser));
                        localStorage.setItem(
                            STORAGE_SESSION_KEY,
                            JSON.stringify({ isAuthenticated: true, email: legacyUser.email })
                        );
                    } catch (e) {
                        console.error('[AUTH]: Failed to migrate legacy session', e);
                    }
                    set({ user: legacyUser, isAuthenticated: true });
                    return;
                }

                if (session?.isAuthenticated && storedUser?.email) {
                    const hydratedUser = normalizeUser(storedUser);
                    set({ user: hydratedUser, isAuthenticated: true });
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            },

            // Alias for compatibility with newer naming in feature requirements.
            loadUserFromLocalStorage: () => {
                get().loadUserFromStorage();
            },

            /**
             * Update profile fields while keeping existing data.
             */
            updateProfile: (updates) => {
                const currentUser = get().user;
                if (!currentUser) return null;

                const updatedUser = normalizeUser({ ...currentUser, ...updates });

                try {
                    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
                } catch (e) {
                    console.error('[AUTH]: Failed to persist profile update', e);
                }

                set({ user: updatedUser });
                return updatedUser;
            },
        }),
        {
            name: 'udaan-auth-storage',
        }
    )
);
