import express from "express";
import { handleDepartmentAdd, handleGetDepartmentById, handleGetFacsByServiceWhereUserId, handleGetProfessorsOnFacultyByDepId, handleSubjectAddToDepartment, handleAddProfToDep, handleGetAllProfessorsOnDeps } from "../controllers/department.controller";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleDepartmentAdd)
    .post('/subjectAdd', handleSubjectAddToDepartment)
    .post('/addProfToDep', handleAddProfToDep)
    .get('/:id', handleGetDepartmentById)
    .get('/:id/unis', handleGetFacsByServiceWhereUserId)
    .get('/:id/professors', handleGetProfessorsOnFacultyByDepId)
    .get('/professors/all', handleGetAllProfessorsOnDeps)

export {router as departmentRouter};