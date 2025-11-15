const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// GET /api/user/profile - Obtener perfil completo del usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Obtener datos del usuario
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
        
        // Obtener estadísticas del usuario (opcional - cuando tengamos tabla de sesiones)
        // const [stats] = await pool.execute(
        //     'SELECT COUNT(*) as total_sessions, AVG(score) as average_score FROM practice_sessions WHERE user_id = ?',
        //     [userId]
        // );
        
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
                lastLogin: user.last_login,
                // stats: stats[0] || { total_sessions: 0, average_score: 0 }
            }
        });
        
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
});

// PUT /api/user/profile - Actualizar perfil del usuario
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, languageLevel, email } = req.body;
        
        // Construir query dinámicamente
        const updates = [];
        const values = [];
        
        if (firstName !== undefined) {
            updates.push('first_name = ?');
            values.push(firstName);
        }
        if (lastName !== undefined) {
            updates.push('last_name = ?');
            values.push(lastName);
        }
        if (languageLevel !== undefined) {
            updates.push('language_level = ?');
            values.push(languageLevel);
        }
        if (email !== undefined) {
            // Verificar que el email no esté en uso por otro usuario
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use by another user'
                });
            }
            
            updates.push('email = ?');
            values.push(email);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        // Agregar timestamp y userId
        updates.push('updated_at = NOW()');
        values.push(userId);
        
        // Ejecutar actualización
        const [result] = await pool.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Obtener datos actualizados
        const [updatedUsers] = await pool.execute(
            'SELECT id, username, email, first_name, last_name, language_level, total_points FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUsers[0].id,
                username: updatedUsers[0].username,
                email: updatedUsers[0].email,
                firstName: updatedUsers[0].first_name,
                lastName: updatedUsers[0].last_name,
                languageLevel: updatedUsers[0].language_level,
                totalPoints: updatedUsers[0].total_points
            }
        });
        
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// DELETE /api/user/account - Desactivar cuenta del usuario
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // En lugar de eliminar, desactivamos la cuenta
        const [result] = await pool.execute(
            'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
            [userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });
        
    } catch (error) {
        console.error('Deactivate account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate account'
        });
    }
});

module.exports = router;