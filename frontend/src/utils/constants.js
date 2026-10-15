export const DOMAINS = [
    "All",
    "AgriTech",
    "HealthTech",
    "CleanTech",
    "FinTech",
    "DeepTech",
    "EdTech"
];

// Must match the stages persisted by the API: idea | mvp | scaling.
export const STAGES = [
    "All",
    "Idea",
    "MVP",
    "Scale"
];

export const TRL_LEVELS = [
    { level: 3, description: "Analytical and experimental proof-of-concept" },
    { level: 4, description: "Component validation in laboratory environment" },
    { level: 5, description: "Component validation in relevant environment" },
    { level: 6, description: "System model demonstration in relevant environment" },
    { level: 7, description: "System prototype demonstration in operational environment" }
];

export const STORAGE_BUCKETS = {
    PITCH_DECKS: "pitch-decks",
    LOGOS: "startup-logos",
    COVERS: "startup-covers",
    AVATARS: "avatars",
    UPDATES: "startup-updates",
    DOCUMENTS: "startup-documents"
};
