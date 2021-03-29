const express = require('express');
const captureRouter = express.Router();
const helper = require('./utils');
const captureService = require('../models/captureService');

captureRouter
  .route('/')
  .get(helper.handlerWrapper(captureService.getCaptures))
  .post(helper.handlerWrapper(captureService.postCapture));

captureRouter
  .route('/:capture/potential_trees')
  .get(helper.handlerWrapper(captureService.getMockPotentialTrees));

captureRouter
  .route('/:capture_id')
  .get(helper.handlerWrapper(captureService.getCaptureById))
  .patch(
    helper.handlerWrapper(async (req, res) => {
      res.status(200);
    }),
  )
  .delete(
    helper.handlerWrapper(async (req, res) => {
      res.status(204);
    }),
  );

module.exports = captureRouter;
