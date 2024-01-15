import mongoose from "mongoose";

export const connectToDatabase = () => {
  const databaseLink: string = "mongodb://0.0.0.0:27017/bookInventory";

  mongoose.connect(databaseLink);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database " + databaseLink);
  });

  mongoose.connection.on("error", (err: any) => {
    console.log("Unable to connect to the database " + err);
  });
};
