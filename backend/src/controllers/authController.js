const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    // Registro de usuario
    async register(req, res) {
        try {
            const { username, email, password, firstName, lastName, languageLevel = 'beginner' } = req.body;
            
            // Validaciones básicas
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email and password are required'
                });
            }
            
            // Verificar si el usuario ya existe
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email or username'
                });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            
            // Insertar usuario
            const [result] = await pool.execute(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, language_level, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [username, email, hashedPassword, firstName || null, lastName || null, languageLevel]
            );
            
            // Generar JWT token
            const token = jwt.sign(
                { 
                    userId: result.insertId, 
                    email: email,
                    username: username 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Respuesta exitosa
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: result.insertId,
                    username,
                    email,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    languageLevel
                }
            });
            
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    
    // Login de usuario
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validaciones básicas
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            
            // Buscar usuario
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            const user = users[0];
            
            // Verificar password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            // Actualizar último login
            await pool.execute(
                'UPDATE users SET last_login = NOW() WHERE id = ?',
                [user.id]
            );
            
            // Generar JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email,
                    username: user.username 
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Respuesta exitosa
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    languageLevel: user.language_level,
                    totalPoints: user.total_points
                }
            });
            
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    
    // Obtener perfil del usuario autenticado
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            
            const [users] = await pool.execute(
                'SELECT id, username, email, first_name, last_name, language_level, total_points, created_at, last_login FROM users WHERE id = ? AND is_active = TRUE',
                [userId]
            );
            
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            const user = users[0];
            
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    languageLevel: user.language_level,
                    totalPoints: user.total_points,
                    memberSince: user.created_at,
                    lastLogin: user.last_login
                }
            });
            
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    
    // Logout (invalida token del lado del cliente)
    async logout(req, res) {
        try {
            // En una implementación completa, podrías agregar el token a una blacklist
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
    }
}

module.exports = new AuthController();