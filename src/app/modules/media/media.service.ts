import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { Imedia } from './media.interface';
import { Media } from './media.model';
import QueryBuilder from '../../builder/QueryBuilder';
import unlinkFile from '../../../shared/unlinkFile';

const createMedia = async (payload: Imedia): Promise<Imedia> => {
     const result = await Media.create(payload);
     if (!result) {
          if (payload.image) {
               payload.image.forEach((url) => {
                    unlinkFile(url);
               });
          }
          if (payload.video) {
               payload.video.forEach((url) => {
                    unlinkFile(url);
               });
          }
          if (payload.document) {
               payload.document.forEach((url) => {
                    unlinkFile(url);
               });
          }
          throw new AppError(StatusCodes.NOT_FOUND, 'Media not found.');
     }
     return result;
};

const getAllMedias = async (query: Record<string, any>): Promise<{ meta: { total: number; page: number; limit: number }; result: Imedia[] }> => {
     const queryBuilder = new QueryBuilder(Media.find(), query);
     const result = await queryBuilder.filter().sort().paginate().fields().modelQuery;
     const meta = await queryBuilder.countTotal();
     return { meta, result };
};

const getAllUnpaginatedMedias = async (): Promise<Imedia[]> => {
     const result = await Media.find();
     return result;
};

const updateMedia = async (id: string, payload: Partial<Imedia>): Promise<Imedia | null> => {
     const isExist = await Media.findById(id);
     if (!isExist) {
          if (payload.image) {
               payload.image.forEach((url) => {
                    unlinkFile(url);
               });
          }
          if (payload.video) {
               payload.video.forEach((url) => {
                    unlinkFile(url);
               });
          }
          if (payload.document) {
               payload.document.forEach((url) => {
                    unlinkFile(url);
               });
          }
          throw new AppError(StatusCodes.NOT_FOUND, 'Media not found.');
     }

     if (payload.image && isExist.image) {
          isExist.image.forEach((url) => {
               unlinkFile(url);
          });
     }
     if (payload.document && isExist.document) {
          isExist.document.forEach((url) => {
               unlinkFile(url);
          });
     }
     if (payload.video && isExist.video) {
          isExist.video.forEach((url) => {
               unlinkFile(url);
          });
     }
     return await Media.findByIdAndUpdate(id, payload, { new: true });
};

const deleteMedia = async (id: string): Promise<Imedia | null> => {
     const result = await Media.findById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Media not found.');
     }
     result.isDeleted = true;
     result.deletedAt = new Date();
     await result.save();
     return result;
};

const hardDeleteMedia = async (id: string): Promise<Imedia | null> => {
     const result = await Media.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Media not found.');
     }
     if (result.image) {
          result.image.forEach((url) => {
               unlinkFile(url);
          });
     }
     if (result.video) {
          result.video.forEach((url) => {
               unlinkFile(url);
          });
     }
     if (result.document) {
          result.document.forEach((url) => {
               unlinkFile(url);
          });
     }
     return result;
};

const getMediaById = async (id: string): Promise<Imedia | null> => {
     const result = await Media.findById(id);
     return result;
};

export const mediaService = {
     createMedia,
     getAllMedias,
     getAllUnpaginatedMedias,
     updateMedia,
     deleteMedia,
     hardDeleteMedia,
     getMediaById,
};
