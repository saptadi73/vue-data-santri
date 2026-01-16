<script setup>
import { ref, computed } from 'vue'
import {
  analyzeImage,
  analyzeVideo,
  analyzeMultipleImages,
  extractTextFromImage,
  analyzePesantrenFacility,
  analyzeSantriHousing,
} from '@/services/geminiService'

const analysisMode = ref('single') // 'single', 'multiple', 'video', 'ocr', 'pesantren', 'santri'
const uploadedFile = ref(null)
const uploadedFiles = ref([])
const customPrompt = ref('')
const isLoading = ref(false)
const result = ref(null)
const error = ref(null)
const previewUrl = ref(null)
const previewUrls = ref([])
const fileInputRef = ref(null)
const multipleFileInputRef = ref(null)

const modes = [
  { value: 'single', label: 'Analisis Gambar', icon: '🖼️' },
  { value: 'multiple', label: 'Multiple Gambar', icon: '🖼️🖼️' },
  { value: 'video', label: 'Analisis Video', icon: '🎬' },
  { value: 'ocr', label: 'Ekstrak Teks (OCR)', icon: '📄' },
  { value: 'pesantren', label: 'Fasilitas Pesantren', icon: '🏫' },
  { value: 'santri', label: 'Kondisi Rumah Santri', icon: '🏠' },
]

const currentMode = computed(() => modes.find((m) => m.value === analysisMode.value))

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) {
    console.log('No file selected')
    return
  }

  console.log('File selected:', file.name, file.type, file.size)
  uploadedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

const handleMultipleFilesSelect = (event) => {
  const files = Array.from(event.target.files || [])
  console.log('Files selected:', files.length)

  if (files.length > 10) {
    error.value = 'Maksimal 10 gambar'
    return
  }

  uploadedFiles.value = files
  previewUrls.value = []

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrls.value.push(e.target?.result)
    }
    reader.readAsDataURL(file)
  })
}

const handleAnalyze = async () => {
  error.value = null
  result.value = null

  try {
    isLoading.value = true

    switch (analysisMode.value) {
      case 'single':
        if (!uploadedFile.value) {
          error.value = 'Pilih gambar terlebih dahulu'
          return
        }
        result.value = await analyzeImage(uploadedFile.value, customPrompt.value)
        console.log('Result (Single):', result.value)
        break

      case 'multiple':
        if (uploadedFiles.value.length === 0) {
          error.value = 'Pilih minimal satu gambar'
          return
        }
        result.value = await analyzeMultipleImages(uploadedFiles.value, customPrompt.value)
        console.log('Result (Multiple):', result.value)
        break

      case 'video':
        if (!uploadedFile.value) {
          error.value = 'Pilih video terlebih dahulu'
          return
        }
        result.value = await analyzeVideo(uploadedFile.value, customPrompt.value)
        console.log('Result (Video):', result.value)
        break

      case 'ocr':
        if (!uploadedFile.value) {
          error.value = 'Pilih gambar terlebih dahulu'
          return
        }
        result.value = await extractTextFromImage(uploadedFile.value)
        console.log('Result (OCR):', result.value)
        break

      case 'pesantren':
        if (!uploadedFile.value) {
          error.value = 'Pilih gambar fasilitas pesantren'
          return
        }
        result.value = await analyzePesantrenFacility(uploadedFile.value)
        console.log('Result (Pesantren):', result.value)
        break

      case 'santri':
        if (!uploadedFile.value) {
          error.value = 'Pilih gambar rumah santri'
          return
        }
        result.value = await analyzeSantriHousing(uploadedFile.value)
        console.log('Result (Santri):', result.value)
        break
    }
  } catch (err) {
    console.error('Error during analysis:', err)
    error.value = err.message || 'Terjadi kesalahan saat analisis'
  } finally {
    isLoading.value = false
  }
}

const clearUpload = () => {
  uploadedFile.value = null
  uploadedFiles.value = []
  previewUrl.value = null
  previewUrls.value = []
  customPrompt.value = ''
  result.value = null
  error.value = null
}

const clearResults = () => {
  result.value = null
  error.value = null
}

const getAcceptType = () => {
  if (analysisMode.value === 'video') {
    return 'video/mp4,video/quicktime,video/x-msvideo,video/webm'
  }
  return 'image/jpeg,image/png,image/gif,image/webp,image/bmp'
}

const triggerFileInput = () => {
  console.log('Trigger file input clicked')
  fileInputRef.value?.click()
  console.log('File input element:', fileInputRef.value)
}

const triggerMultipleFileInput = () => {
  console.log('Trigger multiple file input clicked')
  multipleFileInputRef.value?.click()
  console.log('Multiple file input element:', multipleFileInputRef.value)
}
</script>

<template>
  <div class="ai-vision-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2>AI Vision Analytics - Gemini</h2>
      </div>
      <p class="subtitle">Analisa Gambar & Video menggunakan Google Gemini AI</p>
    </div>

    <!-- Mode Selection -->
    <div class="mode-selector">
      <button
        v-for="mode in modes"
        :key="mode.value"
        @click="analysisMode = mode.value"
        :class="['mode-btn', { active: analysisMode === mode.value }]"
        :title="mode.label"
      >
        <span class="mode-icon">{{ mode.icon }}</span>
        <span class="mode-label">{{ mode.label }}</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="content">
      <!-- Upload Area -->
      <div class="upload-section">
        <div class="upload-area">
          <!-- Single Image Upload -->
          <div v-if="['single', 'ocr', 'pesantren', 'santri'].includes(analysisMode)">
            <div v-if="!uploadedFile" class="upload-box" @click="triggerFileInput">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="upload-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z"
                />
              </svg>
              <p class="upload-text">Drag & drop gambar atau klik untuk upload</p>
              <p class="upload-subtext">
                {{
                  analysisMode === 'video'
                    ? 'Format: MP4, MOV, AVI, WEBM (Max 20MB)'
                    : 'Format: JPG, PNG, GIF, WEBP, BMP'
                }}
              </p>
              <input
                ref="fileInputRef"
                type="file"
                :accept="getAcceptType()"
                @change="handleFileSelect"
                class="hidden-input"
              />
            </div>
            <div v-else class="preview-container">
              <div class="preview-box">
                <img
                  v-if="analysisMode !== 'video'"
                  :src="previewUrl"
                  alt="preview"
                  class="preview-image"
                />
                <div v-else class="video-preview">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="video-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.7-.898l11.138 6.653c.759.457.759 1.338 0 1.795L6.95 19.395c-.783.5-1.7-.042-1.7-.898V5.653z"
                    />
                  </svg>
                  <p>{{ uploadedFile.name }}</p>
                </div>
              </div>
              <button @click="clearUpload" class="clear-btn">Ubah File</button>
            </div>
          </div>

          <!-- Multiple Images Upload -->
          <div v-else-if="analysisMode === 'multiple'" class="multiple-upload">
            <div
              v-if="uploadedFiles.length === 0"
              class="upload-box"
              @click="triggerMultipleFileInput"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="upload-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z"
                />
              </svg>
              <p class="upload-text">Upload hingga 10 gambar sekaligus</p>
              <p class="upload-subtext">Format: JPG, PNG, GIF, WEBP, BMP</p>
              <input
                ref="multipleFileInputRef"
                type="file"
                accept="image/*"
                multiple
                @change="handleMultipleFilesSelect"
                class="hidden-input"
              />
            </div>
            <div v-else class="preview-grid">
              <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
                <img :src="url" :alt="`preview-${index}`" class="preview-thumbnail" />
              </div>
              <button @click="clearUpload" class="clear-btn clear-all">Ubah File</button>
            </div>
          </div>

          <!-- Video Upload -->
          <div v-else-if="analysisMode === 'video'">
            <div v-if="!uploadedFile" class="upload-box" @click="triggerFileInput">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="upload-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z"
                />
              </svg>
              <p class="upload-text">Drag & drop video atau klik untuk upload</p>
              <p class="upload-subtext">Format: MP4, MOV, AVI, WEBM (Max 20MB)</p>
              <input
                ref="fileInputRef"
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                @change="handleFileSelect"
                class="hidden-input"
              />
            </div>
            <div v-else class="preview-container">
              <div class="preview-box">
                <div class="video-preview">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="video-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.7-.898l11.138 6.653c.759.457.759 1.338 0 1.795L6.95 19.395c-.783.5-1.7-.042-1.7-.898V5.653z"
                    />
                  </svg>
                  <p>{{ uploadedFile.name }}</p>
                </div>
              </div>
              <button @click="clearUpload" class="clear-btn">Ubah File</button>
            </div>
          </div>
        </div>

        <!-- Custom Prompt (except OCR) -->
        <div
          v-if="analysisMode !== 'ocr' && analysisMode !== 'pesantren' && analysisMode !== 'santri'"
          class="prompt-section"
        >
          <label class="prompt-label">Prompt Kustom (Opsional)</label>
          <textarea
            v-model="customPrompt"
            placeholder="Masukkan instruksi analisis khusus..."
            class="prompt-input"
            rows="3"
          ></textarea>
          <p class="prompt-hint">
            {{
              analysisMode === 'single'
                ? 'Contoh: Jelaskan kondisi bangunan ini secara detail'
                : 'Contoh: Bandingkan kondisi ketiga fasilitas ini'
            }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            @click="handleAnalyze"
            :disabled="
              isLoading ||
              (!uploadedFile &&
                ['single', 'video', 'ocr', 'pesantren', 'santri'].includes(analysisMode)) ||
              (uploadedFiles.length === 0 && analysisMode === 'multiple')
            "
            class="analyze-btn"
          >
            <span v-if="!isLoading">{{ currentMode?.label }} 🚀</span>
            <span v-else class="loading-text">
              <span class="spinner"></span>
              Menganalisis...
            </span>
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="error" class="error-section">
        <div class="error-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="error-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <div>
            <h3>Terjadi Kesalahan</h3>
            <p>{{ error }}</p>
          </div>
        </div>
        <button @click="clearResults" class="dismiss-btn">Tutup</button>
      </div>

      <div v-else-if="result" class="result-section">
        <div class="result-header">
          <h3>📊 Hasil Analisis</h3>
          <button @click="clearResults" class="close-icon">×</button>
        </div>

        <!-- JSON Result Display -->
        <div class="result-content">
          <div v-if="result.analysis" class="analysis-box">
            <h4>📝 Analisis:</h4>
            <p class="analysis-text">{{ result.analysis }}</p>
          </div>

          <div v-if="result.text" class="text-box">
            <h4>📄 Teks Terdeteksi (OCR):</h4>
            <p class="text-content">{{ result.text }}</p>
          </div>

          <!-- Metadata Info -->
          <div v-if="result.filename || result.model || result.prompt_used" class="metadata-box">
            <h4>ℹ️ Informasi Metadata:</h4>
            <div class="metadata-items">
              <div v-if="result.filename" class="metadata-item">
                <span class="metadata-key">📁 Filename:</span>
                <span class="metadata-value">{{ result.filename }}</span>
              </div>
              <div v-if="result.model" class="metadata-item">
                <span class="metadata-key">🤖 Model:</span>
                <span class="metadata-value">{{ result.model }}</span>
              </div>
              <div v-if="result.prompt_used" class="metadata-item">
                <span class="metadata-key">💬 Prompt:</span>
                <span class="metadata-value">{{ result.prompt_used }}</span>
              </div>
            </div>
          </div>

          <div v-if="result.details" class="details-box">
            <h4>🔍 Detail Lengkap:</h4>
            <pre class="details-json">{{ JSON.stringify(result.details, null, 2) }}</pre>
          </div>

          <div v-if="result.assessment" class="assessment-box">
            <h4>⭐ Penilaian:</h4>
            <div class="assessment-items">
              <div v-for="(value, key) in result.assessment" :key="key" class="assessment-item">
                <span class="assessment-key">{{ key }}:</span>
                <span class="assessment-value">{{ value }}</span>
              </div>
            </div>
          </div>

          <div v-if="result.timestamp" class="metadata">
            <small
              >⏰ Dianalisis pada: {{ new Date(result.timestamp).toLocaleString('id-ID') }}</small
            >
          </div>
        </div>

        <div class="result-actions">
          <button @click="clearResults" class="btn-secondary">Analisis Lagi</button>
          <button
            @click="() => copyToClipboard(JSON.stringify(result, null, 2))"
            class="btn-primary"
          >
            Copy Hasil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  alert('Hasil disalin ke clipboard')
}
</script>

<style scoped>
.ai-vision-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content .icon {
  width: 28px;
  height: 28px;
}

.header-content h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.mode-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

.mode-btn:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.mode-btn.active {
  border-color: #667eea;
  background: #eef2ff;
  color: #667eea;
}

.mode-icon {
  font-size: 20px;
}

.mode-label {
  text-align: center;
  line-height: 1.2;
}

.content {
  padding: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.upload-box:hover {
  border-color: #667eea;
  background: #eef2ff;
}

.upload-box input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #94a3b8;
}

.upload-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.upload-subtext {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-box {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #64748b;
}

.video-icon {
  width: 48px;
  height: 48px;
}

.video-preview p {
  margin: 0;
  font-size: 14px;
  word-break: break-all;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
}

.preview-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clear-btn,
.clear-all {
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.clear-btn:hover,
.clear-all:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.clear-all {
  grid-column: 1 / -1;
}

.prompt-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prompt-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.prompt-input {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s;
}

.prompt-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.prompt-hint {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.analyze-btn {
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-top: 16px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  width: 24px;
  height: 24px;
  color: #dc2626;
  flex-shrink: 0;
}

.error-content h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #991b1b;
}

.error-content p {
  margin: 0;
  font-size: 13px;
  color: #7f1d1d;
}

.dismiss-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  background: #fef2f2;
}

.result-section {
  margin-top: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.result-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.close-icon {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-icon:hover {
  color: #1e293b;
}

.result-content {
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
}

.analysis-box,
.text-box,
.details-box,
.assessment-box,
.metadata-box {
  margin-bottom: 16px;
}

.analysis-box h4,
.text-box h4,
.details-box h4,
.assessment-box h4,
.metadata-box h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.analysis-text {
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}

.text-content {
  margin: 0;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
  font-family: 'Courier New', monospace;
}

.details-json {
  margin: 0;
  padding: 12px;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  line-height: 1.4;
  font-family: 'Courier New', monospace;
}

.assessment-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assessment-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.assessment-key {
  font-weight: 600;
  color: #475569;
  font-size: 13px;
}

.assessment-value {
  color: #667eea;
  font-weight: 600;
  font-size: 13px;
}

.metadata-box {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.metadata-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.metadata-key {
  font-weight: 600;
  color: #64748b;
  font-size: 12px;
}

.metadata-value {
  color: #1e293b;
  font-size: 13px;
  word-break: break-word;
  line-height: 1.4;
}

.metadata {
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #64748b;
}

.result-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-secondary:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.hidden-input {
  display: none;
}
</style>
