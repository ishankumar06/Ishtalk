import { v2 as cloudinary } from "cloudinary";

// Log environment variables to verify they are set (do NOT log api_secret for security)
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "Not set");
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY || "Not set");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default cloudinary;
