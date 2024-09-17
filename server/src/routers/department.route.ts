import express from "express";
import { handleDepartmentAdd, handleGetDepartmentById, handleGetFacsByServiceWhereUserId, handleSubjectAddToDepartment } from "../controllers/department.controller";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleDepartmentAdd)
    .post('/subjectAdd', handleSubjectAddToDepartment)
    .get('/:id', handleGetDepartmentById)
    .get('/:id/unis', handleGetFacsByServiceWhereUserId)


export {router as departmentRouter};