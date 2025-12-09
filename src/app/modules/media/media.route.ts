import express from 'express';
import { mediaController } from './media.controller';
import validateUserAuthority from '../../middleware/validateUserAuthority';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';
import validateRequest from '../../middleware/validateRequest';
import { mediaValidation } from './media.validation';

const router = express.Router();

router.post('/', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    parseFileData(FOLDER_NAMES.IMAGE),
    validateRequest(mediaValidation.createMediaZodSchema), mediaController.createMedia);

router.get('/', mediaController.getAllMedias);

router.get('/unpaginated', mediaController.getAllUnpaginatedMedias);

router.delete('/hard-delete/:id', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), mediaController.hardDeleteMedia);

router.patch('/:id', fileUploadHandler(),
    parseFileData(FOLDER_NAMES.IMAGE), validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(mediaValidation.updateMediaZodSchema), mediaController.updateMedia);

router.delete('/:id', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), mediaController.deleteMedia);

router.get('/:id', mediaController.getMediaById);

export const mediaRoutes = router;
