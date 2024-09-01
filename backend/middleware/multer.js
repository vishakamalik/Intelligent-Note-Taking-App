import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log(file)
    const name = file.fieldname + "-" + Date.now() + ".pdf";
    req.userfile = name;
    cb(null, name);
  },
});

export const upload = multer({ storage: storage });
