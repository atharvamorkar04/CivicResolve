/**
 * CivicResolve Type-Safe Frontend API Client
 * Interfaces with Core PHP REST API endpoints with automatic session cookie forwarding and CSRF handling.
 */

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string>
}

export interface User {
  user_id: number
  name: string
  email: string
  role: 'citizen' | 'admin' | 'department'
  department_id: number | null
  department_name?: string | null
  phone: string | null
}

export interface Category {
  category_id: number
  name: string
  parent_category_id: number | null
  description: string | null
  is_active: number
  subcategories?: Category[]
}

export interface Department {
  department_id: number
  name: string
  code: string
  contact_email: string
  description: string | null
  is_active: number
}

export interface ComplaintUpdate {
  update_id: number
  complaint_id: number
  user_id: number
  previous_status: string | null
  new_status: string
  remarks: string | null
  created_at: string
  actor_name?: string
  actor_role?: string
}

export interface Complaint {
  complaint_id: number
  user_id: number
  title: string
  description: string
  category_id: number
  subcategory_id: number | null
  image_path: string | null
  resolution_image_path?: string | null
  latitude: string | number | null
  longitude: string | number | null
  address: string | null
  department_id: number | null
  status: 'Pending' | 'Approved' | 'In Progress' | 'Resolved' | 'Rejected'
  priority: 'Standard' | 'Urgent'
  admin_remarks: string | null
  citizen_rating?: number | null
  citizen_feedback?: string | null
  created_at: string
  updated_at: string
  category_name?: string
  subcategory_name?: string
  department_name?: string
  department_code?: string
  citizen_name?: string
  citizen_email?: string
  citizen_phone?: string
  history?: ComplaintUpdate[]
}

export interface AdminMetrics {
  total: number
  pending: number
  approved: number
  in_progress: number
  resolved: number
  rejected: number
}

export interface DepartmentMetrics {
  total: number
  pending_action: number
  in_progress: number
  resolved: number
}

let cachedCsrfToken: string | null = null

export class ApiError extends Error {
  public status: number
  public errors?: Record<string, string>

  constructor(message: string, status: number = 400, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  // Include CSRF token if cached or state-changing
  if (cachedCsrfToken && !headers['X-CSRF-Token']) {
    headers['X-CSRF-Token'] = cachedCsrfToken
  }

  // If body is NOT FormData, set JSON Content-Type
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Ensure session cookies are sent and stored
    })

    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: `Server returned HTTP ${res.status} with non-JSON response.`,
    }))

    // Cache CSRF token if returned in response
    if (data.data && typeof data.data === 'object' && 'csrf_token' in (data.data as any)) {
      cachedCsrfToken = (data.data as any).csrf_token
    }

    if (!res.ok || !data.success) {
      throw new ApiError(
        data.message || `Request failed with status ${res.status}`,
        res.status,
        data.errors
      )
    }

    return data
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err
    }
    // Network failure
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the PHP service is running.',
      0
    )
  }
}

export const api = {
  auth: {
    async csrf(): Promise<string> {
      const res = await request<{ csrf_token: string }>('/auth/csrf.php', { method: 'GET' })
      cachedCsrfToken = res.data?.csrf_token || null
      return cachedCsrfToken || ''
    },

    async register(data: { name: string; email: string; password: string; phone?: string }): Promise<ApiResponse<{ user: User; csrf_token: string }>> {
      return request('/auth/register.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    async login(data: { email: string; password: string }): Promise<ApiResponse<{ user: User; csrf_token: string }>> {
      return request('/auth/login.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    async me(): Promise<ApiResponse<{ user: User; csrf_token: string }>> {
      return request('/auth/me.php', { method: 'GET' })
    },

    async logout(): Promise<ApiResponse<null>> {
      cachedCsrfToken = null
      return request('/auth/logout.php', { method: 'POST' })
    },
  },

  categories: {
    async get(parentId?: number): Promise<Category[]> {
      const q = parentId !== undefined ? `?parent_id=${parentId}` : ''
      const res = await request<Category[]>(`/categories/index.php${q}`, { method: 'GET' })
      return res.data || []
    },

    async getTree(): Promise<Category[]> {
      const res = await request<Category[]>('/categories/index.php?include_subcategories=1', { method: 'GET' })
      return res.data || []
    },
  },

  departments: {
    async get(): Promise<Department[]> {
      const res = await request<Department[]>('/departments/index.php', { method: 'GET' })
      return res.data || []
    },
  },

  complaints: {
    async create(formData: FormData): Promise<ApiResponse<Complaint>> {
      return request<Complaint>('/complaints/create.php', {
        method: 'POST',
        body: formData,
      })
    },

    async getMyComplaints(status?: string): Promise<Complaint[]> {
      const q = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
      const res = await request<Complaint[]>(`/complaints/my_complaints.php${q}`, { method: 'GET' })
      return res.data || []
    },

    async getDetails(id: number | string): Promise<Complaint> {
      const res = await request<Complaint>(`/complaints/details.php?id=${id}`, { method: 'GET' })
      if (!res.data) throw new ApiError('Complaint not found', 404)
      return res.data
    },

    async submitFeedback(data: {
      complaint_id: number
      rating: number
      feedback?: string
    }): Promise<ApiResponse<{ complaint_id: number; citizen_rating: number; citizen_feedback: string }>> {
      return request('/complaints/feedback.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  admin: {
    async getComplaints(params?: {
      status?: string
      department_id?: number
      category_id?: number
      search?: string
    }): Promise<{ metrics: AdminMetrics; complaints: Complaint[] }> {
      const query = new URLSearchParams()
      if (params?.status && params.status !== 'all') query.set('status', params.status)
      if (params?.department_id) query.set('department_id', String(params.department_id))
      if (params?.category_id) query.set('category_id', String(params.category_id))
      if (params?.search) query.set('search', params.search)

      const qs = query.toString() ? `?${query.toString()}` : ''
      const res = await request<{ metrics: AdminMetrics; complaints: Complaint[] }>(`/admin/complaints.php${qs}`, {
        method: 'GET',
      })
      return res.data || { metrics: { total: 0, pending: 0, approved: 0, in_progress: 0, resolved: 0, rejected: 0 }, complaints: [] }
    },

    async updateComplaint(data: {
      complaint_id: number
      status?: string
      department_id?: number
      priority?: string
      admin_remarks?: string
    }): Promise<Complaint> {
      const res = await request<Complaint>('/admin/update_complaint.php', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (!res.data) throw new ApiError('Failed to update complaint', 500)
      return res.data
    },
  },

  department: {
    async getComplaints(params?: { status?: string; department_id?: number }): Promise<{
      department_id: number
      department_name?: string | null
      department_code?: string | null
      metrics: DepartmentMetrics
      complaints: Complaint[]
    }> {
      const query = new URLSearchParams()
      if (params?.status && params.status !== 'all') query.set('status', params.status)
      if (params?.department_id) query.set('department_id', String(params.department_id))

      const qs = query.toString() ? `?${query.toString()}` : ''
      const res = await request<{
        department_id: number
        department_name?: string | null
        department_code?: string | null
        metrics: DepartmentMetrics
        complaints: Complaint[]
      }>(
        `/department/complaints.php${qs}`,
        { method: 'GET' }
      )
      return res.data || { department_id: 0, metrics: { total: 0, pending_action: 0, in_progress: 0, resolved: 0 }, complaints: [] }
    },

    async updateStatus(data: FormData | {
      complaint_id: number
      status: string
      remarks: string
    }): Promise<any> {
      const isFormData = data instanceof FormData
      const res = await request('/department/update_status.php', {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
      })
      return res.data
    },
  },
}
