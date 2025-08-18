import { Tool, ToolQuestion } from '@prisma/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  file?: {
    name: string;
    size: number;
  };
}

interface ToolWithQuestions extends Tool {
  questions: ToolQuestion[];
}

export class AIService {
  private claudeApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.claudeApiKey = process.env.CLAUDE_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateResponse(
    tool: ToolWithQuestions,
    messages: Message[],
    knowledgeBase?: string
  ): Promise<string> {
    try {
      // Try primary model first (Claude)
      if (tool.primaryModel === 'Claude' && this.claudeApiKey) {
        return await this.callClaude(tool, messages, knowledgeBase);
      } else if (tool.primaryModel === 'ChatGPT' && this.openaiApiKey) {
        return await this.callOpenAI(tool, messages, knowledgeBase);
      }

      // Fallback to available models
      for (const fallbackModel of tool.fallbackModels) {
        try {
          if (fallbackModel === 'Claude' && this.claudeApiKey) {
            return await this.callClaude(tool, messages, knowledgeBase);
          } else if (fallbackModel === 'ChatGPT' && this.openaiApiKey) {
            return await this.callOpenAI(tool, messages, knowledgeBase);
          }
        } catch (fallbackError) {
          console.warn(`Fallback model ${fallbackModel} failed:`, fallbackError);
          continue;
        }
      }

      // If no API keys are available, return mock response
      return this.generateMockResponse(tool, messages);
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private async callClaude(
    tool: ToolWithQuestions,
    messages: Message[],
    knowledgeBase?: string
  ): Promise<string> {
    if (!this.claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    // Build context from messages
    const context = this.buildContext(tool, messages, knowledgeBase);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: context
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  private async callOpenAI(
    tool: ToolWithQuestions,
    messages: Message[],
    knowledgeBase?: string
  ): Promise<string> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context from messages
    const context = this.buildContext(tool, messages, knowledgeBase);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: tool.promptInstructions
            },
            {
              role: 'user',
              content: context
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private buildContext(
    tool: ToolWithQuestions,
    messages: Message[],
    knowledgeBase?: string
  ): string {
    let context = `Tool: ${tool.title}\n`;
    context += `Instructions: ${tool.promptInstructions}\n\n`;

    if (knowledgeBase) {
      context += `Knowledge Base Context:\n${knowledgeBase}\n\n`;
    }

    context += `Conversation:\n`;
    messages.forEach(message => {
      if (message.sender === 'user') {
        context += `User: ${message.text}\n`;
      } else if (message.sender === 'ai') {
        context += `Assistant: ${message.text}\n`;
      }
    });

    context += `\nPlease provide a comprehensive response based on the tool's purpose and the user's inputs.`;

    return context;
  }

  private generateMockResponse(tool: ToolWithQuestions, messages: Message[]): string {
    const userMessages = messages.filter(m => m.sender === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Generate different mock responses based on tool category
    const category = tool.title.toLowerCase();

    if (category.includes('email')) {
      return `Here's your optimized email copy for "${tool.title}":\n\n**Subject Line:** ${this.generateMockSubject()}\n\n**Email Body:**\n${this.generateMockEmailBody(lastUserMessage?.text)}\n\n**Call to Action:** ${this.generateMockCTA()}\n\n*This is a generated response based on your inputs. The content has been optimized for engagement and conversion.*`;
    }

    if (category.includes('ad')) {
      return `Here's your compelling ad copy using the ${tool.title} framework:\n\n**Hook:** ${this.generateMockHook()}\n\n**Main Content:**\n${this.generateMockAdContent(lastUserMessage?.text)}\n\n**Call to Action:** ${this.generateMockCTA()}\n\n*This ad copy is optimized for your target platform and audience.*`;
    }

    if (category.includes('blog') || category.includes('article')) {
      return `Here's your comprehensive ${tool.title.toLowerCase()}:\n\n# ${this.generateMockTitle(lastUserMessage?.text)}\n\n## Introduction\n${this.generateMockIntro()}\n\n## Main Content\n${this.generateMockContent(lastUserMessage?.text)}\n\n## Conclusion\n${this.generateMockConclusion()}\n\n*This content is optimized for SEO and reader engagement.*`;
    }

    // Default response
    return `Based on your inputs for "${tool.title}", here's your generated content:\n\n${this.generateMockContent(lastUserMessage?.text)}\n\n*This is a comprehensive response tailored to your specific requirements. Feel free to request revisions or ask for alternative approaches.*`;
  }

  private generateMockSubject(): string {
    const subjects = [
      "The secret that changed everything...",
      "This might surprise you",
      "Quick question for you",
      "I almost didn't send this",
      "Your [specific result] is waiting"
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  private generateMockEmailBody(userInput?: string): string {
    return `Hi there,\n\nI wanted to share something that's been on my mind lately...\n\n${userInput ? `Regarding your interest in ${userInput}, ` : ''}I've discovered a approach that's been getting incredible results for people just like you.\n\nHere's what makes this different:\n• It works even if you're starting from scratch\n• You can see results in as little as 7 days\n• No complicated technical skills required\n\nThe best part? I'm offering a limited-time opportunity to get started today.\n\nInterested in learning more?`;
  }

  private generateMockHook(): string {
    const hooks = [
      "Stop scrolling! This changes everything...",
      "While everyone else struggles with [problem]...",
      "The secret that [industry experts] don't want you to know...",
      "What if I told you there's a better way?",
      "This 30-second trick will blow your mind..."
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  private generateMockAdContent(userInput?: string): string {
    return `${userInput ? `If you're struggling with ${userInput}, ` : ''}you're not alone. Thousands of people face this exact challenge every day.\n\nBut what if there was a proven solution that could help you achieve [desired outcome] in just [timeframe]?\n\nIntroducing [Your Solution] - the game-changing approach that's already helped [social proof number] people transform their [relevant area].\n\nHere's what makes it different:\n✓ Proven results in [timeframe]\n✓ Works even for complete beginners\n✓ No [common objection] required\n✓ 100% satisfaction guarantee`;
  }

  private generateMockCTA(): string {
    const ctas = [
      "Get started today →",
      "Claim your spot now",
      "Download the free guide",
      "Book your free consultation",
      "Join thousands of satisfied customers"
    ];
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  private generateMockTitle(userInput?: string): string {
    if (userInput) {
      return `The Complete Guide to ${userInput}: Everything You Need to Know`;
    }
    return "The Ultimate Guide to [Your Topic]: A Step-by-Step Approach";
  }

  private generateMockIntro(): string {
    return "In today's fast-paced world, finding the right approach can be challenging. This comprehensive guide will walk you through everything you need to know, step by step.";
  }

  private generateMockContent(userInput?: string): string {
    return `${userInput ? `When it comes to ${userInput}, ` : ''}there are several key factors to consider:\n\n1. **Understanding the Fundamentals**\n   Start with a solid foundation by mastering the basics.\n\n2. **Implementing Best Practices**\n   Follow proven strategies that have worked for others.\n\n3. **Measuring Your Progress**\n   Track your results and adjust your approach as needed.\n\n4. **Scaling Your Success**\n   Once you've found what works, expand and optimize.\n\nEach of these steps builds upon the previous one, creating a comprehensive system for achieving your goals.`;
  }

  private generateMockConclusion(): string {
    return "By following this approach, you'll be well on your way to achieving your desired results. Remember, success comes from consistent action and continuous improvement.";
  }

  async getModelsStatus(): Promise<{ [key: string]: boolean }> {
    return {
      Claude: !!this.claudeApiKey,
      ChatGPT: !!this.openaiApiKey,
      Grok: false, // Not implemented yet
      Gemini: false // Not implemented yet
    };
  }
}