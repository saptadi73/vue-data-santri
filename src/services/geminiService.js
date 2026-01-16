import { API_BASE_URL } from '@/utils/apiConfig'

const API_BASE = API_BASE_URL

/**
 * Gemini AI Service
 * Service untuk Gemini AI Vision API interactions
 */

/**
 * Analyze single image with Gemini AI
 * @param {File} file - Image file (JPG, PNG, GIF, WEBP, BMP)
 * @param {string} prompt - Optional analysis prompt
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImage = async (file, prompt = '') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (prompt) {
      formData.append('prompt', prompt)
    }

    const response = await fetch(`${API_BASE}/gemini/analyze/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Analysis failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response:', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}

/**
 * Analyze video with Gemini AI
 * @param {File} file - Video file (MP4, MOV, AVI, WEBM)
 * @param {string} prompt - Optional analysis prompt
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeVideo = async (file, prompt = '') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (prompt) {
      formData.append('prompt', prompt)
    }

    const response = await fetch(`${API_BASE}/gemini/analyze/video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Video analysis failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response (Video):', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error analyzing video:', error)
    throw error
  }
}

/**
 * Analyze multiple images with Gemini AI
 * @param {File[]} files - Array of image files (max 10)
 * @param {string} prompt - Optional analysis prompt
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeMultipleImages = async (files, prompt = '') => {
  try {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('files', file)
    })
    if (prompt) {
      formData.append('prompt', prompt)
    }

    const response = await fetch(`${API_BASE}/gemini/analyze/multiple-images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Multiple images analysis failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response (Multiple):', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error analyzing multiple images:', error)
    throw error
  }
}

/**
 * Extract text from image (OCR)
 * @param {File} file - Image file containing text
 * @returns {Promise<Object>} Extracted text result
 */
export const extractTextFromImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/gemini/ocr`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `OCR failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response (OCR):', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error extracting text:', error)
    throw error
  }
}

/**
 * Analyze pesantren facility with specialized template
 * @param {File} file - Image of pesantren facility
 * @returns {Promise<Object>} Facility analysis result
 */
export const analyzePesantrenFacility = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/gemini/analyze/pesantren-facility`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Pesantren facility analysis failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response (Pesantren):', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error analyzing pesantren facility:', error)
    throw error
  }
}

/**
 * Analyze santri housing with socio-economic indicators
 * @param {File} file - Image of santri house
 * @returns {Promise<Object>} Housing analysis result
 */
export const analyzeSantriHousing = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/gemini/analyze/santri-housing`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || `Santri housing analysis failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response (Santri Housing):', data)

    // Return nested data if exists, otherwise return data
    if (data.status === 'success' && data.data) {
      return data.data
    }
    return data
  } catch (error) {
    console.error('Error analyzing santri housing:', error)
    throw error
  }
}

/**
 * Health check for Gemini AI configuration
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/gemini/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error health checking Gemini:', error)
    throw error
  }
}

export default {
  analyzeImage,
  analyzeVideo,
  analyzeMultipleImages,
  extractTextFromImage,
  analyzePesantrenFacility,
  analyzeSantriHousing,
  healthCheck,
}
