import path from 'path';
import express from 'express';
import multer from 'multer';
//import { ensureAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only! (jpg, jpeg, png, webp)');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private/Admin

router.post(
  '/',
  //ensureAdmin,
  upload.single('image'),
  (req, res) => {
    res.status(200).send({
        message: 'File uploaded successfully',
        image: `/${req.file.path}`,
      });
  }
);                    
export default router;