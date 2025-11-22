import { Types } from 'mongoose';
export interface Ipost {
     user: Types.ObjectId;
     title: string;
     content: string;
     mediaIds?: string[];
     createdAt: Date;
     updatedAt: Date;
     isDeleted: boolean;
     deletedAt?: Date;
}

export type IpostFilters = {
     searchTerm?: string;
};
