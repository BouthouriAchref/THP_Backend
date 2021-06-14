const express = require('express'),
    EvaluationRoute = express.Router();
const EvaluationController = require('../controller/evaluation-controller')

EvaluationRoute.post('/:placeId/:userId', EvaluationController.addEvaluation);
EvaluationRoute.delete('/:placeId/:evalId', EvaluationController.deleteEvaluation);

module.exports = EvaluationRoute;