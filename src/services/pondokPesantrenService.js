// API Service for Pondok Pesantren CRUD operations
import { API_BASE_URL } from '@/utils/apiConfig'

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams()

  if (params.page) query.append('page', params.page)
  if (params.per_page) query.append('per_page', params.per_page)
  if (params.search) query.append('search', params.search)
  if (params.provinsi) query.append('provinsi', params.provinsi)
  if (params.kabupaten) query.append('kabupaten', params.kabupaten)

  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

const normalizePagination = (response, fallbackParams = {}) => {
  const perPage = Number(response?.per_page || fallbackParams.per_page || 10)
  const page = Number(response?.page || fallbackParams.page || 1)
  const total = Number(response?.total || 0)
  const totalPages = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1

  return {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  }
}

const handleResponse = async (response, defaultErrorMessage) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message = errorData?.message || defaultErrorMessage
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const getPondokList = async (params = {}) => {
  const queryString = buildQueryString(params)
  const url = `${API_BASE_URL}/pondok-pesantren${queryString}`

  const response = await fetch(url)
  const data = await handleResponse(response, 'Gagal mengambil data pondok pesantren')

  return {
    data: data?.data || [],
    pagination: normalizePagination(data, params),
  }
}

export const getPondokDetail = async (id) => {
  const url = `${API_BASE_URL}/pondok-pesantren/${id}`
  const response = await fetch(url)
  return handleResponse(response, 'Gagal mengambil detail pondok pesantren')
}

const buildFormData = (data, files = []) => {
  const formData = new FormData()

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    formData.append(key, value)
  })

  files.forEach((file) => formData.append('foto_files', file))
  return formData
}

export const createPondok = async (data, files = []) => {
  const url = `${API_BASE_URL}/pondok-pesantren`
  const formData = buildFormData(data, files)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  return handleResponse(response, 'Gagal menambahkan pondok pesantren')
}

export const updatePondok = async (id, data, files = []) => {
  const url = `${API_BASE_URL}/pondok-pesantren/${id}`
  const formData = buildFormData(data, files)

  const response = await fetch(url, {
    method: 'PUT',
    body: formData,
  })

  return handleResponse(response, 'Gagal memperbarui pondok pesantren')
}

export const deletePondok = async (id) => {
  const url = `${API_BASE_URL}/pondok-pesantren/${id}`
  const response = await fetch(url, { method: 'DELETE' })
  await handleResponse(response, 'Gagal menghapus pondok pesantren')
  return { success: true }
}
