/**
 * Ecosystem Role Metadata
 */

export const ROLE_PERMISSIONS = {
  Innovator: {
    access: ["projects", "funding", "mentors", "community", "profile"],
    primaryAction: "Create Project"
  },
  Mentor: {
    access: ["mentees", "requests", "sessions", "resources", "community", "profile"],
    primaryAction: "Evaluate Project"
  },
  Sponsor: {
    access: ["discover", "pipeline", "watchlist", "portfolio", "reports", "community", "profile"],
    primaryAction: "Invest Capital"
  },
  Admin: {
    access: ["ecosystem-metrics", "compliance", "user-management", "program-ops", "community", "profile"],
    primaryAction: "System Audit"
  }
};

export const MOCK_USERS = [
  { id: "usr_1", name: "Ananya Sharma", role: "Innovator", email: "ananya@udaan.in" },
  { id: "usr_2", name: "Dr. Vikram Seth", role: "Mentor", email: "vikram@udaan.in" },
  { id: "usr_3", name: "Global Venture Fund", role: "Sponsor", email: "gvf@udaan.in" },
  { id: "usr_4", name: "Ministry Admin", role: "Admin", email: "admin@udaan.in" }
];
