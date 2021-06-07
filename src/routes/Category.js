const express = require('express'),
    CategoryRoute = express.Router();
const category = require('../controller/category-controller')
const uploads = require('../middleware/multer')

CategoryRoute.post('/addCat', category.addCategory);
CategoryRoute.post('/:catId', uploads.upload.single('image'), category.uploadImageCategory);
CategoryRoute.get('/', category.getAllCategory);
CategoryRoute.get('/:catId', category.getCategoryById);
CategoryRoute.delete('/deleteCat/:catId', category.deleteCategory);

module.exports = CategoryRoute;