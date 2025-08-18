# Artemo AI Backend

Complete backend API for the Artemo AI Dashboard with dynamic tool management, user authentication, and AI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Claude API key (optional)
- OpenAI API key (optional)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

3. **Set up database:**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔑 Default Login Credentials

After seeding, you can log in with:
- **Admin:** admin@artemo.ai / admin123
- **User:** user@artemo.ai / user123

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Tools (Public)
- `GET /api/tools` - Get all active tools
- `GET /api/tools/:id` - Get tool by ID

### Categories (Public)
- `GET /api/categories` - Get all active categories
- `GET /api/categories/:id` - Get category with tools

### Projects (Authenticated)
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Chat Sessions (Authenticated)
- `GET /api/chat/sessions` - Get user's chat sessions
- `POST /api/chat/sessions` - Create chat session
- `PUT /api/chat/sessions/:id` - Update chat session
- `DELETE /api/chat/sessions/:id` - Delete chat session

### AI Generation (Authenticated)
- `POST /api/ai/generate` - Generate AI response
- `GET /api/ai/models/status` - Get AI models status

### File Upload (Authenticated)
- `POST /api/files/upload` - Upload knowledge base file
- `GET /api/files/:id` - Get file info
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Admin Routes (Admin Only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/tools` - Get all tools
- `POST /api/admin/tools` - Create tool
- `PUT /api/admin/tools/:id` - Update tool
- `DELETE /api/admin/tools/:id` - Delete tool
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create/invite user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🤖 AI Integration

The backend supports multiple AI models:
- **Claude (Primary)** - Anthropic's Claude API
- **ChatGPT (Fallback)** - OpenAI's GPT-4 API
- **Mock Responses** - When no API keys are configured

### AI Model Selection
Each tool can be configured with:
- Primary AI model
- Fallback models (used if primary fails)
- Custom prompt instructions
- Model-specific parameters

## 📁 File Upload Support

Supports knowledge base files:
- **PDF** - Extracted using pdf-parse
- **DOCX/DOC** - Extracted using mammoth
- **TXT/MD** - Plain text files
- **10MB file size limit**
- **Automatic text extraction** for AI context

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (USER/ADMIN)
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** with express-validator
- **File type validation** for uploads
- **CORS protection**
- **Helmet security headers**

## 🗄️ Database Schema

Built with Prisma ORM:
- **Users** - Authentication and profiles
- **Categories** - Tool organization
- **Tools** - Dynamic tool definitions
- **ToolQuestions** - Question sequences
- **Projects** - User project management
- **ChatSessions** - Conversation history
- **KnowledgeFiles** - Uploaded files

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
CLAUDE_API_KEY="your-claude-key"
OPENAI_API_KEY="your-openai-key"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"
```

### Build and Start
```bash
npm run build
npm start
```

## 📊 Monitoring

Health check endpoint: `GET /health`

Returns:
```json
{
  "status": "OK",
  "timestamp": "2025-01-18T..."
}
```

## 🔧 Development

### Database Operations
```bash
# Reset database
npm run db:push

# Seed with sample data
npm run db:seed

# Generate Prisma client after schema changes
npm run db:generate
```

### File Structure
```
src/
├── routes/          # API route handlers
├── middleware/      # Authentication & error handling
├── services/        # Business logic (AI, file processing)
├── scripts/         # Database seeding
└── server.ts        # Main application entry
```

## 🎯 Features

✅ **Complete Authentication System**
✅ **Dynamic Tool Management**
✅ **File Upload & Processing**
✅ **AI Model Integration**
✅ **Admin Dashboard APIs**
✅ **Project Management**
✅ **Chat Session Storage**
✅ **Role-based Access Control**
✅ **Rate Limiting & Security**
✅ **Database Seeding**

The backend is production-ready and fully integrated with the frontend! 🎉