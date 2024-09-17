import express from "express";

// Controllers
import { 
	handleGetUserById,
	handleGetUserRole,
	handleGetUsersByRole,
} from "../controllers/user.controller";

// Validations
// import { 

// } from "../validations/user.validation";

const router = express.Router({mergeParams: true});

router
	.get('/:id', handleGetUserById)
	.get('/:id/role', handleGetUserRole)
	.get('/:role/all', handleGetUsersByRole)

export {router as userRouter};