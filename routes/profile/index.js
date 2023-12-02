const express = require('express');
const fileUpload = require('express-fileupload');
const { ImageUploadsValidation } = require('../../middlewares/filesUploads');
const { isAuth } = require('../../middlewares/authentication');
const { sanitizeProfileInput, sanitizeQuerys, sanitizeParamsQuerys } = require('../../middlewares/validation');

const router = express.Router();

const { awaitPromotion } = require('./awaitPromotion');
const { edit } = require('./edit');

const { getEdit } = require('./getEdit');
const { profile } = require('./profile');
const { resetPicture } = require('./resetPicture');

router.put('/edit-profile', [
  isAuth,
  fileUpload({ createParentPath: true }),
  ImageUploadsValidation({ max: 1, errorUrl: '/user/profile/edit' }),
  sanitizeProfileInput,
], edit);

router.post('/awaiting-promotion', [isAuth], awaitPromotion);

router.get('/user/profile/edit', [isAuth, sanitizeQuerys], getEdit);
router.get('/user/profile/:username', [sanitizeParamsQuerys], profile);
router.get('/reset-profile-picture', [isAuth], resetPicture);

module.exports = router;
