import multer from 'multer';

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, '/assets');
  },
  filename: function (req: any, file: { originalname: any }, cb: (arg0: null, arg1: any) => void) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage });
