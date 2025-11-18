# Spanish AI Tutor 🗣️🤖

A conversational artificial intelligence assistant for practicing Spanish naturally and interactively through voice conversations.

## 🌟 Project Description

Spanish AI Tutor is an innovative platform that combines artificial intelligence with speech recognition and synthesis technology to offer an immersive and personalized Spanish learning experience. The system simulates natural conversations where the AI agent proposes conversation topics and maintains fluid dialogues, allowing users to practice their Spanish conversation skills in a realistic way.

### Key Features

- 🎤 **Voice Conversations**: Complete oral interaction simulating real phone calls
- 🧠 **Conversational AI**: Intelligent agent that proposes topics and maintains natural conversations
- 📚 **Varied Topics**: Wide range of conversation topics adapted to the user's level
- 🔄 **Automated Flow**: Integration with n8n for conversational workflow management
- 👤 **Personalized Experience**: Content adaptation based on user progress
- 📱 **Modern Interface**: Responsive frontend developed in React

## 🏗️ System Architecture

The project uses a modern microservices architecture:

- **Frontend**: React with intuitive user interface
- **Backend**: Node.js/Express for REST APIs and business logic
- **Database**: MySQL for user and session storage
- **Automation**: n8n for AI workflow orchestration
- **AI and Voice**: Integration with LLM and TTS/STT services

## 📁 Project Structure

```
/spanish-ia-tutor
├── /backend
│   ├── /src
│   │   ├── /controllers   # API controllers (auth, conversation)
│   │   ├── /database      # Models and MySQL connection
│   │   ├── /routes        # REST route definitions
│   │   ├── server.js      # Main Express server
│   │   └── n8nService.js  # n8n webhook integration
│   ├── .env               # Environment variables
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Docker container (optional)
├── /frontend
│   ├── /public            # Static files
│   ├── /src
│   │   ├── /components    # Reusable components
│   │   ├── /pages         # Main pages
│   │   ├── /utils         # Utilities (audio, API)
│   │   ├── App.js         # Root component
│   │   └── index.js       # Entry point
│   ├── .env               # Frontend configuration
│   └── package.json       # React dependencies
├── /n8n
│   ├── /workflows         # Automation workflows
│   ├── /data              # n8n internal data
│   └── .env               # n8n configuration
├── .gitignore
└── README.md
```

## 🚀 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication
- **Multer** - Audio file handling

### Frontend
- **React** - UI library
- **Web Audio API** - Audio recording and playback
- **Axios** - HTTP client
- **Material-UI / Tailwind CSS** - Styling

### Automation and AI
- **n8n** - Automation platform
- **OpenAI GPT** - Language model
- **Speech-to-Text** - Voice recognition
- **Text-to-Speech** - Voice synthesis

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- n8n (local installation or cloud)
- API keys for AI services (OpenAI, etc.)

## 🛠️ Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/jmartin516/Spanish.prctice.bot.git
cd spanish-ia-tutor
```

### 2. Setup Backend
```bash
# Install dependencies
npm install

# Configure environment variables in .env
# Start development server
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configure backend URL
npm start
```

### 4. Database Setup

#### 4.1. Create Database and User

Connect to MySQL as root:
```bash
# On macOS with Homebrew:
/opt/homebrew/opt/mysql/bin/mysql -u root -p

# Or if MySQL is in PATH:
mysql -u root -p
```

Execute the following SQL commands:
```sql
-- Create the database
CREATE DATABASE spanish_tutor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_secure_password' with a secure password)
CREATE USER 'spanish_tutor_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON spanish_tutor_db.* TO 'spanish_tutor_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify it was created correctly
SHOW DATABASES;
EXIT;
```

#### 4.2. Configure Environment Variables

Update your `.env` file with the database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=spanish_tutor_db
DB_USER=spanish_tutor_user
DB_PASSWORD=your_secure_password
```

#### 4.3. Run Database Schema

Execute the schema to create tables:
```bash
mysql -u spanish_tutor_user -p spanish_tutor_db < database_schema.sql
```

This will create the following tables:
- `users` - System users
- `conversations` - Conversation sessions
- `messages` - Conversation messages
- `vocabulary_words` - Spanish vocabulary
- `practice_sessions` - Learning sessions
- `user_progress` - User progress tracking

#### 4.4. Verify Connection

To verify everything works correctly:
```bash
# Connect to the database with the new user
mysql -u spanish_tutor_user -p spanish_tutor_db

# View created tables
SHOW TABLES;

# View table structure
DESCRIBE users;
DESCRIBE messages;
EXIT;
```

### 5. Setup n8n
```bash
cd n8n
# Import workflows from /workflows
# Configure API credentials in n8n
```

## 🎯 System Usage

1. **Registration/Login**: Users register and access the system
2. **Topic Selection**: System proposes conversation topics
3. **Voice Conversation**: Natural interaction using microphone and speakers
4. **AI Feedback**: Agent provides feedback and continues the conversation
5. **Progress**: Track progress and improvements over time

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Deactivate account

### Conversations
- `POST /api/conversation/start` - Start new conversation
- `POST /api/conversation/:id/message` - Send message
- `GET /api/conversation/:id/history` - Get conversation history
- `GET /api/conversation/list` - List user conversations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Juan Martin - [@jmartin516](https://github.com/jmartin516)

Fran Montejano - [@franpcm](https://github.com/franpcm)

Project Link: [https://github.com/jmartin516/Spanish.prctice.bot](https://github.com/jmartin516/Spanish.prctice.bot)

---

⭐ If this project helps you, give it a star on GitHub!
