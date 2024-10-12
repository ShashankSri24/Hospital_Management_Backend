import express from "express";
import { AdminRegister, getAllDoctors, getAllUsers, logoutAdmin,loginAdmin  } from "../controller/AdminController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../Middleware/authentication.js";
import { addNewDoctor } from "../controller/DocterController.js";
import { getAllMessages } from "../controller/messageController.js";

const router = express.Router();

router.post('/adminRegister', AdminRegister )
router.get("/admin/logout", logoutAdmin);
router.get('/doctors',getAllDoctors)
router.get('/admin/me',isAdminAuthenticated,getAllUsers)
router.get('/admin/patient',isPatientAuthenticated,getAllUsers)
router.post('/admin/login',loginAdmin)
router.post('/admin/doctor/addNew',isAdminAuthenticated,addNewDoctor)
router.get('/admin/message/',isAdminAuthenticated,getAllMessages)
export default router