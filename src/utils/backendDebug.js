/**
 * Backend Debug Helper
 * Utility untuk testing dan debugging backend endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Test backend connection
 * Checks if backend is running and accessible
 */
export const testBackendConnection = async () => {
  console.log('🧪 Testing backend connection...')
  console.log('🔌 API Base URL:', API_BASE)

  try {
    // Try simple GET request to check if backend is up
    const response = await fetch(`${API_BASE}/api/santri-pribadi?page=1&per_page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('✅ Backend is accessible')
    console.log('📊 Status:', response.status, response.statusText)
    console.log('📋 Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      corsHeaders: {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      },
    })

    const data = await response.json()
    console.log('📦 Sample response:', data)
    return { status: 'ok', data }
  } catch (error) {
    console.error('❌ Backend is NOT accessible')
    console.error('📍 Error:', error.message)
    console.error('💡 Make sure backend is running at:', API_BASE)
    return { status: 'error', error: error.message }
  }
}

/**
 * Test scoring endpoints
 */
export const testScoringEndpoints = async () => {
  console.group('🧪 Testing Scoring Endpoints')

  const testSantriId = '550e8400-e29b-41d4-a716-446655440000'

  // Test 1: Get Santri Score
  console.group('📍 Test 1: GET /api/scoring/santri/{id}')
  try {
    const url = `${API_BASE}/api/scoring/santri/${testSantriId}`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success:', data)
    } else {
      const error = await response.json()
      console.log('⚠️ Error response:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  // Test 2: Calculate Santri Score
  console.group('📍 Test 2: POST /api/scoring/{id}/calculate')
  try {
    const url = `${API_BASE}/api/scoring/${testSantriId}/calculate`
    console.log('URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success:', data)
    } else {
      const error = await response.json()
      console.log('⚠️ Error response:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  console.groupEnd()
}

/**
 * Test GIS endpoints
 */
export const testGISEndpoints = async () => {
  console.group('🗺️ Testing GIS Endpoints')

  // Test 1: Santri Points
  console.group('📍 Test 1: GET /gis/santri-points')
  try {
    const url = `${API_BASE}/gis/santri-points`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success - Features count:', data.features?.length || 0)
      console.log('Sample feature:', data.features?.[0] || 'No data')
    } else {
      const error = await response.json()
      console.log('⚠️ Error:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  // Test 2: Pesantren Points
  console.group('📍 Test 2: GET /gis/pesantren-points')
  try {
    const url = `${API_BASE}/gis/pesantren-points`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success - Features count:', data.features?.length || 0)
      console.log('Sample feature:', data.features?.[0] || 'No data')
    } else {
      const error = await response.json()
      console.log('⚠️ Error:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  // Test 3: Heatmap
  console.group('📍 Test 3: GET /gis/heatmap')
  try {
    const url = `${API_BASE}/gis/heatmap`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success - Points count:', data.length || 0)
      console.log('Sample point:', data?.[0] || 'No data')
    } else {
      const error = await response.json()
      console.log('⚠️ Error:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  // Test 4: Pesantren Heatmap
  console.group('📍 Test 4: GET /gis/pesantren-heatmap')
  try {
    const url = `${API_BASE}/gis/pesantren-heatmap`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success - Points count:', data.length || 0)
      console.log('Sample point:', data?.[0] || 'No data')
    } else {
      const error = await response.json()
      console.log('⚠️ Error:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  console.groupEnd()
}

/**
 * Test Santri API endpoints
 */
export const testSantriEndpoints = async () => {
  console.group('👤 Testing Santri API Endpoints')

  // Test 1: List Santri
  console.group('📍 Test 1: GET /api/santri-pribadi')
  try {
    const url = `${API_BASE}/api/santri-pribadi?page=1&per_page=5`
    console.log('URL:', url)

    const response = await fetch(url)
    console.log('Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success')
      console.log('Total data:', data.pagination?.total || 'N/A')
      console.log('Sample santri:', data.data?.[0] || 'No data')
    } else {
      const error = await response.json()
      console.log('⚠️ Error:', error)
    }
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  console.groupEnd()

  console.groupEnd()
}

/**
 * Check all endpoints and create a report
 */
export const runFullBackendDiagnostics = async () => {
  console.clear()
  console.log('%c🔍 BACKEND DIAGNOSTICS REPORT', 'color: blue; font-size: 16px; font-weight: bold')
  console.log('%c' + '='.repeat(50), 'color: gray')

  console.group('⚙️ System Info')
  console.log('API Base URL:', API_BASE)
  console.log('Environment:', import.meta.env.MODE)
  console.log('Timestamp:', new Date().toISOString())
  console.groupEnd()

  console.log('\n')
  await testBackendConnection()

  console.log('\n')
  await testScoringEndpoints()

  console.log('\n')
  await testGISEndpoints()

  console.log('\n')
  await testSantriEndpoints()

  console.log('\n')
  console.log('%c' + '='.repeat(50), 'color: gray')
  console.log('%c✅ Diagnostics Complete!', 'color: green; font-weight: bold')
  console.log('💡 Open DevTools → Console to see detailed results')
}

/**
 * Format error response for display
 */
export const formatBackendError = (error, status) => {
  return {
    status,
    statusText: getStatusText(status),
    timestamp: new Date().toISOString(),
    detail: error?.detail || error?.message || 'Unknown error',
    fullResponse: error,
  }
}

/**
 * Get HTTP status text
 */
const getStatusText = (status) => {
  const statusMap = {
    400: 'Bad Request - Invalid data format or missing required fields',
    401: 'Unauthorized - Authentication required',
    403: 'Forbidden - You do not have permission',
    404: 'Not Found - Resource does not exist',
    409: 'Conflict - Resource already exists or conflict',
    422: 'Unprocessable Entity - Validation error',
    500: 'Internal Server Error - Backend error',
    502: 'Bad Gateway - Server unavailable',
    503: 'Service Unavailable - Server is down',
  }
  return statusMap[status] || `HTTP ${status}`
}

export default {
  testBackendConnection,
  testScoringEndpoints,
  testGISEndpoints,
  testSantriEndpoints,
  runFullBackendDiagnostics,
  formatBackendError,
}
