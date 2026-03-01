/**
 * Mock API Utility: Simulates network latency and consistent Promise behavior.
 * Used to ensure the frontend feels "live" even without a connected backend.
 */
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * DATABASE SIMULATION (LocalStorage) 💾
 * We maintain a local mock database to persist changes across reloads.
 */
const INITIAL_DATA = {
    users: {
        innovator: {
            id: "u1",
            name: "Aarav Patel",
            email: "aarav@innovate.co",
            role: "Innovator",
            avatar: "AP",
            bio: "Building sustainable agri-tech solutions for rural India.",
            projects: ["p1"],
            followers: 1205,
            domain: "AgriTech",
        },
        mentor: {
            id: "u2",
            name: "Dr. Sarah Khan",
            email: "sarah@expert.is",
            role: "Mentor",
            avatar: "SK",
            bio: "Ex-Google. Helping startups navigate the valley of death.",
            expertise: ["AI", "HealthTech"],
            domain: "HealthTech",
        },
        sponsor: {
            id: "u3",
            name: "Vikram Ventures",
            email: "vikram@vv.vc",
            role: "Sponsor",
            avatar: "VV",
            bio: "Seed stage funding for high-impact social enterprises.",
            portfolio: 12,
            funds_deployed: "₹4.5Cr",
            domain: "CleanTech",
        }
    },
    projects: [
        { id: "p1", title: "AgroFlow AI", description: "Predictive irrigation systems.", ownerId: "u1", status: "Seed", raised: 1200000, domain: "AgriTech", team: ["u1"], updates: [] },
    ],
    messages: [],
    notifications: [
        { id: "n1", userId: "u1", title: "Welcome to Udaan", message: "Your innovator node is now live. Explore mentors today.", read: false, createdAt: new Date().toISOString() }
    ]
};

// Singleton Mock DB Instance
class MockDB {
    constructor() {
        this.key = 'udaan_mock_db';
        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, JSON.stringify(INITIAL_DATA));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.key));
    }

    saveData(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}

export const db = new MockDB();
