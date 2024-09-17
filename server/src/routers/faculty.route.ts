import express from "express";
import { handleFacultyAdd, handleGetFacultyById } from "../controllers/faculty.controller";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleFacultyAdd)
    .get('/:id', handleGetFacultyById)

export {router as facultyRouter};