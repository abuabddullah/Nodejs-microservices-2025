import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { postController } from './post.controller';
import { postValidation } from './post.validation';

const router = express.Router();

router.post('/', auth(USER_ROLES.USER), validateRequest(postValidation.createPostZodSchema), postController.createPost);

router.get('/', postController.getAllPosts);

router.get('/unpaginated', postController.getAllUnpaginatedPosts);

router.delete('/hard-delete/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), postController.hardDeletePost);

router.patch('/:id', auth(USER_ROLES.USER), validateRequest(postValidation.updatePostZodSchema), postController.updatePost);

router.delete('/:id', auth(USER_ROLES.USER), postController.deletePost);

router.get('/:id', postController.getPostById);

export const postRoutes = router;
