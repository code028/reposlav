import express from "express";
import { handleAddStudentToFaculty, handleFacultyAdd, handleGetFacultyById, handleGetFacultyStudents } from "../controllers/faculty.controller";
import roleGuard from "../auth/roleGuard";

const router = express.Router({mergeParams: true});

router
    .post('/add', roleGuard({requiredRoles: ['admin']}), handleFacultyAdd)
    .get('/:id', roleGuard({requiredRoles: ['admin']}), handleGetFacultyById)
    .post('/addStudentToFac', roleGuard({requiredRoles: ['admin', 'service']}),  handleAddStudentToFaculty)
    .get('/:id/students', roleGuard({requiredRoles: ['admin', 'service']}), handleGetFacultyStudents)

export {router as facultyRouter};