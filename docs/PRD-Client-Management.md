# PRD: Client Management Tools

**Category Owner:** Freelancer Tools Team
**Version:** 2.0
**Date:** 2025-18-01

---

## 1. Category Overview

**Name:** Client Management

**Purpose:** To equip freelance copywriters and agencies with tools to streamline administrative and client-facing tasks. These tools help manage client relationships, articulate value, and create professional documents, freeing up more time for creative work. All tools in this category are now dynamically managed through the admin interface with customizable question sequences and AI model selection.

## 2. Tools in this Category

- **Client Interview Summarizer:** Creates concise summaries from call transcripts with admin-defined analysis parameters
- **Contract Creator:** Generates simple, professional service contracts with customizable terms and clauses
- **Copywriter Value Tool:** Helps articulate the value of copywriting services with industry-specific messaging
- **Freelance Bio Writer:** Crafts compelling professional bios for platforms like Upwork or LinkedIn with platform-specific optimization

## 2.1 Dynamic Tool Configuration

**Admin-Controlled Features:**
- **Question Sequences:** Customizable question flows for each tool
- **AI Model Selection:** Primary and fallback model assignment per tool
- **Knowledge Base Integration:** Tool-specific document uploads for enhanced context
- **Prompt Engineering:** Custom system prompts and instructions for each tool
- **Active Status:** Enable/disable tools based on business needs

## 3. User Flow & Logic

1. **Entry Point:** The user selects a Client Management tool from the Dashboard, "All Tools" page, or the sidebar
2. **Activation Modal:** A large modal appears, showing the tool's info and a **"Start" button**
3. **Initiation:** The user clicks "Start" and is taken directly to the tool's chat interface
4. **Dynamic Assistant Introduction:** The AI assistant sends its first message based on admin-configured introduction text and begins the admin-defined question sequence
5. **Core Loop:**
   - The user provides information in response to dynamically generated questions
   - **Sequential Validation:** Each question must be answered before proceeding to the next
   - **Project Association:** Users can assign the chat to a project at any time using the header dropdown
   - **Knowledge Base Integration:** Upload relevant files (transcripts, briefs, templates) for enhanced context
   - **AI Processing:** The selected AI model processes inputs using admin-defined prompts and uploaded knowledge base
   - **Dynamic Output:** Generated content reflects the specific tool configuration and user inputs
   - **Iterative Refinement:** Users can request revisions through follow-up conversations

## 3.1 Admin Configuration Flow

**Tool Setup Process:**
1. **Basic Configuration:** Admin sets tool title, description, and category assignment
2. **AI Model Selection:** Choose primary model (ChatGPT, Claude, Grok, etc.) with fallback options
3. **Prompt Engineering:** Define system prompts and behavioral instructions
4. **Question Builder:** Create ordered question sequences with validation rules
5. **Knowledge Base Setup:** Upload relevant documents and templates
6. **Testing & Activation:** Preview tool behavior and activate for user access

## 4. General Prompt Structure & Examples

The conversation flow is now dynamically generated based on admin configuration. The user provides information piece by piece as requested by the AI assistant following the admin-defined question sequence.

### Example Interaction (for Client Interview Summarizer)

> **AI Assistant:** *[Admin-configured introduction message]* "Hello, I'm here to help you summarize client interviews. Please upload the transcript file or paste the full text of the conversation into the chat."
>
> **User:** *(Uploads transcript file via Knowledge Base feature)*
>
> **AI Assistant:** *[Admin-configured question 1]* "Thank you. I'm analyzing the transcript now. Are there any specific areas you want me to focus on, such as key challenges, budget, or timeline?"
>
> **User:** "Yes, please pull out their main business goals and the specific deliverables they mentioned."
>
> **AI Assistant:** *[Admin-configured question 2, if applicable]* "What format would you prefer for the summary - bullet points, narrative, or structured sections?"
>
> **User:** "Structured sections please."
>
> **AI Assistant:** *[Processes using admin-configured prompt and knowledge base]* "Understood. Here is a structured summary focusing on those key points..."
> *(Generates summary using selected AI model with admin-defined formatting)*

## 5. Administrative Management

### 5.1 Tool Configuration Options

**Question Types Available:**
- **Text Input:** Short text responses for names, titles, etc.
- **Textarea:** Longer text for descriptions, requirements, etc.
- **File Upload:** Document uploads for transcripts, briefs, examples
- **Select Dropdown:** Predefined options for formats, styles, etc.
- **Multi-select:** Multiple choice options for features, services, etc.

**AI Model Options:**
- **Primary Models:** ChatGPT, Claude, Grok, Gemini
- **Fallback Chain:** Automatic failover for reliability
- **Model-Specific Prompts:** Optimized instructions per AI model

**Knowledge Base Management:**
- **Template Library:** Reusable contract templates, bio examples
- **Industry Resources:** Sector-specific information and best practices
- **Legal Documents:** Standard clauses, terms, and compliance information
- **Style Guides:** Brand voice and formatting guidelines

### 5.2 Performance Optimization

**Dynamic Loading:** Tools load configuration on-demand for optimal performance
**Caching Strategy:** Frequently used configurations cached for speed
**Version Control:** Track changes to tool configurations over time
**A/B Testing:** Compare different question sequences and prompts for effectiveness

This enhanced Client Management category provides administrators with complete control over tool behavior while maintaining the intuitive user experience that makes these tools valuable for freelancers and agencies.