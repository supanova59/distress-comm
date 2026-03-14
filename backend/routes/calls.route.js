import { Router } from "express";
import {
	getCalls,
	getCall,
	postCall,
} from "../controllers/calls.controller.js";

const callsRouter = Router();

callsRouter.get("/", getCalls);

callsRouter.get("/:id", getCall);

callsRouter.post("/", postCall);

export default callsRouter;
