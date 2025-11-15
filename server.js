const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import backend routes (with error handling)
try {
    const authRoutes = require('./backend/src/routes/auth');
    const conversationRoutes = require('./backend/src/routes/conversation');
    const userRoutes = require('./backend/src/routes/user');
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/conversation', conversationRoutes);
    app.use('/api/user', userRoutes);
} catch (error) {
    console.log('⚠️ Some routes not available yet, creating them...');
    
    // Ruta base API
    app.get('/api', (req, res) => {
        res.json({ 
            message: 'Spanish IA Tutor API',
            version: '1.0.0',
            status: 'running',
            endpoints: {
                health: '/api/health',
                auth: {
                    login: 'POST /api/auth/login',
                    register: 'POST /api/auth/register',
                    profile: 'GET /api/auth/me'
                },
                user: {
                    profile: 'GET /api/user/profile',
                    update: 'PUT /api/user/profile'
                },
                conversation: {
                    start: 'POST /api/conversation/start',
                    message: 'POST /api/conversation/:id/message',
                    history: 'GET /api/conversation/:id/history'
                }
            }
        });
    });
    
    // Ruta de salud
    app.get('/api/health', (req, res) => {
        res.json({ 
            status: 'Server is running', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    });
}

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:3000`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});

