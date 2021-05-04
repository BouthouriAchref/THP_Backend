const multer = require('multer')
//const path = require('path')

// module.exports = multer({
//     storage: multer.diskStorage({}),
//     fileFilter: (req ,file,cb)=> {
//         let ext = path.extname(file.originalname);
//         if (ext !==".jpg" && ext !== ".jpeg" && ext !== ".png"){
//             cb(new Error("File type is not sipported"),false);
//             return
//         }
//         cb(null,true);
//     },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        console.log('----',file.originalname)
        console.log(file)
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});