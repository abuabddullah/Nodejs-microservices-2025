import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import validateUserAuthority from '../../middleware/validateUserAuthority';
import validateRequest from '../../middleware/validateRequest';
import { postController } from './post.controller';
import { postValidation } from './post.validation';

const router = express.Router();

router.post('/', validateUserAuthority(USER_ROLES.USER), validateRequest(postValidation.createPostZodSchema), postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/unpaginated', postController.getAllUnpaginatedPosts);

router.delete('/hard-delete/:id', validateUserAuthority(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), postController.hardDeletePost);

router.patch('/:id', validateUserAuthority(USER_ROLES.USER), validateRequest(postValidation.updatePostZodSchema), postController.updatePost);

router.delete('/:id', validateUserAuthority(USER_ROLES.USER), postController.deletePost);

router.get('/:id', postController.getPostById);

export const postRoutes = router;
