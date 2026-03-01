const express = require('express');
const projectController = require('./project.controller');
const authenticate = require('../../middleware/auth');

const router = express.Router();

/**
 * Projects Module Routes 🏗️
 * Handles startup discovery and creation workflows.
 */

// Global Discovery (Publicly accessible)
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getDetails);

// Manage Nodes (Protected: authentication required)
router.post('/launch', authenticate, projectController.launchNode);

// Update/Delete (To be implemented with ownership checks)
router.patch('/:id', authenticate, (req, res) => res.json({ msg: "Update draft node" }));

module.exports = router;
