import { User } from "../models/UserSchema.js";
import { catchAsyncErrors } from "../Middleware/CatchAsync.js";
import ErrorHandler from "../Middleware/ErrorHandler.js";
import cloudinary from "cloudinary";

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const Formats = ["image/png", "image/jpg", "image/jpeg","image/webp"];
    if (!Formats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      password,
      doctorDepartment,
      
  } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment 
    ) {
      return res.status(400).json({
        success:false,
        message:'Please Fill All Credentials!'
      })
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(
        new ErrorHandler("Doctor With This Email Already Exists!", 400)
      );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error:",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
          new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
        );
      }
      const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        role:"Doctor",
        doctorDepartment,
        docAvatar: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      });
      res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
      });
})



















    // export const DoctorRegister = catchAsyncErrors(async (req, res, next) => {
    //     const { firstName, lastName, email, phone, dob, gender, password ,doctor} =
    //       req.body;
    //     if (
    //       !firstName ||!lastName || !email || !phone ||!dob ||   !gender ||!password
    //       ) {
    //       return next(new ErrorHandler("Please Fill All Credentials !", 400));
    //     }
    //     const isRegistered = await User.findOne({ email });
    //     if (isRegistered) {
    //       return next(new ErrorHandler("Admin with this email address  already exits!", 400)).json({
    //         success:'false',
    //         message:'Admin with this email address  already exits!'
    //       });
         
    //     }
       
    // try{
        
    //     const hashPassword = await bcrypt.hash(password,10)
    //     const Docter = await User.create({
    //         firstName,
    //         lastName,
    //         email,
    //         phone,
    //         dob,
    //         gender,
    //         password : hashPassword,
    //         role:'Docter'
    //       })
    //       webToken(Docter,'Successfully Registered',200,res)
    //       return res.status(200).json({
    //         success:true,
    //         message:'Docter Registered!'
    //       });
    // }catch(err){
    //  console.log('Something went wrong',err)
    // }
       
    // }); 
    
    