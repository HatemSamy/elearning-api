import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const HME = (err, req, res, next) => {
    if (err) {
        console.error('Multer Error:', err);
        return res.status(400).json({ 
            message: "File upload error", 
            error: err.message || err 
        });
    }
    next();
};

export function myMulter(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, `../../uploads/${folderName}`);
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            cb(null, nanoid() + "_" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed types: ' + allowedMimeTypes.join(', ')), false);
        }
    };

    return multer({ 
        storage, 
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });
}




// export function myMulter(customValidation=fileValidation.image) {
 
//     const storage = multer.diskStorage({})

//     function fileFilter(req, file, cb) {
//         if (customValidation.includes(file.mimetype)) {
//             cb(null, true)
//         } else {
//             cb('invalid format', false)
//         }
//     }
//     const upload = multer({ fileFilter, storage })
//     return upload
// }