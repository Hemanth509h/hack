import { Request, Response } from 'express';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

// Note: Cloudinary will automatically fail or ignore inputs gracefully if it is
// missing configuration or if CLOUDINARY_URL / CLOUDINARY_CLOUD_NAME is not properly set
// Assuming the user has their config loaded in index.ts or inside their ENV directly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadStream = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const theTransformStream = cloudinary.uploader.upload_stream(
      { folder: `the_quad/${folder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    theTransformStream.end(buffer);
  });
};

/**
 * @desc    Process & Upload single dynamic image
 * @route   POST /api/v1/upload/image
 */
export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image appended to request' });
    }

    const { target = 'misc' } = req.body;

    // Convert via Sharp to Webp for CDN footprint optimizations
    const webpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const uploadResult = await uploadStream(webpBuffer, target);

    res.status(200).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      message: 'Image uploaded and processed successfully',
    });

  } catch (error: any) {
    res.status(500).json({ error: 'Upload controller failure', details: error.message });
  }
};

/**
 * @desc    Delete specified image from CDN
 * @route   DELETE /api/v1/upload/:publicId
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    // Cloudinary's public IDs involve slashes, meaning they might get passed url-encoded.
    const publicId = decodeURIComponent(req.params.publicId);
    
    // Safety check just in case
    if (!publicId.includes('the_quad')) {
        return res.status(403).json({ error: 'Deletion boundaries restricted' });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: 'Image successfully annihilated from CDN.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed wiping image memory' });
  }
};
