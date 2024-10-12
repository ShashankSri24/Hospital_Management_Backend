import mongoose from "mongoose";
export const dbConnection =async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log('Database connected successfully')
        }
    catch(err){
      console.log('Database Server Error',err)
    }
 

}