import express from 'express';
const router = express.Router();
import { getdbdata } from './../controller/dbdata.js';
import { authenticateUser } from './../controller/authenticate.js';

router.get('/', authenticateUser, getdbdata);

export default router;
