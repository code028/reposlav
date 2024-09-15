import { ValidationError, validationResult } from 'express-validator';

interface FormattedError {
    path: string;
    msg: string | string[];
    location: string;
    // msg: string;
}

// export const formatValidationErrors = (req: any): FormattedError[] => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return errors.array().map((err: ValidationError) => ({
//             msg: err.msg,
//             // @ts-ignore
//             path: err.path || '',
//             // @ts-ignore
//             location: err.location || ''
//         }));
//     }
//     return [];
// };

// Group errors by path

export const formatValidationErrors = (req: any): FormattedError[] => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
       
        const errorMap: { [key: string]: string[] } = {};

        errors.array().forEach((err: ValidationError) => {
            // @ts-ignore
            if (!errorMap[err.path]) {
                // @ts-ignore
                errorMap[err.path] = [];
            }
            // @ts-ignore
            errorMap[err.path].push(err.msg);
        });

        // Convert grouped errors to the desired format
        return Object.keys(errorMap).map(path => ({
            path,
            // @ts-ignore
            location: errors.array().find(err => err.path === path)?.location || '',
            msg: errorMap[path].length > 1 ? errorMap[path] : errorMap[path][0]
        }));
    }

    return [];
};