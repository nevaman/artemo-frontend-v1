import { supabase } from '../lib/supabase'
import type { 
  DynamicTool, 
  AdminCategory, 
  ToolsApiResponse, 
  CategoriesApiResponse, 
  ApiResponse,
  Message,
  AdminToolQuestion
} from '../types'

export class SupabaseApiService {
  private static instance: SupabaseApiService

  static getInstance(): SupabaseApiService {
    if (!SupabaseApiService.instance) {
      SupabaseApiService.instance = new SupabaseApiService()
    }
    return SupabaseApiService.instance
  }

  // Tools API
  async getTools(): Promise<ToolsApiResponse> {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          category:categories(*),
          questions:tool_questions(*)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tools:', error)
        return { success: false, error: error.message }
      }

      // Transform data to match DynamicTool interface
      const tools: DynamicTool[] = data?.map(tool => ({
        id: tool.id,
        title: tool.title,
        description: tool.description,
        category: this.mapCategoryNameToEnum(tool.category?.name || 'OTHER'),
        active: tool.active,
        featured: tool.featured,
        primaryModel: tool.primary_model,
        fallbackModels: tool.fallback_models || [],
        promptInstructions: tool.prompt_instructions,
        questions: tool.questions?.map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          placeholder: q.placeholder,
          required: q.required,
          order: q.order_index,
          options: q.options
        })).sort((a: any, b: any) => a.order - b.order) || []
      })) || []

      return { success: true, data: tools }
    } catch (error) {
      console.error('Error in getTools:', error)
      return { success: false, error: 'Failed to fetch tools' }
    }
  }

  async createTool(tool: Omit<DynamicTool, 'id'>): Promise<ApiResponse<DynamicTool>> {
    try {
      // Get category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', this.mapCategoryEnumToName(tool.category))
        .single()

      // Create tool
      const { data: toolData, error: toolError } = await supabase
        .from('tools')
        .insert({
          title: tool.title,
          description: tool.description,
          category_id: category?.id,
          active: tool.active,
          featured: tool.featured,
          primary_model: tool.primaryModel,
          fallback_models: tool.fallbackModels,
          prompt_instructions: tool.promptInstructions
        })
        .select()
        .single()

      if (toolError) {
        return { success: false, error: toolError.message }
      }

      // Create questions
      if (tool.questions.length > 0) {
        const { error: questionsError } = await supabase
          .from('tool_questions')
          .insert(
            tool.questions.map(q => ({
              tool_id: toolData.id,
              label: q.label,
              type: q.type,
              placeholder: q.placeholder,
              required: q.required,
              order_index: q.order,
              options: q.options
            }))
          )

        if (questionsError) {
          console.error('Error creating questions:', questionsError)
        }
      }

      // Return created tool
      const createdTool: DynamicTool = {
        id: toolData.id,
        title: toolData.title,
        description: toolData.description,
        category: tool.category,
        active: toolData.active,
        featured: toolData.featured,
        primaryModel: toolData.primary_model,
        fallbackModels: toolData.fallback_models || [],
        promptInstructions: toolData.prompt_instructions,
        questions: tool.questions
      }

      return { success: true, data: createdTool }
    } catch (error) {
      console.error('Error creating tool:', error)
      return { success: false, error: 'Failed to create tool' }
    }
  }

  async updateTool(id: string, updates: Partial<DynamicTool>): Promise<ApiResponse<DynamicTool>> {
    try {
      // Get category ID if category is being updated
      let categoryId: string | undefined
      if (updates.category) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', this.mapCategoryEnumToName(updates.category))
          .single()
        categoryId = category?.id
      }

      // Update tool
      const { data: toolData, error: toolError } = await supabase
        .from('tools')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(categoryId && { category_id: categoryId }),
          ...(updates.active !== undefined && { active: updates.active }),
          ...(updates.featured !== undefined && { featured: updates.featured }),
          ...(updates.primaryModel && { primary_model: updates.primaryModel }),
          ...(updates.fallbackModels && { fallback_models: updates.fallbackModels }),
          ...(updates.promptInstructions && { prompt_instructions: updates.promptInstructions })
        })
        .eq('id', id)
        .select()
        .single()

      if (toolError) {
        return { success: false, error: toolError.message }
      }

      // Update questions if provided
      if (updates.questions) {
        // Delete existing questions
        await supabase
          .from('tool_questions')
          .delete()
          .eq('tool_id', id)

        // Insert new questions
        if (updates.questions.length > 0) {
          await supabase
            .from('tool_questions')
            .insert(
              updates.questions.map(q => ({
                tool_id: id,
                label: q.label,
                type: q.type,
                placeholder: q.placeholder,
                required: q.required,
                order_index: q.order,
                options: q.options
              }))
            )
        }
      }

      // Fetch updated tool with questions
      const { data: updatedTool } = await supabase
        .from('tools')
        .select(`
          *,
          category:categories(*),
          questions:tool_questions(*)
        `)
        .eq('id', id)
        .single()

      const result: DynamicTool = {
        id: updatedTool.id,
        title: updatedTool.title,
        description: updatedTool.description,
        category: this.mapCategoryNameToEnum(updatedTool.category?.name || 'OTHER'),
        active: updatedTool.active,
        featured: updatedTool.featured,
        primaryModel: updatedTool.primary_model,
        fallbackModels: updatedTool.fallback_models || [],
        promptInstructions: updatedTool.prompt_instructions,
        questions: updatedTool.questions?.map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type,
          placeholder: q.placeholder,
          required: q.required,
          order: q.order_index,
          options: q.options
        })).sort((a: any, b: any) => a.order - b.order) || []
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating tool:', error)
      return { success: false, error: 'Failed to update tool' }
    }
  }

  async deleteTool(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting tool:', error)
      return { success: false, error: 'Failed to delete tool' }
    }
  }

  // Categories API
  async getCategories(): Promise<CategoriesApiResponse> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })

      if (error) {
        return { success: false, error: error.message }
      }

      const categories: AdminCategory[] = data?.map(cat => ({
        id: cat.id,
        name: cat.name,
        displayOrder: cat.display_order,
        active: cat.active
      })) || []

      return { success: true, data: categories }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: 'Failed to fetch categories' }
    }
  }

  async createCategory(category: Omit<AdminCategory, 'id'>): Promise<ApiResponse<AdminCategory>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          display_order: category.displayOrder,
          active: category.active
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const result: AdminCategory = {
        id: data.id,
        name: data.name,
        displayOrder: data.display_order,
        active: data.active
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Error creating category:', error)
      return { success: false, error: 'Failed to create category' }
    }
  }

  async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<ApiResponse<AdminCategory>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.displayOrder !== undefined && { display_order: updates.displayOrder }),
          ...(updates.active !== undefined && { active: updates.active })
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const result: AdminCategory = {
        id: data.id,
        name: data.name,
        displayOrder: data.display_order,
        active: data.active
      }

      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating category:', error)
      return { success: false, error: 'Failed to update category' }
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { success: false, error: 'Failed to delete category' }
    }
  }

  // AI Chat API (placeholder - will be implemented with Edge Functions)
  async sendChatMessage(toolId: string, messages: Message[], knowledgeBase?: string): Promise<ApiResponse<string>> {
    try {
      // For now, return a mock response
      // This will be replaced with actual Edge Function call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockResponse = `This is a mock AI response for tool ${toolId}. In Phase 3, this will be replaced with real AI integration via Supabase Edge Functions.

Your conversation has ${messages.length} messages.
${knowledgeBase ? 'Knowledge base content was provided.' : 'No knowledge base content.'}

This response will be generated by the actual AI models (ChatGPT, Claude, Grok, Gemini) based on the tool configuration.`

      return { success: true, data: mockResponse }
    } catch (error) {
      console.error('Error in chat:', error)
      return { success: false, error: 'Failed to generate AI response' }
    }
  }

  // Helper methods
  private mapCategoryNameToEnum(name: string): any {
    const mapping: Record<string, any> = {
      'Ad Copy': 'AD_COPY',
      'Email Copy': 'EMAIL_COPY',
      'Long Form Content': 'LONG_FORM',
      'Client Management': 'CLIENT_MANAGEMENT',
      'Copy Improvement': 'COPY_IMPROVEMENT',
      'Sales & Funnel Copy': 'SALES_FUNNEL_COPY',
      'Podcast Tools': 'PODCAST_TOOLS',
      'Other': 'OTHER_FLOWS'
    }
    return mapping[name] || 'OTHER_FLOWS'
  }

  private mapCategoryEnumToName(category: any): string {
    const mapping: Record<any, string> = {
      'AD_COPY': 'Ad Copy',
      'EMAIL_COPY': 'Email Copy',
      'LONG_FORM': 'Long Form Content',
      'CLIENT_MANAGEMENT': 'Client Management',
      'COPY_IMPROVEMENT': 'Copy Improvement',
      'SALES_FUNNEL_COPY': 'Sales & Funnel Copy',
      'PODCAST_TOOLS': 'Podcast Tools',
      'OTHER_FLOWS': 'Other'
    }
    return mapping[category] || 'Other'
  }
}