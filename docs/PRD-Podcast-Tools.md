# PRD: Podcast Tools

**Category Owner:** Creator Tools Team
**Version:** 2.0
**Date:** 2025-18-01

---

## 1. Category Overview

**Name:** Podcast Tools

**Purpose:** To provide podcasters and their teams with a comprehensive set of tools to streamline the marketing and administrative tasks associated with producing a podcast. These tools help with promotion, guest outreach, and content repurposing, now with dynamic configuration and AI model optimization for different podcast formats and audiences.

## 2. Tools in this Category

- **Podcast Email Announcement Tool:** Creates engaging emails to announce new episodes with platform-specific optimization
- **Podcast Media Sheet Generator:** Generates professional media sheets with customizable formats and branding
- **Podcast Outreach Email:** Crafts personalized guest pitch emails with industry-specific templates
- **Podcast Shownotes Writer:** Generates comprehensive show notes with SEO optimization and timestamp integration
- **Podcast Description Writer:** Creates compelling podcast descriptions for different platforms (Apple, Spotify, etc.)
- **Episode Title Generator:** Generates click-worthy episode titles optimized for discovery

## 2.1 Dynamic Podcast Tool Architecture

**Admin-Controlled Features:**
- **Format Optimization:** Configure tools for different podcast formats (interview, solo, panel, narrative)
- **Platform Integration:** Optimize content for specific platforms (Apple Podcasts, Spotify, YouTube, etc.)
- **Branding Consistency:** Upload brand guidelines and templates for consistent output
- **SEO Integration:** Built-in keyword optimization for podcast discovery
- **Audience Targeting:** Customize content for different listener demographics

## 3. User Flow & Logic

1. **Entry Point:** The user selects a podcast-related tool
2. **Activation Modal:** The app opens the tool's activation modal, and the user clicks **"Start"**
3. **Initiation:** The user clicks "Start" and enters the dynamic chat interface
4. **Specialized Assistant Introduction:** The AI assistant starts with admin-configured introduction and podcast-specific question sequence
5. **Enhanced Podcast Loop:**
   - **Content Analysis:** Upload transcripts, episode recordings, or detailed notes via Knowledge Base
   - **Format Detection:** System identifies podcast format and optimizes accordingly
   - **Platform Optimization:** Generate content optimized for target platforms
   - **SEO Integration:** Automatic keyword research and optimization suggestions
   - **Brand Consistency:** Apply uploaded brand guidelines and style preferences
   - **Multi-Format Output:** Generate content in various formats (HTML, plain text, social media posts)
   - **Performance Optimization:** Built-in suggestions for improving discoverability and engagement

## 3.1 Advanced Podcast Configuration

**Podcast Format Types:**
- **Interview Shows:** Guest-focused content with introduction and bio integration
- **Solo Commentary:** Host-centric content with personal branding emphasis
- **Panel Discussions:** Multi-host format with speaker identification and highlights
- **Narrative/Storytelling:** Story-driven content with chapter markers and dramatic elements
- **Educational/Tutorial:** Learning-focused content with key takeaways and resources

## 4. General Prompt Structure & Examples

The conversation flow is dynamically generated based on admin configuration, with specialized sequences for different podcast content types and distribution goals.

### Example Interaction (for Podcast Shownotes Writer)

> **AI Assistant:** *[Admin-configured introduction]* "I'm ready to write your show notes. Please use the 'Knowledge Base' button to upload the episode transcript or detailed episode notes."
>
> **User:** *(Uploads transcript and episode outline)*
>
> **AI Assistant:** *[Admin-configured question 1]* "Perfect! What is the official title of this episode and who was the guest? Also, what's your target audience for this episode?"
>
> **User:** "The title is 'The Art of Focus in a Distracted World' and the guest was Dr. Jane Evans, a neuroscientist. Target audience is busy professionals and entrepreneurs."
>
> **AI Assistant:** *[Admin-configured question 2]* "Great! What platforms will you be publishing on? This helps me optimize the format and SEO keywords."
>
> **User:** "Apple Podcasts, Spotify, and YouTube. We also post clips on LinkedIn and Twitter."
>
> **AI Assistant:** *[Admin-configured question 3]* "Do you want me to include timestamps, and would you like social media snippets for promotion?"
>
> **User:** "Yes to both - timestamps every 5 minutes and 3-4 social media snippets would be perfect."
>
> **AI Assistant:** *[Processes using admin-configured prompt and selected AI model]* "Excellent! I'm now generating comprehensive show notes optimized for your platforms, including..."
> *(Generates complete show notes with timestamps, SEO optimization, and social media content)*

## 5. Administrative Podcast Tool Management

### 5.1 AI Model Optimization by Content Type

**Show Notes Generation:**
- **Primary:** Claude (structured content and accurate summarization)
- **Fallback:** GPT-4 (creative formatting and engagement optimization)
- **Knowledge Base:** Show note templates, SEO keyword databases, and formatting guides

**Guest Outreach:**
- **Primary:** GPT-4 (personalized and persuasive communication)
- **Fallback:** Claude (professional tone and clear structure)
- **Knowledge Base:** Successful outreach templates, guest research databases, and pitch frameworks

**Creative Content (Titles, Descriptions):**
- **Primary:** GPT-4 (creative and engaging content)
- **Fallback:** Claude (SEO optimization and clarity)
- **Knowledge Base:** High-performing title databases and platform-specific best practices

### 5.2 Platform-Specific Optimization

**Apple Podcasts:**
- **Title Optimization:** Character limits and keyword placement for Apple's algorithm
- **Description Format:** Apple-specific formatting and category optimization
- **Show Notes Structure:** Apple's preferred format for maximum discoverability

**Spotify:**
- **SEO Integration:** Spotify's search algorithm optimization
- **Playlist Consideration:** Content formatting for playlist inclusion
- **Social Features:** Integration with Spotify's social sharing features

**YouTube:**
- **Video Optimization:** Titles and descriptions optimized for YouTube search
- **Thumbnail Suggestions:** Text overlay recommendations for video thumbnails
- **Chapter Markers:** YouTube-specific timestamp formatting

### 5.3 Content Repurposing Features

**Multi-Format Content Generation:**
- **Blog Posts:** Convert episodes into SEO-optimized blog content
- **Social Media Content:** Generate platform-specific posts and snippets
- **Newsletter Content:** Email-friendly episode summaries and highlights
- **Quote Graphics:** Extract quotable moments for visual social media posts

**SEO and Discovery Optimization:**
- **Keyword Research:** Automatic identification of relevant keywords for each episode
- **Transcript Optimization:** SEO-friendly transcript formatting and keyword integration
- **Cross-Platform Consistency:** Maintain consistent messaging across all platforms
- **Trending Topic Integration:** Incorporate current trends and hashtags where appropriate

### 5.4 Guest Management Integration

**Guest Research Tools:**
- **Bio Generation:** Create compelling guest introductions from research
- **Question Preparation:** Generate interview questions based on guest expertise
- **Follow-up Content:** Create thank you emails and collaboration opportunities
- **Social Media Mentions:** Generate posts to tag and thank guests

**Media Kit Creation:**
- **Professional Templates:** Branded media kit templates for different podcast types
- **Statistics Integration:** Automatic inclusion of download numbers and demographics
- **Testimonial Management:** Organize and display listener and guest testimonials
- **Sponsorship Information:** Professional sponsor information and rate cards

### 5.5 Analytics and Performance Tracking

**Content Performance Analysis:**
- **Episode Performance:** Track which types of content perform best
- **SEO Effectiveness:** Monitor keyword rankings and search traffic
- **Social Media Engagement:** Track social media performance of generated content
- **Guest Impact:** Measure the success of different guest outreach approaches

**Continuous Improvement:**
- **Template Optimization:** Refine templates based on performance data
- **Keyword Trending:** Stay updated with trending keywords in podcast niches
- **Platform Algorithm Updates:** Adapt to changes in platform algorithms and best practices
- **Audience Feedback Integration:** Incorporate listener feedback into content generation

This enhanced Podcast Tools category provides administrators with comprehensive control over podcast marketing and content creation while leveraging advanced AI capabilities to optimize for discovery, engagement, and professional presentation across all major podcast platforms.