// API service for dynamic tool management - now connected to real backend!
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;
  
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Handle API responses
  private async handleResponse<T>(response: Response): Promise<import('../types').ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data.data
    };
  }

  // Tools API
  async getTools(): Promise<import('../types').ToolsApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tools`, {
        headers: this.getHeaders()
      });
      return this.handleResponse<import('../types').DynamicTool[]>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch tools'
      };
    }
  }

  async createTool(tool: Omit<import('../types').DynamicTool, 'id'>): Promise<import('../types').ApiResponse<import('../types').DynamicTool>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/tools`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tool)
      });
      return this.handleResponse<import('../types').DynamicTool>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create tool'
      };
    }
  }

  async updateTool(id: string, updates: Partial<import('../types').DynamicTool>): Promise<import('../types').ApiResponse<import('../types').DynamicTool>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/tools/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });
      return this.handleResponse<import('../types').DynamicTool>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update tool'
      };
    }
  }

  async deleteTool(id: string): Promise<import('../types').ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/tools/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete tool'
      };
    }
  }

  // Categories API
  async getCategories(): Promise<import('../types').CategoriesApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        headers: this.getHeaders()
      });
      return this.handleResponse<import('../types').AdminCategory[]>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch categories'
      };
    }
  }

  async createCategory(category: Omit<import('../types').AdminCategory, 'id'>): Promise<import('../types').ApiResponse<import('../types').AdminCategory>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(category)
      });
      return this.handleResponse<import('../types').AdminCategory>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create category'
      };
    }
  }

  async updateCategory(id: string, updates: Partial<import('../types').AdminCategory>): Promise<import('../types').ApiResponse<import('../types').AdminCategory>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates)
      });
      return this.handleResponse<import('../types').AdminCategory>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update category'
      };
    }
  }

  async deleteCategory(id: string): Promise<import('../types').ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return this.handleResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete category'
      };
    }
  }

  // AI Chat API
  async sendChatMessage(toolId: string, messages: import('../types').Message[], knowledgeBase?: string): Promise<import('../types').ApiResponse<string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          toolId,
          messages,
          knowledgeBase
        })
      });
      return this.handleResponse<string>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate AI response'
      };
    }
  }

  // Authentication API
  async login(email: string, password: string): Promise<import('../types').ApiResponse<{ user: any; accessToken: string; refreshToken: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const result = await this.handleResponse<{ user: any; accessToken: string; refreshToken: string }>(response);
      
      if (result.success && result.data) {
        this.setToken(result.data.accessToken);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  async register(email: string, name: string, password: string): Promise<import('../types').ApiResponse<{ user: any; accessToken: string; refreshToken: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });
      
      const result = await this.handleResponse<{ user: any; accessToken: string; refreshToken: string }>(response);
      
      if (result.success && result.data) {
        this.setToken(result.data.accessToken);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }
}