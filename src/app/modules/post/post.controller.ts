import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IJWTpayload } from '../../interface/common.interface';
import { postService } from './post.service';

const createPost = catchAsync(async (req: Request, res: Response) => {
     const result = await postService.createPost(req.body, req.user as IJWTpayload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post created successfully',
          data: result,
     });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
     const result = await postService.getAllPosts(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Posts retrieved successfully',
          data: result,
     });
});

const getAllUnpaginatedPosts = catchAsync(async (req: Request, res: Response) => {
     const result = await postService.getAllUnpaginatedPosts();

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Posts retrieved successfully',
          data: result,
     });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await postService.updatePost(id, req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post updated successfully',
          data: result || undefined,
     });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await postService.deletePost(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post deleted successfully',
          data: result || undefined,
     });
});

const hardDeletePost = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await postService.hardDeletePost(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post deleted successfully',
          data: result || undefined,
     });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await postService.getPostById(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Post retrieved successfully',
          data: result || undefined,
     });
});

export const postController = {
     createPost,
     getAllPosts,
     getAllUnpaginatedPosts,
     updatePost,
     deletePost,
     hardDeletePost,
     getPostById,
};
