import cloudinary from "cloudinary";
import app from "./app.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
