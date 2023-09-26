const profileRouter = require('express').Router();

const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../lib/auth');

profileRouter.get('/', (req, res, next) => {
    const { id, email, user_id } = req.query;

    if (user_id) {
        return profileController.getProfileByUserId(req, res, next);
    } else if (id) {
        return profileController.getProfileById(req, res, next);
    } else if (email) {
        return profileController.getProfileByEmail(req, res, next);
    } else {
        return profileController.getProfiles(req, res, next);
    }
});
profileRouter.get('/:user_id', profileController.getProfileByUserId);
profileRouter.post('/', isAuthenticated, profileController.createProfile);
profileRouter.put('/:user_id', isAuthenticated, profileController.updateProfileByUserId);
profileRouter.delete('/:user_id', isAuthenticated, profileController.deleteProfileByUserId);

profileRouter.post('/:user_id/uploadProfileImage', isAuthenticated, profileController.uploadProfileImage);

profileRouter.get('/suggestion/:user_id', isAuthenticated, profileController.getSuggestionResult);
profileRouter.post('/suggestion/:user_id', isAuthenticated, profileController.createSuggestionJob);

module.exports = profileRouter;
