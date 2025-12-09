import express from 'express';
import { mediaController } from './media.controller';
import validateUserAuthority from '../../middleware/validateUserAuthority';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import { FOLDER_NAMES } from '../../../enums/files';
import validateRequest from '../../middleware/validateRequest';
import { mediaValidation } from './media.validation';
import parseMultipleFileData from '../../middleware/parseMultipleFiledata';

const router = express.Router();

router.post('/', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    parseMultipleFileData(FOLDER_NAMES.IMAGE),
    parseMultipleFileData(FOLDER_NAMES.VIDEO),
    parseMultipleFileData(FOLDER_NAMES.DOCUMENT),
    validateRequest(mediaValidation.createMediaZodSchema), mediaController.createMedia);

router.get('/', mediaController.getAllMedias);

router.get('/unpaginated', mediaController.getAllUnpaginatedMedias);

router.delete('/hard-delete/:id', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), mediaController.hardDeleteMedia);

router.patch('/:id', fileUploadHandler(),
    parseMultipleFileData(FOLDER_NAMES.IMAGE),
    parseMultipleFileData(FOLDER_NAMES.VIDEO),
    parseMultipleFileData(FOLDER_NAMES.DOCUMENT),
    validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    validateRequest(mediaValidation.updateMediaZodSchema), mediaController.updateMedia);

router.delete('/:id', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), mediaController.deleteMedia);

router.get('/:id', mediaController.getMediaById);

export const mediaRoutes = router;
