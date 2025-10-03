import express from 'express';
import { upload, cloudinary } from '../middleware/uploadCloudinary.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload multiple images to Cloudinary
// @access  Private/Admin
router.post('/', (req, res) => {
  upload.array('images', 3)(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'No files uploaded' });
    }

    try {
      const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'proshop', resource_type: 'image' }, // optional folder in Cloudinary
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            }
          );
          stream.end(file.buffer);
        });
      };

      const uploadPromises = req.files.map((file) => uploadFile(file));
      const uploadedImages = await Promise.all(uploadPromises);

      res.status(200).send({
        images: uploadedImages, // array of { url, public_id }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error processing uploaded files' });
    }
  });
});

// @route   DELETE /api/upload/:public_id
// @desc    Delete image from Cloudinary
// @access  Private/Admin
router.delete('/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    if (!public_id) {
      return res.status(400).json({ message: 'public_id is required' });
    }
    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Image deleted successfully', public_id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error });
  }
});

export default router;