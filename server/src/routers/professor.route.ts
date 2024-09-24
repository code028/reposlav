import express from "express";

// Controllers
import { handleGetProfessorById, handleGetProfessorsStudents } from "../controllers/professor.controller";

const router = express.Router({mergeParams: true});

router
	.get('/:id', handleGetProfessorById)
	.get('/:id/students', handleGetProfessorsStudents)

export {router as professorRouter};