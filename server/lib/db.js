import mongoose from "mongoose";

//function to connect to the mongodb database

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('database connected'));
    await mongoose.connect(process.env.MONGODB_URI); // Use the variable directly
  } catch (error) {
    console.log(error);
  }
}