const express = require('express'),
    CategoryRoute = express.Router();
const category = require('../controller/category-controller')
const uploads = require('../middleware/multer')

CategoryRoute.post('/addCat', category.addCategory);
CategoryRoute.put('/:catId', uploads.upload.single('image'), category.uploadImageCategory);
CategoryRoute.get('/', category.getAllCategory);
CategoryRoute.get('/:catId', category.getCategoryById);
module.exports = CategoryRoute;