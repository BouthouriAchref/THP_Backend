const express = require('express'),
    EvaluationRoute = express.Router();
const EvaluationController = require('../controller/evaluation-controller')

EvaluationRoute.post('/:placeId/:userId', EvaluationController.addEvaluation);

module.exports = EvaluationRoute;