const express = require('express');
const authController = require('../controllers/authController');
const { 
    authenticateToken, 
    validateRegistration, 
    validateLogin, 
    rateLimit 
} = require('../middleware/validation');

const router = express.Router();

// Rutas públicas (no requieren autenticación)

// POST /api/auth/register - Registro de usuario
router.post('/register', 
    rateLimit(3, 15 * 60 * 1000), // Máximo 3 intentos cada 15 minutos
    validateRegistration,
    authController.register
);

// POST /api/auth/login - Login de usuario
router.post('/login', 
    rateLimit(5, 15 * 60 * 1000), // Máximo 5 intentos cada 15 minutos
    validateLogin,
    authController.login
);

// Rutas protegidas (requieren autenticación)

// GET /api/auth/me - Obtener perfil del usuario actual
router.get('/me', 
    authenticateToken,
    authController.getProfile
);

// POST /api/auth/logout - Logout de usuario
router.post('/logout', 
    authenticateToken,
    authController.logout
);

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify', 
    authenticateToken,
    (req, res) => {
        res.json({
            success: true,
            message: 'Token is valid',
            user: {
                userId: req.user.userId,
                email: req.user.email,
                username: req.user.username
            }
        });
    }
);

module.exports = router;