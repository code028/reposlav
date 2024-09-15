import { body, param, query, header, cookie, check } from "express-validator"

const hasUpperCase = (value: string) => /[A-Z]/.test(value);
const hasLowerCase = (value: string) => /[a-z]/.test(value);
const hasSpecialCharacter = (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
const hasNumber = (value: string) => /\d/.test(value);
const startsWithLetter = (value: string): boolean => /^[a-zA-Z]/.test(value);
const hasLetter = (value: string): boolean => /[a-zA-Z]/.test(value);

export const registerValidation = [
    body('name')
        .isString().withMessage('The name must be a string type')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  
    body('username')
        .isString().withMessage('The username must be a string type')
        .custom(value => startsWithLetter(value)).withMessage('The username must start with letter')
        .isLength({min:5}).withMessage('The username must contain 5 characters'),

    body('email')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .custom(value => hasUpperCase(value)).withMessage('Password must contain at least one uppercase letter')
        .custom(value => hasLowerCase(value)).withMessage('Password must contain at least one lowercase letter')
        .custom(value => hasSpecialCharacter(value)).withMessage('Password must contain at least one special character')
        .custom(value => hasNumber(value)).withMessage('Password must contain at least one number')
];

export const loginValidation = [
    body('login')
        .custom(value => hasLetter(value)).withMessage('Email or username is required'),

    body('password')
        .custom(value => hasLetter(value)).withMessage('Password is required'),

    check('user-agent')
        .exists().withMessage('User-Agent header is required')
        .isString().withMessage('User-Agent must be a string')
        .notEmpty().withMessage('User-Agent cannot be empty')
]

export const logoutValidation = [
    check('refreshToken')
        .exists().withMessage('Refresh Token is required')
        .notEmpty().withMessage('Refresh Token cannot be empty'),

    check('user-agent')
        .exists().withMessage('User-Agent header is required')
        .isString().withMessage('User-Agent must be a string')
        .notEmpty().withMessage('User-Agent cannot be empty')
]

export const refreshValidation = [
    check('refreshToken')
        .exists().withMessage('Refresh Token is required')
        .notEmpty().withMessage('Refresh Token cannot be empty'),
        
    check('user-agent')
        .exists().withMessage('User-Agent header is required')
        .isString().withMessage('User-Agent must be a string')
        .notEmpty().withMessage('User-Agent cannot be empty')
]