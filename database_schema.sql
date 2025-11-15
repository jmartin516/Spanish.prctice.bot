-- Spanish AI Tutor Database Schema
-- Created: 2024-11-15

-- Create database
CREATE DATABASE IF NOT EXISTS spanish_tutor_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE spanish_tutor_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    language_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    total_points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_active (is_active),
    INDEX idx_level (language_level)
);

-- Conversations table
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    total_messages INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_difficulty (difficulty)
);

-- Messages table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_type ENUM('user', 'ai') NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'audio', 'image') DEFAULT 'text',
    metadata JSON NULL, -- Para almacenar datos adicionales como audio_url, transcription, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_sender_type (sender_type),
    INDEX idx_created_at (created_at)
);

-- Vocabulary table
CREATE TABLE vocabulary_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spanish_word VARCHAR(255) NOT NULL,
    english_translation VARCHAR(255) NOT NULL,
    pronunciation VARCHAR(255),
    category VARCHAR(100),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    usage_example TEXT,
    audio_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_spanish_word (spanish_word),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty_level)
);

-- Practice sessions table
CREATE TABLE practice_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_type ENUM('vocabulary', 'conversation', 'grammar', 'pronunciation') NOT NULL,
    topic VARCHAR(255),
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    score INT DEFAULT 0,
    max_score INT DEFAULT 100,
    questions_answered INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_type (session_type),
    INDEX idx_completed (completed)
);

-- User progress table
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_type ENUM('vocabulary', 'grammar', 'conversation', 'pronunciation') NOT NULL,
    current_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    points_earned INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_practice_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_type),
    INDEX idx_user_id (user_id),
    INDEX idx_skill_type (skill_type)
);

-- System settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data

-- Basic vocabulary to get started
INSERT INTO vocabulary_words (spanish_word, english_translation, pronunciation, category, difficulty_level, usage_example) VALUES
('hola', 'hello', 'OH-lah', 'greetings', 'beginner', 'Hola, ¿cómo estás?'),
('adiós', 'goodbye', 'ah-DYOHS', 'greetings', 'beginner', 'Adiós, hasta mañana.'),
('gracias', 'thank you', 'GRAH-thyahs', 'courtesy', 'beginner', 'Gracias por tu ayuda.'),
('por favor', 'please', 'por fah-BOHR', 'courtesy', 'beginner', 'Una agua, por favor.'),
('perdón', 'excuse me/sorry', 'per-DOHN', 'courtesy', 'beginner', 'Perdón, no entiendo.'),
('sí', 'yes', 'see', 'basic', 'beginner', 'Sí, me gusta mucho.'),
('no', 'no', 'noh', 'basic', 'beginner', 'No, no tengo tiempo.'),
('agua', 'water', 'AH-gwah', 'food', 'beginner', 'Necesito un vaso de agua.'),
('comida', 'food', 'ko-MEE-dah', 'food', 'beginner', 'La comida está deliciosa.'),
('casa', 'house', 'KAH-sah', 'home', 'beginner', 'Mi casa es pequeña.'),
('familia', 'family', 'fah-MEE-lyah', 'family', 'beginner', 'Mi familia es muy grande.'),
('trabajo', 'work', 'trah-BAH-ho', 'work', 'beginner', 'Voy al trabajo en autobús.'),
('escuela', 'school', 'es-KWEH-lah', 'education', 'beginner', 'Los niños van a la escuela.'),
('amigo', 'friend', 'ah-MEE-go', 'relationships', 'beginner', 'Mi amigo es muy simpático.'),
('tiempo', 'time/weather', 'TYEM-po', 'basic', 'beginner', 'No tengo tiempo ahora.');

-- System configurations
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('app_version', '1.0.0', 'Current application version'),
('default_language_level', 'beginner', 'Default language level for new users'),
('max_conversations_per_user', '50', 'Maximum number of active conversations per user'),
('session_timeout_minutes', '30', 'Session timeout in minutes'),
('ai_model_version', 'gpt-3.5-turbo', 'AI model used for conversations');

-- Triggers to automatically update counters

-- Trigger to update total_messages in conversations
DELIMITER //
CREATE TRIGGER update_conversation_message_count 
    AFTER INSERT ON messages
    FOR EACH ROW
BEGIN
    UPDATE conversations 
    SET total_messages = total_messages + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
END//
DELIMITER ;

-- Trigger to update points when a session is completed
DELIMITER //
CREATE TRIGGER update_user_points
    AFTER UPDATE ON practice_sessions
    FOR EACH ROW
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        UPDATE users 
        SET total_points = total_points + NEW.score
        WHERE id = NEW.user_id;
    END IF;
END//
DELIMITER ;

-- Create additional indexes for optimization
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_practice_sessions_created_at ON practice_sessions(created_at);

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.username,
    u.total_points,
    u.language_level,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT ps.id) as total_practice_sessions,
    AVG(ps.score) as average_score,
    MAX(ps.score) as best_score,
    SUM(ps.duration_seconds) as total_practice_time_seconds
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN practice_sessions ps ON u.id = ps.user_id
WHERE u.is_active = TRUE
GROUP BY u.id, u.username, u.total_points, u.language_level;

-- Show created structure
SHOW TABLES;
SELECT COUNT(*) as vocabulary_words_inserted FROM vocabulary_words;
SELECT COUNT(*) as system_settings_inserted FROM system_settings;