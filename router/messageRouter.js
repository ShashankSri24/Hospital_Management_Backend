import express from 'express'
import { getAllMessages, sendMessage } from '../controller/messageController.js';
import { isAdminAuthenticated } from '../Middleware/authentication.js';

 
const router = express.Router();

router.post('/send',sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
export  default router;