const express = require('express'),
    PlaceRoute = express.Router();
const place = require('../controller/place-controller')
const uploads = require('../middleware/multer')

PlaceRoute.post('/addPlace/:userId', place.addPlace);
PlaceRoute.get('/Place/:placeId', place.getPlaceById);
PlaceRoute.get('/Places', place.getAllPlaces);
PlaceRoute.get('/Places/check', place.getAllPlacesNoCheck);
PlaceRoute.get('/Places/Category/:catId', place.getPlaceByCategory);
PlaceRoute.get('/Places/Search/:word', place.getPlaceSearch);
PlaceRoute.put('/Places/check/:placeId', place.checkPlace);
PlaceRoute.put('/Places/addfavorite/:placeId/:userId', place.addPlaceToFavorite);
PlaceRoute.put('/Places/removefavorite/:placeId/:userId', place.removePlaceToFavorite);
PlaceRoute.post('/file/:placeId', uploads.upload.single('image'), place.uploadImagePlace);
PlaceRoute.post('/files/:placeId', uploads.upload.array('images'), place.uploadImagesPlace);
PlaceRoute.delete('/places/:placeId', place.deletePlace);

module.exports = PlaceRoute;