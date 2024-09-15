import { check } from "express-validator";

export const UniversityAddValidation = [
    
    check('userId')
        .exists().withMessage('User ID is required'),

    check('name')
        .exists().withMessage('University name is required'),

    check('location')
        .exists().withMessage('Location is required')
];