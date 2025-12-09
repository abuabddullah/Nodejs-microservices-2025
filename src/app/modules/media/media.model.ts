import { Schema, model } from 'mongoose';
import { Imedia } from './media.interface';

const MediaSchema = new Schema<Imedia>({
     image: { type: String, required: true },
     title: { type: String,required: true },
     description: { type: String,required: true },
     isDeleted: { type: Boolean, default: false },
     deletedAt: { type: Date },
}, { timestamps: true });

MediaSchema.pre('find', function (next) {
     this.find({ isDeleted: false });
     next();
});

MediaSchema.pre('findOne', function (next) {
     this.findOne({ isDeleted: false });
     next();
});

MediaSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});       

export const Media = model<Imedia>('Media', MediaSchema);
