const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Middleware de autenticación JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        req.user = user;
        next();
    });
};

// Validación para registro
const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .trim(),
    body('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .trim(),
    body('languageLevel')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Language level must be beginner, intermediate, or advanced'),
    
    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }
        next();
    }
];

// Validación para login
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }
        next();
    }
];

// Validación para actualizar perfil
const validateProfileUpdate = [
    body('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .trim(),
    body('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .trim(),
    body('languageLevel')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Language level must be beginner, intermediate, or advanced'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }
        next();
    }
];

// Rate limiting para prevenir ataques de fuerza bruta
const rateLimitMap = new Map();

const rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const key = req.ip + ':' + req.path;
        const now = Date.now();
        
        // Limpiar intentos antiguos
        if (rateLimitMap.has(key)) {
            const attempts = rateLimitMap.get(key);
            const recentAttempts = attempts.filter(time => now - time < windowMs);
            rateLimitMap.set(key, recentAttempts);
            
            if (recentAttempts.length >= maxAttempts) {
                return res.status(429).json({
                    success: false,
                    message: 'Too many attempts. Please try again later.',
                    retryAfter: Math.ceil(windowMs / 1000)
                });
            }
        }
        
        // Agregar intento actual
        const attempts = rateLimitMap.get(key) || [];
        attempts.push(now);
        rateLimitMap.set(key, attempts);
        
        next();
    };
};

module.exports = {
    authenticateToken,
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
    rateLimit
};