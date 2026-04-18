import mongoose, { Schema, Document } from 'mongoose';

export ;
  floorMapData?; // JSON representation of floor bounding boxes if needed
}

const LocationSchema = new Schema({
  name: {
    type,
    required: true,
    trim: true,
  },
  buildingCode: {
    type,
    trim: true,
    index: true,
  },
  description,
  coordinates: {
    type: {
      type,
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

export const Location = mongoose.model('Location', LocationSchema);
