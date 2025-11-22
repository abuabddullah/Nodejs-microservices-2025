import mongoose, { Schema, model } from 'mongoose';
import { Ipost } from './post.interface';

const PostSchema = new Schema<Ipost>(
     {
          user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          content: {
               type: String,
               required: true,
          },
          title: {
               type: String,
               required: true,
          },
          mediaIds: [
               {
                    type: String,
               },
          ],
          isDeleted: {
               type: Boolean,
               default: false,
          },
          deletedAt: {
               type: Date,
          },
     },
     { timestamps: true },
);

PostSchema.pre('find', function (next) {
     this.find({ isDeleted: false });
     next();
});

PostSchema.pre('findOne', function (next) {
     this.findOne({ isDeleted: false });
     next();
});

PostSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Post = model<Ipost>('Post', PostSchema);
