import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { toolId, messages, knowledgeBase } = await req.json()
    
    // Get tool configuration from database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .select(`
        *,
        questions:tool_questions(*)
      `)
      .eq('id', toolId)
      .single()

    if (toolError || !tool) {
      throw new Error('Tool not found')
    }

    // Build context from user answers and tool configuration
    const userAnswers = messages
      .filter((m: any) => m.sender === 'user')
      .map((m: any) => m.text)
      .join('\n')

    const systemPrompt = `${tool.prompt_instructions}

User's answers to questions:
${userAnswers}

${knowledgeBase ? `Additional context from knowledge base:
${knowledgeBase}` : ''}

Please generate a comprehensive response based on the tool configuration and user inputs.`

    // Call appropriate AI API based on tool configuration
    let aiResponse: string
    
    try {
      switch (tool.primary_model) {
        case 'ChatGPT':
        case 'GPT-4':
          aiResponse = await callOpenAI(systemPrompt, messages)
          break
        case 'Claude':
          aiResponse = await callAnthropic(systemPrompt, messages)
          break
        case 'Grok':
          aiResponse = await callGrok(systemPrompt, messages)
          break
        case 'Gemini':
          aiResponse = await callGemini(systemPrompt, messages)
          break
        default:
          // Fallback to OpenAI
          aiResponse = await callOpenAI(systemPrompt, messages)
      }
    } catch (primaryError) {
      console.error(`Primary model ${tool.primary_model} failed:`, primaryError)
      
      // Try fallback models
      for (const fallbackModel of tool.fallback_models || []) {
        try {
          switch (fallbackModel) {
            case 'ChatGPT':
            case 'GPT-4':
              aiResponse = await callOpenAI(systemPrompt, messages)
              break
            case 'Claude':
              aiResponse = await callAnthropic(systemPrompt, messages)
              break
            case 'Grok':
              aiResponse = await callGrok(systemPrompt, messages)
              break
            case 'Gemini':
              aiResponse = await callGemini(systemPrompt, messages)
              break
          }
          break // Success with fallback
        } catch (fallbackError) {
          console.error(`Fallback model ${fallbackModel} failed:`, fallbackError)
          continue
        }
      }
      
      if (!aiResponse!) {
        throw new Error('All AI models failed to respond')
      }
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function callOpenAI(systemPrompt: string, messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
          .filter((m: any) => m.sender !== 'system')
          .map((m: any) => ({ 
            role: m.sender === 'user' ? 'user' : 'assistant', 
            content: m.text 
          }))
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callAnthropic(systemPrompt: string, messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages
        .filter((m: any) => m.sender !== 'system')
        .map((m: any) => ({ 
          role: m.sender === 'user' ? 'user' : 'assistant', 
          content: m.text 
        }))
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function callGrok(systemPrompt: string, messages: any[]): Promise<string> {
  // Placeholder for Grok API - replace with actual implementation when available
  throw new Error('Grok API not yet implemented')
}

async function callGemini(systemPrompt: string, messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nConversation:\n${messages
            .filter((m: any) => m.sender !== 'system')
            .map((m: any) => `${m.sender}: ${m.text}`)
            .join('\n')}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      }
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}