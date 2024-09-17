import { Express, Request, Response } from "express";

// Controller functions
import { handleRegister } from "./controllers/user.controller";

// Validations
import { registerValidation } from "./validations/user.validation";

// Routers
import { sessionRouter } from "./routers/session.route";
import { universityRouter } from "./routers/university.route";
import { userRouter } from "./routers/user.route";
import authGuard from "./auth/authGuard";
import roleGuard from "./auth/roleGuard";
import { facultyRouter } from "./routers/faculty.route";
import { departmentRouter } from "./routers/department.route";
import { subjectRouter } from "./routers/subjects.route";
import { serviceRouter } from "./routers/service.route";

export default function (app: Express) {
    app.get("/status", (req: Request, res: Response) => {
        res.status(200).json({"status": 200,"message": "The server is operating normally"});
    });
    
    app.post("/register", registerValidation, handleRegister)

    app.use("/auth", sessionRouter);
    app.use("/user", authGuard, userRouter);
    
    app.use("/university", authGuard, roleGuard({requiredRoles: ['admin']}), universityRouter);
    app.use("/faculty", authGuard, roleGuard({requiredRoles: ['admin']}), facultyRouter);
    app.use("/department", authGuard, roleGuard({requiredRoles: ['admin','service']}), departmentRouter);
    app.use("/service", authGuard, roleGuard({requiredRoles: ['admin','service']}), serviceRouter);
    app.use("/subject", authGuard, roleGuard({requiredRoles: ['admin','service']}), subjectRouter);

    // Page doesn`t exist
    app.get("*", (req: Request, res: Response) => {
        res.status(404).send({"status": 404, "message": "Page doesn`t exist"});
    });

    // Forbidden methods
    app.use("*", (req: Request, res: Response) => {
        const {originalUrl} = req;
        res.status(404).send({"status": 404, "message": req.method + " metod not allowed on "+ originalUrl});
    });
}