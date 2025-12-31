/**
 * Advanced Backend Debugging Helper
 * Provides detailed debugging for GIS and other endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Detailed GIS endpoint debugging
 * Logs semua request dan response details
 */
export const detailedGISDebug = async () => {
  console.clear()
  console.log(
    '%c🔍 DETAILED GIS DEBUGGING SESSION',
    'color: #2563eb; font-size: 16px; font-weight: bold',
  )
  console.log('%c' + '='.repeat(60), 'color: #94a3b8')

  const tests = [
    {
      name: 'Santri Points',
      url: `${API_BASE}/gis/santri-points`,
      method: 'GET',
      expectedType: 'FeatureCollection',
    },
    {
      name: 'Pesantren Points',
      url: `${API_BASE}/gis/pesantren-points`,
      method: 'GET',
      expectedType: 'FeatureCollection',
    },
    {
      name: 'Santri Heatmap',
      url: `${API_BASE}/gis/heatmap`,
      method: 'GET',
      expectedType: 'Array',
    },
    {
      name: 'Pesantren Heatmap',
      url: `${API_BASE}/gis/pesantren-heatmap`,
      method: 'GET',
      expectedType: 'Array',
    },
  ]

  for (const test of tests) {
    console.group(`\n📍 Testing: ${test.name}`)
    console.log('Request Info:')
    console.log(`  Method: ${test.method}`)
    console.log(`  URL: ${test.url}`)
    console.log(`  Expected: ${test.expectedType}`)

    try {
      const startTime = performance.now()

      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const endTime = performance.now()
      const duration = (endTime - startTime).toFixed(2)

      console.log(`\nResponse Info:`)
      console.log(`  Status: ${response.status} ${response.statusText}`)
      console.log(`  Duration: ${duration}ms`)

      // Log headers
      console.log(`\nResponse Headers:`)
      console.log(`  Content-Type: ${response.headers.get('content-type')}`)
      console.log(`  Content-Length: ${response.headers.get('content-length')}`)
      console.log(
        `  CORS Allow-Origin: ${response.headers.get('access-control-allow-origin') || 'Not Set'}`,
      )

      if (response.ok) {
        const data = await response.json()

        console.log(`\n✅ SUCCESS`)
        console.log(`Response Type:`, typeof data)
        console.log(`Is Array:`, Array.isArray(data))

        if (data.type === 'FeatureCollection') {
          console.log(`Features Count: ${data.features?.length || 0}`)
          if (data.features?.[0]) {
            console.log(`Sample Feature:`, data.features[0])
          }
        } else if (Array.isArray(data)) {
          console.log(`Array Length: ${data.length}`)
          if (data[0]) {
            console.log(`Sample Item:`, data[0])
          }
        } else {
          console.log(`Full Response:`, data)
        }
      } else {
        console.log(`\n❌ ERROR`)
        try {
          const errorData = await response.json()
          console.log(`Error Response:`, errorData)
        } catch (e) {
          console.log(`Could not parse error response as JSON`)
          const text = await response.text()
          console.log(`Raw Response:`, text)
        }
      }
    } catch (error) {
      console.log(`\n❌ FETCH FAILED`)
      console.log(`Error Type: ${error.name}`)
      console.log(`Error Message: ${error.message}`)
      console.log(`Stack:`, error.stack)

      // Common issues
      if (error.message.includes('Failed to fetch')) {
        console.log(`\n💡 Possible Issues:`)
        console.log(`  • CORS error (check console for CORS error message)`)
        console.log(`  • Backend not running at ${API_BASE}`)
        console.log(`  • Network connectivity issue`)
      }
    }

    console.groupEnd()
  }

  console.log('\n' + '%c' + '='.repeat(60), 'color: #94a3b8')
  console.log('%c✅ Debugging Complete', 'color: #10b981; font-weight: bold')
}

/**
 * Check CORS configuration
 */
export const checkCORS = async () => {
  console.group('🔐 CORS Configuration Check')

  try {
    const response = await fetch(`${API_BASE}/gis/santri-points`, {
      method: 'OPTIONS',
    })

    console.log('CORS Headers:')
    console.log({
      'Access-Control-Allow-Origin': response.headers.get('access-control-allow-origin'),
      'Access-Control-Allow-Methods': response.headers.get('access-control-allow-methods'),
      'Access-Control-Allow-Headers': response.headers.get('access-control-allow-headers'),
      'Access-Control-Max-Age': response.headers.get('access-control-max-age'),
    })
  } catch (error) {
    console.error('CORS check failed:', error.message)
  }

  console.groupEnd()
}

/**
 * Test endpoint dengan query parameters
 */
export const testGISWithFilters = async () => {
  console.group('🔍 Testing GIS with Query Parameters')

  const filters = [
    { name: 'No Filter', params: '' },
    { name: 'By Provinsi', params: '?provinsi=Jawa Barat' },
    { name: 'By Kabupaten', params: '?provinsi=Jawa Barat&kabupaten=Bandung' },
    { name: 'By Kecamatan', params: '?kecamatan=Bandung%20Kota' },
  ]

  for (const filter of filters) {
    console.group(`Test: ${filter.name}`)

    const url = `${API_BASE}/gis/santri-points${filter.params}`
    console.log(`URL: ${url}`)

    try {
      const response = await fetch(url)
      console.log(`Status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log(`Features: ${data.features?.length || 0}`)
      } else {
        const error = await response.json().catch(() => null)
        console.log(`Error:`, error)
      }
    } catch (error) {
      console.error(`Failed:`, error.message)
    }

    console.groupEnd()
  }

  console.groupEnd()
}

/**
 * Full network trace - log every step
 */
export const networkTrace = async (endpoint) => {
  console.group(`📡 Network Trace: ${endpoint}`)

  const url = `${API_BASE}${endpoint}`

  console.log('1️⃣ Building Request')
  console.log(`URL: ${url}`)
  console.log(`Method: GET`)

  console.log('\n2️⃣ Sending Request')
  const startTime = performance.now()

  try {
    const response = await fetch(url)
    const duration = performance.now() - startTime

    console.log('\n3️⃣ Received Response')
    console.log(`Duration: ${duration.toFixed(2)}ms`)
    console.log(`Status: ${response.status}`)
    console.log(`Status Text: ${response.statusText}`)

    console.log('\n4️⃣ Response Headers')
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.table(headers)

    console.log('\n5️⃣ Response Body')
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      console.log('\n✅ Request Successful')
    } else {
      console.log('\n❌ Request Failed with status:', response.status)
    }
  } catch (error) {
    const duration = performance.now() - startTime
    console.log('\n❌ Request Failed')
    console.log(`Duration: ${duration.toFixed(2)}ms`)
    console.log(`Error: ${error.message}`)
    console.log(`Stack:`, error.stack)
  }

  console.groupEnd()
}

/**
 * Compare expected vs actual response format
 */
export const validateResponseFormat = async (endpoint) => {
  console.group(`📋 Response Format Validation: ${endpoint}`)

  const expectedFormats = {
    '/gis/santri-points': {
      type: 'object',
      properties: {
        type: { type: 'string', value: 'FeatureCollection' },
        features: { type: 'array', items: { type: 'object' } },
      },
    },
    '/gis/pesantren-points': {
      type: 'object',
      properties: {
        type: { type: 'string', value: 'FeatureCollection' },
        features: { type: 'array', items: { type: 'object' } },
      },
    },
    '/gis/heatmap': {
      type: 'array',
      items: {
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' },
          weight: { type: 'number' },
        },
      },
    },
    '/gis/pesantren-heatmap': {
      type: 'array',
      items: {
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' },
          weight: { type: 'number' },
        },
      },
    },
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`)
    const data = await response.json()

    const expected = expectedFormats[endpoint]
    console.log('Expected Format:', expected)
    console.log('Actual Data:', data)

    if (expected) {
      console.log('\nValidation:')
      if (expected.type === 'array' && Array.isArray(data)) {
        console.log('✅ Data is array')
        console.log(`Items: ${data.length}`)
      } else if (
        expected.type === 'object' &&
        typeof data === 'object' &&
        data.type === 'FeatureCollection'
      ) {
        console.log('✅ Data is FeatureCollection')
        console.log(`Features: ${data.features?.length || 0}`)
      } else {
        console.log('❌ Format mismatch')
      }
    }
  } catch (error) {
    console.error('Validation failed:', error.message)
  }

  console.groupEnd()
}

/**
 * Check backend health
 */
export const checkBackendHealth = async () => {
  console.group('🏥 Backend Health Check')

  console.log(`Checking: ${API_BASE}`)

  try {
    const response = await fetch(`${API_BASE}/api/santri-pribadi?page=1&per_page=1`, {
      timeout: 5000,
    })

    console.log(`✅ Backend is responding`)
    console.log(`Status: ${response.status}`)
    console.log(`Server is running at: ${API_BASE}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`Database connection: ✅ OK`)
      console.log(`Sample response:`, data)
    }
  } catch (error) {
    console.log(`❌ Backend is NOT responding`)
    console.log(`Error: ${error.message}`)
    console.log(`Make sure backend is running at: ${API_BASE}`)
  }

  console.groupEnd()
}

/**
 * Export all debug functions
 */
export default {
  detailedGISDebug,
  checkCORS,
  testGISWithFilters,
  networkTrace,
  validateResponseFormat,
  checkBackendHealth,
}
