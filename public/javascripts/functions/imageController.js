const multer = require("multer");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
const uploadFiles = upload.any();
const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
        } else if (err) {
            return res.send(err);
        }

        next();
    });
};

const resizeImages = async (req, res, next) => {
    try {
        if (!req.files) return next();

        req.body.images = [];
        await Promise.all(
            req.files.map(async file => {
                const filename = file.originalname.replace(/\..+$/, "");
                const newFilename = `${filename}${Date.now()}.jpeg`;

                await sharp(file.buffer)
                    .resize({
                        width: 400,
                        height: 400,
                        fit: 'contain',
                    })
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`public/images/${newFilename}`);
                req.body.images.push('images/' + newFilename);
            })
        );
        next();
    } catch (err) {
        console.log(err);
    }
};

const getResult = async (req, res, next) => {
    if (req.body.images.length <= 0) {
        return res.send(`You must select at least 1 image.`);
    }

    next();
};

module.exports = {
    uploadImages: uploadImages,
    resizeImages: resizeImages,
    getResult: getResult
};