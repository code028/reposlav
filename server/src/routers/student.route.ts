import express from "express";
import { handleAddStudent } from "../controllers/student.controller";

const router = express.Router({mergeParams: true});

router
	.post('/add', handleAddStudent)

export {router as studentRouter};