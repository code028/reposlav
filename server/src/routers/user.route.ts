import express from "express";

// Controllers
import { 
	handleGetUserRole,
} from "../controllers/user.controller";
import roleGuard from "../auth/roleGuard";

// Validations
// import { 

// } from "../validations/user.validation";

const router = express.Router({mergeParams: true});

router
	.get('/:id/role', handleGetUserRole)

export {router as userRouter};