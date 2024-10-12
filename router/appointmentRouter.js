import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../Middleware/authentication.js";
import express  from "express";
const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus)
router.get('/appointments/getall',isAdminAuthenticated,getAllAppointments);
router.delete('/delete/:id',isAdminAuthenticated,deleteAppointment)
export default router;