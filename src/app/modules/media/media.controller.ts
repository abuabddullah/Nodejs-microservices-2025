import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { mediaService } from './media.service';

const createMedia = catchAsync(async (req: Request, res: Response) => {
     const result = await mediaService.createMedia(req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Media created successfully',
          data: result,
     });
});

const getAllMedias = catchAsync(async (req: Request, res: Response) => {
     const result = await mediaService.getAllMedias(req.query);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Medias retrieved successfully',
          data: result,
     });
});

const getAllUnpaginatedMedias = catchAsync(async (req: Request, res: Response) => {
     const result = await mediaService.getAllUnpaginatedMedias();

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Medias retrieved successfully',
          data: result,
     });
});

const updateMedia = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await mediaService.updateMedia(id, req.body);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Media updated successfully',
          data: result || undefined,
     });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await mediaService.deleteMedia(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Media deleted successfully',
          data: result || undefined,
     });
});

const hardDeleteMedia = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await mediaService.hardDeleteMedia(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Media deleted successfully',
          data: result || undefined,
     });
});

const getMediaById = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await mediaService.getMediaById(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Media retrieved successfully',
          data: result || undefined,
     });
});  

export const mediaController = {
     createMedia,
     getAllMedias,
     getAllUnpaginatedMedias,
     updateMedia,
     deleteMedia,
     hardDeleteMedia,
     getMediaById
};
