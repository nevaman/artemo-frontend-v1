# Artemo AI Dashboard

This repository contains the frontend code for the Artemo AI Dashboard, a powerful suite of tools for copywriters and marketers with a comprehensive admin management system.

## 🚀 Features

### User Features
- **AI-Powered Tools**: 40+ specialized copywriting tools across 8 categories
- **Chat-Based Interface**: Interactive conversations with AI assistants
- **Project Management**: Organize work into projects with tagging
- **Knowledge Base Integration**: Upload files to provide context to AI tools
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable viewing

### Admin Features
- **Category Management**: Create, edit, and reorder tool categories
- **Tool Management**: Full CRUD operations for AI tools with:
  - Dynamic question sequences
  - AI model selection and fallbacks
  - Knowledge base file uploads
  - Featured tool designation
- **User Management**: Invite users, manage roles, and control access
- **Analytics Dashboard**: View usage statistics and recent activity

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **React Markdown** for rich text rendering

### Key Components
- **Main Dashboard**: Tool discovery and quick access
- **Chat Interface**: Dynamic conversation flows with AI
- **Admin Panel**: Complete management interface at `/admin`
- **Project System**: Organize and categorize work

## 🎯 Tool Categories

1. **Ad Copy** - HAO/HSO frameworks, YouTube scripts
2. **Client Management** - Contracts, bios, value propositions
3. **Copy Improvement** - Revision tools, humanizers, hooks
4. **Email Copy** - Sequences, subject lines, cold outreach
5. **Long Form Content** - Blog posts, press releases, books
6. **Podcast Tools** - Show notes, outreach, media sheets
7. **Sales & Funnel Copy** - Landing pages, VSLs, product descriptions
8. **Other Tools** - Audience analysis, website copy, objection handling

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar navigation
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## 🔐 Admin Access

Access the admin panel at `/admin` (development only - authentication required in production):
- Manage all tools and categories
- Control user access and permissions
- View analytics and system health
- Configure AI models and prompts

## 🎨 Design System

- **Typography**: Inter (sans-serif) + Merriweather (serif)
- **Colors**: Dynamic theme system with light/dark modes
- **Spacing**: 8px grid system
- **Components**: Consistent design language throughout

---

### 📘 Product Requirement Docs

- [Dashboard Overview PRD](./docs/PRD-Overview.md)
- [Admin System PRD](./docs/PRD-Admin-System.md)
- [Client Management Tools](./docs/PRD-Client-Management.md)
- [Copy Improvement Tools](./docs/PRD-Copy-Improvement.md)
- [Email Copy Tools](./docs/PRD-Email-Copy.md)
- [Sales & Funnel Tools](./docs/PRD-Sales-Funnel.md)
- [Podcast Tools](./docs/PRD-Podcast-Tools.md)
- [Long Form Content](./docs/PRD-Long-Form-Content.md)
- [Ad Copy Tools](./docs/PRD-Ad-Copy.md)
- [Other Tools](./docs/PRD-Misc-Other.md)