import { User } from "../models/UserSchema.js";
import bcrypt from 'bcrypt';
import { catchAsyncErrors } from "../Middleware/CatchAsync.js";
import ErrorHandler from "../Middleware/ErrorHandler.js";
import { webToken } from "../utils/JwtToken.js";

    export const patientRegister = catchAsyncErrors(async (req, res, next) => {
        const { firstName, lastName, email, phone, dob, gender, password } =
          req.body;
        if (
          !firstName ||!lastName || !email || !phone ||!dob ||   !gender ||!password 
          ) {
          return next(new ErrorHandler("Please Fill All Credentials !", 400));
        }
        let isRegistered = await User.findOne({ email });
        if (isRegistered) {
          return next(new ErrorHandler("User already Registered!", 400));
        }
    try{
        
        const hashPassword = await bcrypt.hash(password,10)
       let user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            password : hashPassword,
            role : "Patient",
          })
          webToken(user,"Patient has Registered Successfully",200,res)
        
          
          
    }catch(err){
     console.log('Something went wrong',err)
    }
       
    }); 
   
    export const loginPatient = catchAsyncErrors(async (req, res, next) => {
      const { email, password, role  } = req.body;
      if (!email || !password || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
      }
    
      const isPatient = await User.findOne({ email }).select("+password");
      if (!isPatient) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
      }
    
      const comparePassword = await bcrypt.compare(password, isPatient.password);
      if (!comparePassword) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect'
        });
      }
    
      if (role !== isPatient.role) {
        return next(new ErrorHandler("User Not found in this role", 400));
      }
      webToken(isPatient, "Patient logged In Successfully", 200, res);
     
    });
    
  
  export const logoutpatient = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure:true,
      sameSite:"None"
      })
      .json({
        success: true,
        message: "Patient Logged Out Successfully.",
      });
  });