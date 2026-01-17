#!/usr/bin/env node
/**
 * API Connection & Data Validation Script
 * Usage: node test-api-connection.js
 *
 * This script tests all necessary API endpoints and validates data structure
 */

const http = require('http')
const https = require('https')

const API_BASE = process.env.API_BASE || 'http://localhost:8000'

// Utility to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data.length > 0 ? JSON.parse(data) : null,
              rawData: data,
            })
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

// Color output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

function logJson(obj, indent = 2) {
  console.log(JSON.stringify(obj, null, indent))
}

async function testConnectivity() {
  log('\n=== 1. Testing Backend Connectivity ===', 'cyan')
  try {
    const response = await makeRequest(`${API_BASE}/`)
    if (response.status === 200 || response.status === 404) {
      log('✅ Backend is running at ' + API_BASE, 'green')
      return true
    } else {
      log(`⚠️ Unexpected status: ${response.status}`, 'yellow')
      return true // Still reachable
    }
  } catch (err) {
    log(`❌ Cannot connect to backend: ${err.message}`, 'red')
    log(`   Make sure backend is running at ${API_BASE}`, 'red')
    return false
  }
}

async function testSantriPoints() {
  log('\n=== 2. Testing /gis/santri-points Endpoint ===', 'cyan')
  try {
    const response = await makeRequest(`${API_BASE}/gis/santri-points`)

    if (response.status === 404) {
      log('❌ Endpoint not found (404)', 'red')
      log('   Backend may not have GIS module implemented', 'red')
      return false
    }

    if (response.status !== 200) {
      log(`⚠️ Unexpected status: ${response.status}`, 'yellow')
      return false
    }

    const data = response.data
    log(`✅ Endpoint responding (Status: ${response.status})`, 'green')

    // Check if it's a FeatureCollection
    if (data.type === 'FeatureCollection') {
      log(`✅ Valid GeoJSON FeatureCollection`, 'green')
      const featureCount = data.features?.length || 0
      log(`   Features: ${featureCount}`, 'green')

      if (featureCount > 0) {
        const sample = data.features[0]
        log('\n   Sample feature properties:', 'blue')
        logJson(sample.properties, 4)

        // Check required fields
        const props = sample.properties || {}
        const checks = {
          kabupaten: props.kabupaten || props.kabupaten_domisili || props.kab || null,
          score: props.score || props.skor || props.total_score || null,
          ekonomi: props.ekonomi || null,
        }

        log('\n   Field validation:', 'blue')
        log(
          `   ${checks.kabupaten ? '✅' : '❌'} Kabupaten field: ${checks.kabupaten ? 'Found' : 'Missing'}`,
          checks.kabupaten ? 'green' : 'red',
        )
        log(
          `   ${checks.score ? '✅' : '❌'} Score field: ${checks.score ? 'Found (' + checks.score + ')' : 'Missing'}`,
          checks.score ? 'green' : 'red',
        )
        log(
          `   ${checks.ekonomi ? '✅' : '❌'} Ekonomi field: ${checks.ekonomi ? 'Found (' + checks.ekonomi + ')' : 'Missing'}`,
          checks.ekonomi ? 'green' : 'red',
        )

        if (!checks.score) {
          log('\n   ⚠️ IMPORTANT: Score field is missing!', 'yellow')
          log('   This is needed for choropleth coloring to work correctly', 'yellow')
          log('   See: BACKEND_FIX_NEEDED.md for required changes', 'yellow')
        }

        return checks.kabupaten !== null
      } else {
        log('⚠️ No features in response', 'yellow')
        return true
      }
    } else {
      log(`❌ Not a valid FeatureCollection (type: ${data.type})`, 'red')
      log('   Expected: {"type": "FeatureCollection", "features": [...]}', 'red')
      return false
    }
  } catch (err) {
    log(`❌ Error testing santri-points: ${err.message}`, 'red')
    return false
  }
}

async function testHeatmap() {
  log('\n=== 3. Testing /gis/heatmap Endpoint ===', 'cyan')
  try {
    const response = await makeRequest(`${API_BASE}/gis/heatmap`)

    if (response.status === 404) {
      log('⚠️ Endpoint not found (404)', 'yellow')
      log('   Heatmap may not be implemented yet', 'yellow')
      return false
    }

    if (response.status !== 200) {
      log(`⚠️ Unexpected status: ${response.status}`, 'yellow')
      return false
    }

    const data = response.data
    log(`✅ Endpoint responding (Status: ${response.status})`, 'green')

    // Check if it's an array
    if (Array.isArray(data)) {
      log(`✅ Valid array data`, 'green')
      log(`   Points: ${data.length}`, 'green')

      if (data.length > 0) {
        const sample = data[0]
        log('\n   Sample point:', 'blue')
        logJson(sample, 4)

        // Check required fields
        const hasLat = sample.lat || sample.latitude || false
        const hasLng = sample.lng || sample.longitude || false
        const hasWeight = sample.weight || sample.score || sample.skor || false

        log('\n   Field validation:', 'blue')
        log(
          `   ${hasLat ? '✅' : '❌'} Latitude: ${hasLat ? 'Found' : 'Missing'}`,
          hasLat ? 'green' : 'red',
        )
        log(
          `   ${hasLng ? '✅' : '❌'} Longitude: ${hasLng ? 'Found' : 'Missing'}`,
          hasLng ? 'green' : 'red',
        )
        log(
          `   ${hasWeight ? '✅' : '❌'} Weight/Score: ${hasWeight ? 'Found' : 'Missing'}`,
          hasWeight ? 'green' : 'red',
        )

        return hasLat && hasLng
      } else {
        log('⚠️ No data points in response', 'yellow')
        return true
      }
    } else {
      log(`❌ Not a valid array (type: ${typeof data})`, 'red')
      return false
    }
  } catch (err) {
    log(`❌ Error testing heatmap: ${err.message}`, 'red')
    return false
  }
}

async function testBoundary() {
  log('\n=== 4. Testing Boundary GeoJSON ===', 'cyan')
  try {
    // This is a local file, not an API call
    const fs = require('fs')
    const path = require('path')

    // Try common locations
    const possiblePaths = [
      './public/data/geo/indonesia-kabupaten.geojson',
      '../public/data/geo/indonesia-kabupaten.geojson',
      '../../public/data/geo/indonesia-kabupaten.geojson',
      './data/geo/indonesia-kabupaten.geojson',
    ]

    let found = false
    let data = null

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          log(`✅ Boundary file found at: ${filePath}`, 'green')
          found = true
          break
        }
      } catch (e) {
        // Continue to next path
      }
    }

    if (!found) {
      log('⚠️ Boundary GeoJSON file not found in expected locations', 'yellow')
      log('   Expected: /data/geo/indonesia-kabupaten.geojson', 'yellow')
      return false
    }

    if (data.type === 'FeatureCollection') {
      log(`✅ Valid GeoJSON FeatureCollection`, 'green')
      log(`   Boundary features: ${data.features?.length || 0}`, 'green')

      if (data.features && data.features.length > 0) {
        const sample = data.features[0]
        const nameField =
          sample.properties?.nama ||
          sample.properties?.NAME ||
          sample.properties?.NAME_2 ||
          'Unknown'
        log(`   Sample boundary: ${nameField}`, 'green')
      }
      return true
    } else {
      log(`❌ Not a valid FeatureCollection`, 'red')
      return false
    }
  } catch (err) {
    log(`❌ Error checking boundary: ${err.message}`, 'red')
    return false
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════╗', 'cyan')
  log('║  API Connection & Data Validation Checker     ║', 'cyan')
  log('╚════════════════════════════════════════════════╝', 'cyan')

  const results = {}

  results.connectivity = await testConnectivity()
  if (!results.connectivity) {
    log('\n⚠️ Backend not reachable. Cannot continue testing.', 'yellow')
    process.exit(1)
  }

  results.santriPoints = await testSantriPoints()
  results.heatmap = await testHeatmap()
  results.boundary = await testBoundary()

  // Summary
  log('\n╔════════════════════════════════════════════════╗', 'cyan')
  log('║  Test Summary                                  ║', 'cyan')
  log('╚════════════════════════════════════════════════╝', 'cyan')

  const summary = [
    ['Connectivity', results.connectivity ? '✅ PASS' : '❌ FAIL'],
    ['Santri Points API', results.santriPoints ? '✅ PASS' : '❌ FAIL'],
    ['Heatmap API', results.heatmap ? '✅ PASS' : '⚠️ NOT IMPL'],
    ['Boundary GeoJSON', results.boundary ? '✅ PASS' : '❌ FAIL'],
  ]

  console.table(summary)

  if (results.connectivity && results.santriPoints && results.boundary) {
    log('\n✅ All critical tests passed! Choropleth should work.', 'green')
  } else {
    log('\n❌ Some tests failed. Check BACKEND_FIX_NEEDED.md', 'red')
  }
}

// Run tests
runAllTests().catch((err) => {
  log(`\n❌ Fatal error: ${err.message}`, 'red')
  process.exit(1)
})
