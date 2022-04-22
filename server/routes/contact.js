import express from 'express';
const route = express.Router();
import { contactFormHandler } from './../controller/contact.js';
route.post('/', contactFormHandler);
export default route;
