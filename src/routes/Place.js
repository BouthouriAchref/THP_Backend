const express = require('express'),
    PlaceRoute = express.Router();
const place = require('../controller/place-controller')
const uploads = require('../middleware/multer')

PlaceRoute.post('/addPlace/:userId',uploads.upload.single('image'),place.addPlace);
PlaceRoute.get('/Place/:placeId', place.getPlaceById);
PlaceRoute.get('/Places', place.getAllPlaces);
PlaceRoute.put('/:placeId',uploads.upload.single('image') ,place.uploadImagePlace);





module.exports = PlaceRoute;