import mongoose from "mongoose";

const callsSchema = new mongoose.Schema(
	{
		disaster_type: { type: String, required: true },
		severity: { type: String },
		location: { type: [Number, Number], required: true },
		is_active: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const callsModel = mongoose.model("calls-collection", callsSchema);

export default callsModel;
