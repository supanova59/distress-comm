import callsModel from "../models/calls.model.js";
const getCalls = async (req, res) => {
	try {
		const calls = await callsModel.aggregate([
			{
				$match: {
					is_active: true,
				},
			},
		]);
		res.status(200).json(calls);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: "Failed to fetch calls",
		});
	}
};

const getCall = async (req, res) => {
	try {
		const { id } = req.params;
		const call = await callsModel.find({ _id: id });
		if (!call) return res.status(404).json({ error: "Call not found" });
		res.status(200).json(call);
	} catch (err) {
		res.status(500).json("Failed to fetch call");
	}
};

const postCall = async (req, res) => {
	try {
		const newCall = await callsModel.create({
			...req.body,
		});
		if (!newCall) {
			return res.status(500).json({ error: "Failed to create new call" });
		}

		res.status(200).json("worked");
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to create new call" });
	}
};

export { getCalls, getCall, postCall };
