# Supabase Setup Guide for Artemo AI Dashboard

This guide will walk you through setting up your Supabase project and configuring the Artemo AI Dashboard to work with real data and AI integration.

## 🚀 Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com](https://supabase.com)
   - Click "Start your project" or "Sign in" if you have an account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization (or create one)
   - Fill in project details:
     - **Name**: `artemo-ai-dashboard`
     - **Database Password**: Generate a strong password (save this!)
     - **Region**: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll see a progress indicator

## 🔑 Step 2: Get Your Credentials

Once your project is ready:

1. **Go to Project Settings**
   - Click the gear icon (⚙️) in the left sidebar
   - Go to "API" section

2. **Copy These Values**:
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📝 Step 3: Update Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# AI API Keys (get these from respective providers)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GEMINI_API_KEY=your-gemini-key
GROK_API_KEY=your-grok-key
```

## 🗄️ Step 4: Run Database Migrations

The database schema is already created in the migration file. To apply it:

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link Your Project**:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. **Push the Migration**:
   ```bash
   supabase db push
   ```

## 🔐 Step 5: Configure Authentication

1. **Go to Authentication Settings**
   - In Supabase dashboard, go to "Authentication" → "Settings"

2. **Configure Email Settings**:
   - **Enable email confirmations**: OFF (for easier testing)
   - **Enable email change confirmations**: OFF
   - **Enable secure email change**: ON

3. **Set Site URL**:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: `http://localhost:5173/**`

## 🤖 Step 6: Get AI API Keys

### OpenAI (ChatGPT)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy the key (starts with `sk-`)

### Anthropic (Claude)
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create account and get API key
3. Copy the key (starts with `sk-ant-`)

### Google AI (Gemini)
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy the key

### xAI (Grok) - Optional
1. Go to [https://console.x.ai/](https://console.x.ai/)
2. Get API key when available
3. For now, you can leave this empty

## ⚡ Step 7: Deploy Edge Functions

1. **Deploy AI Chat Function**:
   ```bash
   supabase functions deploy ai-chat
   ```

2. **Deploy File Upload Function**:
   ```bash
   supabase functions deploy upload-knowledge-base
   ```

3. **Set Environment Variables for Functions**:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-key
   supabase secrets set ANTHROPIC_API_KEY=your-anthropic-key
   supabase secrets set GEMINI_API_KEY=your-gemini-key
   ```

## 📦 Step 8: Set Up Storage

1. **Go to Storage in Supabase Dashboard**
2. **Create Bucket**:
   - Name: `knowledge-base`
   - Public: `false`
   - File size limit: `10MB`
   - Allowed MIME types: 
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `text/plain`
     - `text/markdown`

## 🧪 Step 9: Test Your Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Try creating a new account
   - Login with your credentials
   - Check if you can access the dashboard

3. **Test Admin Features**:
   - Manually set your user role to 'admin' in the database
   - Access the admin panel
   - Try creating a new tool or category

4. **Test AI Chat**:
   - Use any tool and go through the question flow
   - Verify you get real AI responses

## 🎯 Step 10: Create Your First Admin User

1. **Sign up through the app** with your email
2. **Go to Supabase Dashboard** → "Table Editor" → "user_profiles"
3. **Find your user** and edit the row
4. **Change role** from `user` to `admin`
5. **Save changes**
6. **Refresh the app** - you should now see the "Admin Panel" button

## 🚀 You're Ready!

Your Artemo AI Dashboard is now fully functional with:
- ✅ Real user authentication
- ✅ Database persistence
- ✅ AI integration
- ✅ File uploads
- ✅ Admin management
- ✅ Production-ready security

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid API key" errors**:
   - Double-check your environment variables
   - Make sure there are no extra spaces
   - Restart the dev server after changing .env

2. **Database connection errors**:
   - Verify your Supabase URL and keys
   - Check if the migration ran successfully
   - Ensure RLS policies are active

3. **Authentication not working**:
   - Check Site URL in Supabase auth settings
   - Verify email confirmation is disabled for testing
   - Clear browser cache/localStorage

4. **AI responses not working**:
   - Check if Edge Functions are deployed
   - Verify API keys are set as secrets
   - Check function logs in Supabase dashboard

### Need Help?
- Check Supabase logs in the dashboard
- Use browser dev tools to see network errors
- Verify all environment variables are set correctly

---

**Congratulations! Your Artemo AI Dashboard is now a fully functional SaaS platform!** 🎉