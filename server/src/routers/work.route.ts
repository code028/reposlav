import express from "express";
import { handleAddWork } from "../controllers/work.controller";

const router = express.Router({mergeParams: true});

router
	.post('/add', handleAddWork)

export {router as workRouter};