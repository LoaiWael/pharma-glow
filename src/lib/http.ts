export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export type ApiEnvelope<T> = {
  data: T
  links?: unknown
  meta?: unknown
  message?: string
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  token?: string | null
  signal?: AbortSignal
  query?: Record<string, string | number | boolean | null | undefined>
}

const getBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (!base) {
    throw new ApiError('VITE_API_BASE_URL is not configured', 500)
  }
  return base.replace(/\/$/, '')
}

const buildUrl = (
  path: string,
  query?: RequestOptions['query'],
): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${getBaseUrl()}${normalizedPath}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  const text = await response.text()
  return text || null
}

const getErrorMessage = (body: unknown, fallback: string): string => {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

const resolveCurrentLocale = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/en') || path === '/en') return 'en'
  }
  return 'ar'
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers, token, signal, query } = options

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }
  if (!requestHeaders.has('Accept-Language')) {
    requestHeaders.set('Accept-Language', resolveCurrentLocale())
  }

  const init: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  }

  if (body !== undefined) {
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json')
    }
    init.body = JSON.stringify(body)
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path, query), init)
  const parsed = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(parsed, response.statusText || 'Request failed'),
      response.status,
      parsed,
    )
  }

  return parsed as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

/** Unwrap Laravel-style `{ data: T }` envelopes. */
export const apiData = async <T>(
  path: string,
  options?: Omit<RequestOptions, 'method' | 'body'>,
): Promise<T> => {
  const envelope = await api.get<ApiEnvelope<T>>(path, options)
  return envelope.data
}
