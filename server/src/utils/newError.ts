const newError = (status: number, message: string) => {
    const error = new Error;
    (error as any).status = status;
    (error as any).message = message;

    throw error;
}

export default newError;