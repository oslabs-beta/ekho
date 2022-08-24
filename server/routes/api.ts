import { Request, Response } from "express";
import { RequestHandler } from 'express';
// const express = require('express');
import express from 'express';
// const apiController = require('../controllers/apiController');
// const dbController = require('../controllers/dbController');
const router = express.Router();
import apiController from '../controllers/apiController';
import dbController from '../controllers/dbController';

// JEC: Not sure if we wanted to use a router or not, but I started one. Also, should we import RequestHandler so we don't have to specify param types?
router.get('/',
  dbController.getExperiments,
  (req: Request, res: Response) => res.status(200).json(res.locals.experiments)
);

// module.exports = router;
export default router;