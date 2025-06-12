class AppError extends Error {
    constructor(message, statusCode, conflictField) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        if (conflictField) {
            this.conflictField = conflictField;
        }


        Error.captureStackTrace(this, this.constructor);
    }
}

const handleSequelizeValidationError = (err) => {
    const errors = {};
    err.errors.forEach(error => {
        errors[error.path] = error.message;
    });
    return {
        error: 'Erro de validação',
        message: 'Um ou mais campos estão inválidos.',
        details: errors,
    }
};

const handleSequelizeUniqueConstraintError = (err) => {
    const conflictField = Object.keys(err.fields)[0];
    const message = `O campo ${conflictField} já está em uso.`;
    return new AppError(message, 409, conflictField);

};

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message || 'Erro interno do servidor';
    error.statusCode = err.statusCode || 500;

    if (err.name === 'SequelizeValidationError') {
        const validationError = handleSequelizeValidationError(err);
        return res.status(400).json(validationError);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        error = handleSequelizeUniqueConstraintError(err);
    }

    if (error.isOperational) {
        const responseBody = {
            error: error.status === 'fail' ? 'Bad Request' : 'Internal Server Error',
            message: error.message,
        };

        if (error.statusCode === 409 && error.conflictField) {
            responseBody.error = 'Recurso já existente';
            responseBody.conflictField = error.conflictField;
            responseBody.details = `O ${error.conflictField} já está em uso.`;
            delete responseBody.message;
        }

        return res.status(error.statusCode).json(responseBody);
    }

    // Erros desconhecidos ou de programação
    console.error('💣Erro não operacional :', err);
    return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
    });
}

module.exports = {
    AppError,
    errorHandler,
};