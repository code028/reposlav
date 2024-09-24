import express from "express";
import { handleAddFile } from "../controllers/file.controller";

const router = express.Router({mergeParams: true});

router
	.post('/add', handleAddFile)

export {router as fileRouter};