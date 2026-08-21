const aiService = require('./service');

class AIController {
    async generateBio(req, res) {
        const bio = await aiService.generateBio(req.body);
        res.status(200).json({ bio });
    }

    async generateStartupDescription(req, res) {
        const description = await aiService.generateStartupDescription(req.body);
        res.status(200).json({ description });
    }

    async generateStartupNames(req, res) {
        const names = await aiService.generateStartupNames(req.body);
        res.status(200).json({ names });
    }

    async generateElevatorPitch(req, res) {
        const pitch = await aiService.generateElevatorPitch(req.body);
        res.status(200).json({ pitch });
    }
}

module.exports = new AIController();
