const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary Storage Provider Initialized');
} else {
  logger.warn('Cloudinary credentials not set in environment. Mock/Local fallback will be active.');
}

/**
 * Storage Service - Abstracted interface for file uploads
 */
const storageService = {
  /**
   * Upload buffer to Cloudinary or fallback
   */
  uploadStream: async (fileBuffer, fileName, mimeType, folder = 'smart-doc-analyzer') => {
    // If Cloudinary credentials are available, stream upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      return new Promise((resolve, reject) => {
        const isImage = mimeType && (mimeType.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(fileName));
        const resourceType = isImage ? 'image' : 'raw';
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            public_id: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          },
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload failed:', error);
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format || mimeType,
              bytes: result.bytes,
            });
          }
        );
        stream.end(fileBuffer);
      });
    }

    // Fallback simulation for local development without credentials
    logger.info(`Simulated storage upload for: ${fileName}`);
    return {
      url: `https://storage.placeholder.com/${fileName}`,
      publicId: `mock_${Date.now()}_${fileName}`,
      format: mimeType,
      bytes: fileBuffer.length,
    };
  },

  /**
   * Delete file by publicId (handles raw vs image)
   */
  deleteFile: async (publicId, resourceType = 'raw') => {
    if (process.env.CLOUDINARY_CLOUD_NAME && publicId && !publicId.startsWith('mock_')) {
      try {
        const validResourceType = resourceType === 'auto' ? 'raw' : resourceType;
        let res = await cloudinary.uploader.destroy(publicId, { resource_type: validResourceType });
        if (res && res.result === 'not found') {
          res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        }
        return res;
      } catch (err) {
        logger.warn(`Cloudinary file deletion notice: ${err.message}`);
        return { result: 'ignored' };
      }
    }
    return { result: 'ok' };
  },
};

module.exports = storageService;
