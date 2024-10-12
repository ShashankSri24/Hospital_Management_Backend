import express from "express";
import {  loginPatient, logoutpatient, patientRegister } from "../controller/UserController.js";
import { isPatientAuthenticated } from "../Middleware/authentication.js";
import { getAllDoctors, getAllUsers } from "../controller/AdminController.js";




const router = express.Router();

router.post('/patient/register',patientRegister)
router.post('/patient/login',loginPatient)
router.get('/patient/logout',isPatientAuthenticated, logoutpatient)
router.get("/patient",getAllUsers)
router.get("/patient/doctor",getAllDoctors)

export default router