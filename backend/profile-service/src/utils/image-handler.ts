import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import logger from './logger';
import { uploadToR2, deleteFromR2, validateR2Config } from './r2-client';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
const MAX_PHOTOS_PER_PROFILE = 6;

// Image sizes for optimization
const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
};

export interface ProcessedImage {
  id: string;
  key: string;           // R2 object key (stored in database)
  thumbnailKey: string;  // R2 thumbnail key (stored in database)
  originalSize: number;
  processedSize: number;
}

/**
 * Initialize R2 storage - validates configuration
 */
export async function initializeStorage(): Promise<void> {
  if (!validateR2Config()) {
    throw new Error('R2 configuration is incomplete. Check environment variables.');
  }
  logger.info('R2 storage initialized');
}

/**
 * Validate uploaded image file
 */
export function validateImage(file: Express.Multer.File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, HEIC, HEIF, and WebP images are allowed' };
  }

  return { valid: true };
}

/**
 * Process and upload image to R2
 * Creates thumbnail and optimized versions, uploads both to R2
 * Supports both memory storage (file.buffer) and disk storage (file.path)
 * Returns R2 object keys (NOT URLs - URLs are generated on-demand via presigning)
 */
export async function processImage(file: Express.Multer.File, userId: string): Promise<ProcessedImage> {
  const photoId = uuidv4();

  // Determine input source: disk storage uses file.path, memory storage uses file.buffer
  const inputSource = file.path || file.buffer;
  const usingDiskStorage = !!file.path;

  try {
    // Process main image (large size)
    const largeBuffer = await sharp(inputSource)
      .rotate() // Auto-rotate based on EXIF orientation AND strip all EXIF metadata (including GPS location)
      .resize(IMAGE_SIZES.large.width, IMAGE_SIZES.large.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, progressive: true })
      .withMetadata({}) // Explicitly remove all metadata for privacy
      .toBuffer();

    // Process thumbnail
    const thumbnailBuffer = await sharp(inputSource)
      .rotate() // Auto-rotate and strip EXIF from thumbnail too
      .resize(IMAGE_SIZES.thumbnail.width, IMAGE_SIZES.thumbnail.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .withMetadata({}) // Remove metadata from thumbnail
      .toBuffer();

    // Upload to R2
    // Key format: photos/{userId}/{photoId}.jpg
    const largeKey = `photos/${userId}/${photoId}.jpg`;
    const thumbnailKey = `photos/${userId}/${photoId}_thumb.jpg`;

    await Promise.all([
      uploadToR2(largeKey, largeBuffer, 'image/jpeg'),
      uploadToR2(thumbnailKey, thumbnailBuffer, 'image/jpeg'),
    ]);

    logger.info('Image processed and uploaded to R2', {
      photoId,
      originalSize: file.size,
      processedSize: largeBuffer.length,
      userId,
      largeKey,
      thumbnailKey,
      storageType: usingDiskStorage ? 'disk' : 'memory',
    });

    // Clean up temp file if using disk storage
    if (usingDiskStorage && file.path) {
      try {
        await fs.unlink(file.path);
        logger.debug('Cleaned up temp upload file', { path: file.path });
      } catch (cleanupError) {
        logger.warn('Failed to clean up temp upload file', { path: file.path, error: cleanupError });
      }
    }

    return {
      id: photoId,
      key: largeKey,
      thumbnailKey: thumbnailKey,
      originalSize: file.size,
      processedSize: largeBuffer.length,
    };
  } catch (error) {
    // Clean up temp file even on error if using disk storage
    if (usingDiskStorage && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (cleanupError) {
        logger.warn('Failed to clean up temp file after error', { path: file.path });
      }
    }
    logger.error('Failed to process image', { error, userId });
    throw new Error('Failed to process image');
  }
}

/**
 * Delete image files from R2
 * @param photoKey - The R2 object key (e.g., photos/user123/abc-123.jpg)
 */
export async function deleteImage(photoKey: string): Promise<void> {
  try {
    // Handle legacy local URLs - extract just the filename portion
    if (photoKey.startsWith('/uploads/')) {
      // Legacy format: /uploads/userId_photoId.jpg
      // We can't delete these from R2, just log and return
      logger.warn('Attempted to delete legacy local image', { photoKey });
      return;
    }

    // Delete main image
    await deleteFromR2(photoKey);

    // Delete thumbnail (derive key from main key)
    const thumbnailKey = photoKey.replace('.jpg', '_thumb.jpg');
    await deleteFromR2(thumbnailKey);

    logger.info('Image deleted from R2', { photoKey, thumbnailKey });
  } catch (error) {
    logger.error('Failed to delete image from R2', { error, photoKey });
    // Don't throw - deletion is best effort
  }
}

/**
 * Get photo ID from key or URL
 * Handles both R2 keys (photos/user/uuid.jpg) and legacy URLs (/uploads/user_uuid.jpg)
 */
export function getPhotoIdFromKey(keyOrUrl: string): string | null {
  const match = keyOrUrl.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
  return match ? match[0] : null;
}

/**
 * Check if user can upload more photos
 */
export function canUploadMorePhotos(currentPhotoCount: number): boolean {
  return currentPhotoCount < MAX_PHOTOS_PER_PROFILE;
}

// Legacy export for backwards compatibility
export const initializeUploadDirectory = initializeStorage;
export const getPhotoIdFromUrl = getPhotoIdFromKey;

export { MAX_PHOTOS_PER_PROFILE };
