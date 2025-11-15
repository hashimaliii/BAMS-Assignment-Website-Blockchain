const bamsService = require('../services/bamsService');

/**
 * Handles the GET request to validate the entire three-layered blockchain structure.
 * Returns a report detailing the validity status of every department, class, and student chain.
 */
const validateSystemIntegrity = (req, res) => {
    try {
        const validationResult = bamsService.runFullValidation();

        if (validationResult.overallValid) {
            res.status(200).json({
                message: '✅ System Integrity Check: All chains are valid and cryptographically linked.',
                status: 'VALID',
                report: validationResult.report
            });
        } else {
            res.status(200).json({ // Still 200 OK, but status is INVALID, as the check itself succeeded
                message: '❌ WARNING: System Integrity compromised! One or more chains are invalid or links are broken.',
                status: 'INVALID',
                report: validationResult.report
            });
        }
    } catch (error) {
        // Catch any unexpected runtime errors
        res.status(500).json({ error: 'System validation failed due to a server error.' });
    }
};

module.exports = {
    validateSystemIntegrity
};