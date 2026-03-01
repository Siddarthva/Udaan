/**
 * Global State for Platform Logic
 * Handles common operations across roles
 */

export const platformUtils = {
    // Simulate project stage progression
    nextStage: (currentStage) => {
        const stages = ["Idea", "Prototype", "MVP", "Pilot", "Scaling", "Commercialization"];
        const index = stages.indexOf(currentStage);
        return index < stages.length - 1 ? stages[index + 1] : currentStage;
    },

    // Calculate Innovation Score (composite)
    calculateScore: (metrics) => {
        const { traction, safety, scalability } = metrics;
        return Math.round((traction * 0.4) + (safety * 0.3) + (scalability * 0.3));
    }
};
