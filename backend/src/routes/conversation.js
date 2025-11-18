const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/validation');

const router = express.Router();

// POST /api/conversation/start - Iniciar nueva conversación
router.post('/start', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { topic, difficulty = 'beginner' } = req.body;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }
        
        // Crear nueva conversación (cuando tengamos la tabla)
        // const [result] = await pool.execute(
        //     'INSERT INTO conversations (user_id, topic, difficulty, status, created_at) VALUES (?, ?, ?, ?, NOW())',
        //     [userId, topic, difficulty, 'active']
        // );
        
        // Por ahora, respuesta simulada
        const conversationId = Date.now(); // ID temporal
        
        res.status(201).json({
            success: true,
            message: 'Conversation started successfully',
            conversation: {
                id: conversationId,
                userId: userId,
                topic: topic,
                difficulty: difficulty,
                status: 'active',
                createdAt: new Date().toISOString(),
                messages: []
            }
        });
        
    } catch (error) {
        console.error('Start conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start conversation'
        });
    }
});

// POST /api/conversation/:id/message - Enviar mensaje en conversación
router.post('/:id/message', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;
        const { message, type = 'text' } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        // Verificar que la conversación pertenece al usuario (cuando tengamos la tabla)
        // const [conversations] = await pool.execute(
        //     'SELECT id FROM conversations WHERE id = ? AND user_id = ? AND status = "active"',
        //     [conversationId, userId]
        // );
        
        // if (conversations.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Conversation not found or not accessible'
        //     });
        // }
        
        // Guardar mensaje del usuario (cuando tengamos la tabla)
        // await pool.execute(
        //     'INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES (?, ?, ?, ?, NOW())',
        //     [conversationId, 'user', message, type]
        // );
        
        // Simular respuesta del AI tutor
        const aiResponse = generateAIResponse(message);
        
        // Guardar respuesta del AI (cuando tengamos la tabla)
        // await pool.execute(
        //     'INSERT INTO messages (conversation_id, sender_type, content, message_type, created_at) VALUES (?, ?, ?, ?, NOW())',
        //     [conversationId, 'ai', aiResponse, 'text']
        // );
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            userMessage: {
                id: Date.now(),
                conversationId: conversationId,
                senderType: 'user',
                content: message,
                messageType: type,
                createdAt: new Date().toISOString()
            },
            aiResponse: {
                id: Date.now() + 1,
                conversationId: conversationId,
                senderType: 'ai',
                content: aiResponse,
                messageType: 'text',
                createdAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

// GET /api/conversation/:id/history - Obtener historial de conversación
router.get('/:id/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.id;
        
        // Verificar acceso y obtener mensajes (cuando tengamos las tablas)
        // const [messages] = await pool.execute(
        //     `SELECT m.* FROM messages m 
        //      JOIN conversations c ON m.conversation_id = c.id 
        //      WHERE c.id = ? AND c.user_id = ? 
        //      ORDER BY m.created_at ASC`,
        //     [conversationId, userId]
        // );
        
        // Por ahora, respuesta simulada
        const messages = [
            {
                id: 1,
                conversationId: conversationId,
                senderType: 'ai',
                content: '¡Hola! Soy tu tutor de español. ¿En qué te puedo ayudar hoy?',
                messageType: 'text',
                createdAt: new Date(Date.now() - 60000).toISOString()
            }
        ];
        
        res.json({
            success: true,
            conversationId: conversationId,
            messages: messages,
            totalMessages: messages.length
        });
        
    } catch (error) {
        console.error('Get conversation history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get conversation history'
        });
    }
});

// GET /api/conversation/list - Obtener lista de conversaciones del usuario
router.get('/list', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10, status = 'all' } = req.query;
        
        // Calcular offset
        const offset = (page - 1) * limit;
        
        // Por ahora, respuesta simulada
        const conversations = [
            {
                id: 1,
                topic: 'Presentaciones personales',
                difficulty: 'beginner',
                status: 'active',
                messageCount: 5,
                lastMessage: '¡Muy bien! Sigue practicando.',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 1800000).toISOString()
            }
        ];
        
        res.json({
            success: true,
            conversations: conversations,
            pagination: {
                currentPage: parseInt(page),
                limit: parseInt(limit),
                totalConversations: conversations.length,
                totalPages: Math.ceil(conversations.length / limit)
            }
        });
        
    } catch (error) {
        console.error('Get conversations list error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get conversations list'
        });
    }
});

// Función auxiliar para generar respuesta del AI (temporal)
function generateAIResponse(userMessage) {
    const responses = [
        '¡Excelente! Continúa practicando.',
        'Muy bien. ¿Puedes decirme más sobre eso en español?',
        'Perfecto. Ahora intenta usar esas palabras en una oración.',
        '¡Fantástico! Tu español está mejorando.',
        'Bien hecho. ¿Qué más te gustaría aprender?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;