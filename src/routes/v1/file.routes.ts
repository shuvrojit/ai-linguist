// routes/fileRoutes.ts
import { Router } from 'express';
import { FileController } from '../../controllers/file.controller';
import multer from 'multer';

const fileRouter = Router();
const fileController = new FileController();

// Configure multer for memory storage (we'll handle the actual storage ourselves)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow PDF and DOCX files
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
});

// File upload route
fileRouter.post('/upload', upload.single('file'), fileController.uploadFile);

// Get file by ID
fileRouter.get('/:id', fileController.getFile);

// Delete file
fileRouter.delete('/:id', fileController.deleteFile);

// Get all files for a user
fileRouter.get('/user/:userId', fileController.getUserFiles);

export default fileRouter;
