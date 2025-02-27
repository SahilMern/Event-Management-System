import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const databaseUrl = process.env.databaseurl;

//TODO:- Node js && mongodb Connections
const mongoDbConnection = async () => {
  try {
    await mongoose.connect(databaseUrl, {});
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

mongoDbConnection();
