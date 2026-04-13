import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  buildingCode?: string;
  description?: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  floorMapData?: any; // JSON representation of floor bounding boxes if needed
}

const LocationSchema = new Schema<ILocation>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  buildingCode: {
    type: String,
    trim: true,
    index: true,
  },
  description: String,
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  floorMapData: Schema.Types.Mixed
}, { timestamps: true });

// 2dsphere index for radius/geospatial queries
LocationSchema.index({ coordinates: '2dsphere' });
// Text index for standard search
LocationSchema.index({ name: 'text', buildingCode: 'text' });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
