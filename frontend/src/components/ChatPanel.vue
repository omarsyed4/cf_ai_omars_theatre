<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-theater-dark via-theater-gray/30 to-theater-dark">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-theater-dark/90 via-theater-gray/40 to-theater-dark/90 backdrop-blur-xl">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios-lg flex items-center justify-center shadow-ios">
          <SparklesIcon class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-white">Ask the AI</h2>
      </div>
      <button
        @click="$emit('close')"
        class="w-10 h-10 rounded-ios-lg bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95 border border-white/10">
        <XMarkIcon class="w-5 h-5 text-gray-300" />
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="p-4 rounded-ios-xl shadow-ios border"
        :class="message.role === 'user' 
          ? 'bg-gradient-to-br from-theater-primary to-theater-secondary ml-auto max-w-[80%] border-theater-primary/30' 
          : 'bg-gradient-to-br from-theater-gray/80 to-theater-gray/60 max-w-[90%] border-white/10'">
        <div v-if="message.role === 'user'" class="font-semibold mb-2 text-white text-sm">You</div>
        <div v-else class="font-semibold mb-2 text-theater-primary text-sm flex items-center space-x-2">
          <SparklesIcon class="w-4 h-4" />
          <span>AI Assistant</span>
        </div>
        <div class="text-white/90 leading-relaxed" v-html="formatMessage(message.content)"></div>
        <div v-if="message.timestamp" class="mt-3 flex flex-wrap gap-2">
          <button
            @click="$emit('jump-to', message.timestamp)"
            class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-ios text-sm font-medium text-white transition-all duration-200 active:scale-95 flex items-center space-x-1 border border-white/10">
            <ClockIcon class="w-4 h-4" />
            <span>Jump to {{ formatTime(message.timestamp) }}</span>
          </button>
          <button
            v-if="pausedAt > 0 && message.timestamp !== pausedAt"
            @click="$emit('return-to-present')"
            class="px-3 py-1.5 bg-theater-primary/20 hover:bg-theater-primary/30 rounded-ios text-sm font-medium text-theater-primary transition-all duration-200 active:scale-95 flex items-center space-x-1 border border-theater-primary/20">
            <ArrowUturnLeftIcon class="w-4 h-4" />
            <span>Return to {{ formatTime(pausedAt) }}</span>
          </button>
        </div>
      </div>

      <!-- AI Typing Indicator -->
      <div v-if="isLoading" class="p-4 bg-gradient-to-br from-theater-gray/80 to-theater-gray/60 rounded-ios-xl max-w-[90%] border border-white/10 shadow-ios">
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1.5">
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
          <span class="text-sm text-gray-400">AI is thinking...</span>
        </div>
      </div>

      <!-- Follow-up hint -->
      <div v-if="!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isRecording" 
        class="p-3 bg-white/5 border border-white/10 rounded-ios-lg max-w-[90%] text-center">
        <span class="text-xs text-gray-400">Press <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">Enter</kbd> to ask a follow-up, or <kbd class="px-2 py-1 bg-white/10 rounded text-white font-mono">Space</kbd> to resume</span>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-white/10 p-6 bg-gradient-to-r from-theater-dark/90 via-theater-gray/40 to-theater-dark/90 backdrop-blur-xl">
      <!-- Voice Recording -->
      <div v-if="isRecording" class="mb-4 p-4 bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 rounded-ios-xl text-center backdrop-blur-sm">
        <div class="flex items-center justify-center space-x-3">
          <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-white font-medium">Recording... Speak now</span>
        </div>
      </div>

      <div class="flex space-x-3">
        <button
          @click="toggleRecording"
          class="w-12 h-12 rounded-ios-lg flex items-center justify-center transition-all duration-200 active:scale-95 shadow-ios border"
          :class="isRecording 
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-500/30' 
            : 'bg-gradient-to-br from-theater-primary to-theater-primary/80 hover:from-theater-primary/90 hover:to-theater-primary border-theater-primary/30'">
          <MicrophoneIcon v-if="!isRecording" class="w-6 h-6 text-white" />
          <StopIcon v-else class="w-6 h-6 text-white" />
        </button>
        <input
          ref="textInputRef"
          v-model="textInput"
          @keydown.enter="handleEnterKey"
          type="text"
          placeholder="Type your question or use voice..."
          class="flex-1 bg-white/5 border border-white/10 rounded-ios-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-theater-primary focus:bg-white/10 transition-all duration-200 backdrop-blur-sm" />
        <button
          @click="sendMessage"
          :disabled="!textInput.trim() && !isRecording"
          class="w-12 h-12 bg-gradient-to-br from-theater-primary to-theater-primary/80 rounded-ios-lg flex items-center justify-center hover:from-theater-primary/90 hover:to-theater-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-ios border border-theater-primary/30">
          <PaperAirplaneIcon class="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  SparklesIcon, 
  XMarkIcon, 
  ClockIcon, 
  ArrowUturnLeftIcon,
  MicrophoneIcon,
  StopIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/solid'
import { getApiBase } from '../config/api.js'

export default {
  name: 'ChatPanel',
  components: {
    SparklesIcon,
    XMarkIcon,
    ClockIcon,
    ArrowUturnLeftIcon,
    MicrophoneIcon,
    StopIcon,
    PaperAirplaneIcon
  },
  props: {
    currentTime: {
      type: Number,
      required: true
    },
    pausedAt: {
      type: Number,
      required: true
    },
    movieId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'jump-to', 'return-to-present', 'ask-follow-up'],
  data() {
    return {
      messages: [],
      textInput: '',
      isRecording: false,
      isLoading: false,
      recognition: null,
      silenceTimer: null,
      lastAIMessageIndex: -1
    }
  },
  mounted() {
    console.log('[ChatPanel] Component mounted')
    this.initSpeechRecognition()
    // Load chat history from sessionStorage (clears when tab closes)
    this.loadChatHistory()
    // Auto-start recording when panel opens
    this.$nextTick(() => {
      console.log('[ChatPanel] Auto-starting recording, messages count:', this.messages.length)
      this.startRecording()
    })
    // Add global Enter key listener for follow-up questions
    window.addEventListener('keydown', this.handleGlobalEnterKey)
  },
  beforeUnmount() {
    this.stopRecording()
    // Save chat history to sessionStorage (clears when tab closes)
    this.saveChatHistory()
    // Remove global Enter key listener
    window.removeEventListener('keydown', this.handleGlobalEnterKey)
  },
  watch: {
    messages: {
      handler(newMessages) {
        // Track when AI responds
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          this.lastAIMessageIndex = newMessages.length - 1
        }
        // Save chat history whenever messages change
        this.saveChatHistory()
      },
      deep: true
    },
    isLoading(newVal) {
      // When AI finishes responding, don't auto-focus (user can press Enter anywhere to start mic)
      if (!newVal && this.lastAIMessageIndex >= 0) {
        console.log('[ChatPanel] AI finished, waiting for user to press Enter for follow-up')
      }
    },
    movieId() {
      // Reload chat history when movie changes
      console.log('[ChatPanel] Movie ID changed to:', this.movieId)
      this.loadChatHistory()
      // Restart mic when movie changes
      this.$nextTick(() => {
        this.startRecording()
      })
    }
  },
  methods: {
    initSpeechRecognition() {
      console.log('[ChatPanel] Initializing speech recognition')
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'en-US'

        this.recognition.onstart = () => {
          console.log('[ChatPanel] Speech recognition started')
        }

        this.recognition.onend = () => {
          console.log('[ChatPanel] Speech recognition ended')
        }

        this.recognition.onresult = (event) => {
          console.log('[ChatPanel] Speech recognition result:', event)
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }

          if (interimTranscript) {
            this.textInput = finalTranscript + interimTranscript
            console.log('[ChatPanel] Interim transcript:', interimTranscript)
          }

          // Reset silence timer on speech
          if (finalTranscript) {
            console.log('[ChatPanel] Final transcript:', finalTranscript)
            clearTimeout(this.silenceTimer)
            this.silenceTimer = setTimeout(() => {
              this.stopRecording()
              if (this.textInput.trim()) {
                console.log('[ChatPanel] Auto-sending message after silence')
                this.sendMessage()
              }
            }, 2000) // 2 seconds of silence
          }
        }

        this.recognition.onerror = (event) => {
          console.error('[ChatPanel] Speech recognition error:', event.error, event)
          if (event.error === 'no-speech') {
            // Auto-stop after no speech
            this.stopRecording()
          }
        }
      } else {
        console.warn('[ChatPanel] Speech recognition not supported in this browser')
      }
    },
    startRecording() {
      console.log('[ChatPanel] startRecording called, recognition:', !!this.recognition, 'isRecording:', this.isRecording)
      if (!this.recognition) {
        console.warn('[ChatPanel] Cannot start recording - recognition not initialized')
        return
      }
      
      // Check if already recording
      if (this.isRecording) {
        console.log('[ChatPanel] Already recording, skipping start')
        return
      }
      
      try {
        // Stop any existing recognition first to avoid "already started" error
        try {
          this.recognition.stop()
        } catch (stopError) {
          // Ignore errors from stopping (might not be running)
          console.log('[ChatPanel] No existing recognition to stop')
        }
        
        // Small delay to ensure previous recognition is fully stopped
        setTimeout(() => {
          try {
            this.isRecording = true
            this.recognition.start()
            console.log('[ChatPanel] Recording started successfully')
          } catch (startError) {
            console.error('[ChatPanel] Error starting recording after delay:', startError)
            this.isRecording = false
          }
        }, 100)
      } catch (error) {
        console.error('[ChatPanel] Error in startRecording:', error)
        this.isRecording = false
      }
    },
    stopRecording() {
      console.log('[ChatPanel] stopRecording called')
      if (this.recognition && this.isRecording) {
        this.isRecording = false
        try {
          this.recognition.stop()
          console.log('[ChatPanel] Recording stopped successfully')
        } catch (error) {
          console.error('[ChatPanel] Error stopping recording:', error)
        }
        clearTimeout(this.silenceTimer)
      }
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    },
    handleGlobalEnterKey(e) {
      // Only handle Enter when panel is visible and not typing in input/textarea
      if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        // If AI just responded and not loading, start recording for follow-up
        if (!this.isLoading && this.lastAIMessageIndex >= 0 && this.messages[this.lastAIMessageIndex].role === 'assistant') {
          e.preventDefault()
          if (!this.isRecording && !this.textInput.trim()) {
            console.log('[ChatPanel] Global Enter key pressed - starting mic for follow-up')
            this.startRecording()
            this.$emit('ask-follow-up')
          }
        }
      }
    },
    handleEnterKey(e) {
      // If there's text, send it
      if (this.textInput.trim()) {
        e.preventDefault()
        this.sendMessage()
        return
      }

      // If no text and AI just responded, start recording for follow-up
      if (!this.isLoading && this.lastAIMessageIndex >= 0 && this.messages[this.lastAIMessageIndex].role === 'assistant') {
        e.preventDefault()
        if (!this.isRecording) {
          console.log('[ChatPanel] Enter key pressed in input - starting mic for follow-up')
          this.startRecording()
          this.$emit('ask-follow-up')
        }
      }
    },
    async sendMessage() {
      const question = this.textInput.trim()
      console.log('[ChatPanel] sendMessage called, question:', question, 'isRecording:', this.isRecording)
      
      if (!question && !this.isRecording) {
        console.warn('[ChatPanel] No question to send and not recording')
        return
      }

      this.stopRecording()

      if (!question) {
        console.warn('[ChatPanel] No question text to send')
        return
      }

      // Add user message
      this.messages.push({
        role: 'user',
        content: question
      })

      this.textInput = ''
      this.isLoading = true

      const requestBody = {
        question,
        timestamp: this.pausedAt,
        movieId: this.movieId
      }
      
      console.log('[ChatPanel] Sending request to /api/query:', requestBody)
      console.log('[ChatPanel] Current hostname:', window.location.hostname)
      console.log('[ChatPanel] Current origin:', window.location.origin)

      try {
        const apiBase = getApiBase(); // Evaluate at runtime
        const apiUrl = `${apiBase}/api/query`
        console.log('[ChatPanel] API_BASE value:', apiBase)
        console.log('[ChatPanel] Constructed API URL:', apiUrl)
        console.log('[ChatPanel] Making fetch request to:', apiUrl)
        
        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
          console.error('[ChatPanel] Request timeout after 30 seconds')
        }, 30000) // 30 second timeout
        
        // Send to backend (use pausedAt for context, not currentTime which may have changed)
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }).catch(fetchError => {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            console.error('[ChatPanel] Request was aborted (timeout)')
            throw new Error('Request timeout - the server took too long to respond')
          }
          console.error('[ChatPanel] Fetch error (network/connection):', fetchError)
          throw fetchError
        })
        
        clearTimeout(timeoutId)

        console.log('[ChatPanel] Response received, status:', response.status, response.statusText)
        console.log('[ChatPanel] Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('[ChatPanel] Response not OK:', response.status, errorText)
          console.error('[ChatPanel] Response URL:', response.url)
          console.error('[ChatPanel] Response type:', response.type)
          
          // Show user-friendly error message
          let errorMessage = 'Sorry, I encountered an error. Please try again.'
          if (response.status === 500) {
            errorMessage = 'The server encountered an error. Please check if the backend is running and try again.'
          } else if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please check the backend configuration.'
          }
          
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText || 'No error message'}`)
        }

        const responseText = await response.text()
        console.log('[ChatPanel] Response text:', responseText)
        
        let data
        try {
          data = JSON.parse(responseText)
          console.log('[ChatPanel] Parsed response data:', data)
        } catch (parseError) {
          console.error('[ChatPanel] Failed to parse JSON response:', parseError, 'Response text:', responseText)
          throw new Error(`Invalid JSON response: ${responseText}`)
        }

        // Add AI response
        this.messages.push({
          role: 'assistant',
          content: data.answer,
          timestamp: data.timestamp
        })
        
        console.log('[ChatPanel] AI response added to messages')
      } catch (error) {
        console.error('[ChatPanel] Error sending message:', error)
        // Show user-friendly error message
        let errorMessage = 'Sorry, I encountered an error. Please try again.'
        if (error.message.includes('500')) {
          errorMessage = 'The server encountered an error. Please check if the backend is running on port 8787 and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The request took too long. Please try again.'
        } else if (error.message.includes('404')) {
          errorMessage = 'API endpoint not found. Please check the backend configuration.'
        }
        
        this.messages.push({
          role: 'assistant',
          content: errorMessage
        })
      } finally {
        this.isLoading = false
        console.log('[ChatPanel] sendMessage completed, isLoading:', this.isLoading)
      }
    },
    formatMessage(content) {
      // Simple formatting - could be enhanced
      return content.replace(/\n/g, '<br>')
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    loadChatHistory() {
      try {
        // Use sessionStorage instead of localStorage - clears when tab closes
        const historyKey = `chat_history_${this.movieId}`
        const savedHistory = sessionStorage.getItem(historyKey)
        if (savedHistory) {
          this.messages = JSON.parse(savedHistory)
          // Find last AI message index
          for (let i = this.messages.length - 1; i >= 0; i--) {
            if (this.messages[i].role === 'assistant') {
              this.lastAIMessageIndex = i
              break
            }
          }
          console.log('[ChatPanel] Loaded chat history from session:', this.messages.length, 'messages')
        } else {
          console.log('[ChatPanel] No previous chat history found for this session')
        }
      } catch (error) {
        console.error('[ChatPanel] Error loading chat history:', error)
      }
    },
    saveChatHistory() {
      try {
        // Use sessionStorage instead of localStorage - clears when tab closes
        const historyKey = `chat_history_${this.movieId}`
        sessionStorage.setItem(historyKey, JSON.stringify(this.messages))
        console.log('[ChatPanel] Saved chat history to session:', this.messages.length, 'messages')
      } catch (error) {
        console.error('[ChatPanel] Error saving chat history:', error)
      }
    }
  }
}
</script>
