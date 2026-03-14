import mongoose from "mongoose";

const connectDB = async (uri) => {
	await mongoose
		.connect(uri)
		.then(() => {
			console.log("DB connected");
		})
		.catch((err) => {
			console.log("DB connection failed");
			console.log(err);
			process.exit(1);
		});
};

export default connectDB;
