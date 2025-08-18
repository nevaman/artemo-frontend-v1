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
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const toolId = formData.get('toolId') as string
    const chatSessionId = formData.get('chatSessionId') as string

    if (!file || !userId) {
      throw new Error('File and userId are required')
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type')
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${userId}/${timestamp}-${file.name}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('knowledge-base')
      .upload(fileName, file)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Extract text content from file
    let textContent = ''
    try {
      textContent = await extractTextFromFile(file)
    } catch (extractError) {
      console.error('Text extraction failed:', extractError)
      textContent = 'Text extraction failed for this file type'
    }

    // Store file metadata in database
    const { data: fileRecord, error: dbError } = await supabase
      .from('knowledge_base_files')
      .insert({
        user_id: userId,
        tool_id: toolId || null,
        chat_session_id: chatSessionId || null,
        filename: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('knowledge-base')
        .remove([uploadData.path])
      
      throw new Error(`Database error: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        fileId: fileRecord.id,
        filePath: uploadData.path,
        textContent: textContent.substring(0, 5000) // Limit to first 5000 chars
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  
  switch (file.type) {
    case 'text/plain':
    case 'text/markdown':
      return new TextDecoder().decode(arrayBuffer)
    
    case 'application/pdf':
      // For PDF extraction, you would typically use a library like pdf-parse
      // For now, return a placeholder
      return 'PDF text extraction not yet implemented. Please use plain text files.'
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      // For DOCX extraction, you would typically use a library like mammoth
      // For now, return a placeholder
      return 'DOCX text extraction not yet implemented. Please use plain text files.'
    
    default:
      throw new Error('Unsupported file type for text extraction')
  }
}