# PRD: Ad Copy Tools

**Category Owner:** Advertising Team
**Version:** 2.0
**Date:** 2025-18-01

---

## 1. Category Overview

**Name:** Ad Copy

**Purpose:** To provide a specialized set of tools for creating high-impact advertising copy across various platforms, including social media, search, and video. These tools leverage proven copywriting frameworks to maximize conversions, now with dynamic configuration, A/B testing capabilities, and platform-specific optimization.

## 2. Tools in this Category

- **Ad Writer (HAO):** Uses the Hook, Angle, Outcome framework with admin-configurable psychology triggers
- **Ad Writer (HSO):** Uses the Hook, Story, Offer framework with narrative optimization
- **YouTube Ad Script:** Generates scripts optimized for YouTube ads with timing and visual cue integration
- **Facebook Ad Creator:** Platform-specific ad copy with audience targeting optimization
- **Google Ads Writer:** Search-focused ad copy with keyword integration and quality score optimization
- **LinkedIn Ad Creator:** Professional platform optimization with B2B targeting features

## 2.1 Advanced Ad Copy Architecture

**Admin-Controlled Features:**
- **Framework Customization:** Modify and create custom advertising frameworks beyond HAO/HSO
- **Platform Optimization:** Specialized configurations for different advertising platforms
- **A/B Testing Integration:** Generate multiple variations for split testing
- **Compliance Checking:** Built-in validation for advertising standards and regulations
- **Performance Tracking:** Integration with ad platform APIs for performance optimization

## 3. User Flow & Logic

1. **Entry Point:** The user selects an Ad Copy tool from the Dashboard, "All Tools" page, or sidebar
2. **Activation Modal:** A large modal appears, showing the tool's info and a **"Start" button**
3. **Initiation:** The user clicks "Start" and enters the dynamic chat interface
4. **Framework-Specific Introduction:** The AI assistant introduces itself with admin-configured framework explanation and begins specialized question sequence
5. **Enhanced Ad Creation Loop:**
   - **Platform Selection:** Choose target advertising platform for optimization
   - **Framework Application:** Guide user through admin-configured framework components
   - **Audience Psychology:** Deep dive into target audience motivations and pain points
   - **Competitive Analysis:** Upload competitor ads and market research via Knowledge Base
   - **Multi-Variant Generation:** Create multiple ad variations for A/B testing
   - **Compliance Validation:** Automatic checking against platform policies and advertising regulations
   - **Performance Optimization:** Built-in suggestions for improving click-through rates and conversions

## 3.1 Advanced Framework Configuration

**HAO Framework Enhancement:**
- **Hook Variations:** Multiple psychological triggers (fear, curiosity, social proof, urgency)
- **Angle Customization:** Industry-specific angles and positioning strategies
- **Outcome Optimization:** Different outcome presentations (transformation, benefit, solution)

**HSO Framework Enhancement:**
- **Story Types:** Customer success, founder journey, problem-solution narratives
- **Emotional Triggers:** Joy, fear, anger, surprise, and other emotion-driven approaches
- **Offer Structures:** Discount, bonus, guarantee, and scarcity-based offers

## 4. General Prompt Structure & Examples

The conversation flow is dynamically generated based on admin configuration, with specialized sequences for different advertising platforms and campaign objectives.

### Example Interaction (for Ad Writer HAO)

> **AI Assistant:** *[Admin-configured introduction]* "I'm ready to write some compelling ads using the Hook-Angle-Outcome framework. First, what product are we advertising and which platform will you be running ads on?"
>
> **User:** "A new line of noise-canceling headphones for remote workers. We'll be running ads on Facebook and Instagram."
>
> **AI Assistant:** *[Admin-configured question 1]* "Perfect! Who is our target audience, and what's their biggest frustration with their current work setup?"
>
> **User:** "Remote workers aged 25-45 who get distracted by family, roommates, or neighborhood noise during important calls and deep work sessions."
>
> **AI Assistant:** *[Admin-configured question 2]* "Excellent! What makes these headphones different from other noise-canceling options on the market?"
>
> **User:** "They have AI-powered noise cancellation that specifically targets human voices and household sounds, plus 48-hour battery life."
>
> **AI Assistant:** *[Admin-configured question 3]* "Great unique selling points! What's your primary campaign objective - brand awareness, lead generation, or direct sales?"
>
> **User:** "Direct sales with a focus on our launch promotion - 30% off for the first 1000 customers."
>
> **AI Assistant:** *[Admin-configured question 4]* "Perfect! Do you have any competitor ads or successful campaigns I should reference? Also, what's your brand voice - professional, friendly, edgy, or something else?"
>
> **User:** "Brand voice is friendly but professional. I'll upload some competitor ads that have been performing well." *(uploads competitor analysis)*
>
> **AI Assistant:** *[Processes using admin-configured HAO framework and selected AI model]* "Excellent! Based on your inputs, I'm creating multiple HAO-framework ads optimized for Facebook/Instagram. Here are 5 variations..."
> *(Generates multiple ad variations with different hooks, angles, and outcome presentations)*

## 5. Administrative Ad Copy Management

### 5.1 AI Model Optimization by Platform

**Social Media Ads (Facebook, Instagram, TikTok):**
- **Primary:** GPT-4 (creative and engaging content that stops the scroll)
- **Fallback:** Claude (clear messaging and conversion optimization)
- **Knowledge Base:** High-performing social media ad databases, platform best practices

**Search Ads (Google, Bing):**
- **Primary:** Claude (keyword optimization and clear value propositions)
- **Fallback:** GPT-4 (creative headlines within character limits)
- **Knowledge Base:** Keyword research data, quality score optimization guides

**Video Ads (YouTube, Connected TV):**
- **Primary:** GPT-4 (narrative storytelling and emotional engagement)
- **Fallback:** Claude (clear structure and call-to-action optimization)
- **Knowledge Base:** Video ad scripts, timing guides, and visual cue suggestions

### 5.2 Platform-Specific Optimization

**Facebook/Instagram Ads:**
- **Character Limits:** Automatic optimization for primary text, headline, and description limits
- **Audience Targeting:** Integration with Facebook's audience insights and targeting options
- **Creative Formats:** Optimization for single image, carousel, video, and story formats
- **Pixel Integration:** Suggestions for conversion tracking and retargeting setup

**Google Ads:**
- **Quality Score Optimization:** Keyword relevance and landing page alignment suggestions
- **Ad Extensions:** Recommendations for sitelinks, callouts, and structured snippets
- **Responsive Search Ads:** Generate multiple headlines and descriptions for automatic testing
- **Local Optimization:** Location-specific ad copy for local businesses

**LinkedIn Ads:**
- **Professional Tone:** B2B-optimized messaging and professional language
- **Job Title Targeting:** Industry and role-specific messaging
- **Lead Generation:** Optimized for LinkedIn's lead gen forms and professional networking
- **Thought Leadership:** Content that positions brands as industry experts

### 5.3 A/B Testing and Performance Optimization

**Variation Generation:**
- **Hook Testing:** Multiple attention-grabbing opening lines
- **Angle Variations:** Different positioning strategies for the same product
- **CTA Optimization:** Various call-to-action phrases and urgency levels
- **Emotional Triggers:** Different psychological approaches (fear, desire, social proof)

**Performance Prediction:**
- **Click-Through Rate Estimation:** AI-powered predictions based on historical data
- **Conversion Probability:** Likelihood assessment based on offer and messaging
- **Audience Resonance:** Matching ad copy to specific audience segments
- **Competitive Analysis:** Positioning against competitor messaging

### 5.4 Compliance and Regulation Management

**Platform Policy Compliance:**
- **Facebook Advertising Policies:** Automatic checking against Facebook's advertising standards
- **Google Ads Policies:** Validation for trademark, healthcare, and financial advertising rules
- **Industry Regulations:** Compliance checking for regulated industries (healthcare, finance, legal)
- **Global Compliance:** International advertising law considerations

**Content Validation:**
- **Claim Verification:** Ensure all product claims are substantiated and legal
- **Trademark Checking:** Avoid unauthorized use of competitor trademarks
- **Sensitive Content:** Flag potentially problematic content before campaign launch
- **Age-Appropriate Content:** Ensure messaging is appropriate for target age groups

### 5.5 Advanced Analytics Integration

**Performance Tracking:**
- **Campaign Performance:** Integration with ad platform APIs for real-time performance data
- **Attribution Modeling:** Track customer journey from ad click to conversion
- **ROI Optimization:** Focus on ad variations that drive the highest return on ad spend
- **Audience Insights:** Learn which messaging resonates with different audience segments

**Continuous Optimization:**
- **Performance Learning:** AI learns from successful campaigns to improve future suggestions
- **Seasonal Optimization:** Adapt messaging for holidays, events, and market cycles
- **Trend Integration:** Incorporate current events and trending topics where appropriate
- **Competitive Intelligence:** Monitor competitor ad strategies and identify opportunities

### 5.6 Creative Asset Integration

**Visual Coordination:**
- **Image Suggestions:** Recommend visual styles that complement the ad copy
- **Video Script Integration:** Coordinate copy with video content and timing
- **Brand Consistency:** Ensure all creative elements align with brand guidelines
- **Mobile Optimization:** Optimize copy and creative for mobile viewing

**Multi-Format Campaigns:**
- **Cross-Platform Consistency:** Maintain consistent messaging across different platforms
- **Format Adaptation:** Adapt core messaging for different ad formats and placements
- **Funnel Integration:** Coordinate ad copy with landing pages and follow-up sequences
- **Retargeting Sequences:** Create progressive messaging for different stages of the customer journey

This enhanced Ad Copy category provides administrators with sophisticated tools for creating high-converting advertising campaigns while leveraging advanced AI capabilities and proven frameworks to maximize ROI across all major advertising platforms.