<template>
  <div class="h-full flex flex-col bg-theater-dark">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-white/10 bg-theater-dark/80 backdrop-blur-xl">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios-lg flex items-center justify-center shadow-ios">
          <SparklesIcon class="w-5 h-5 text-white" />
        </div>
        <h2 class="text-2xl font-bold">Ask the AI</h2>
      </div>
      <button
        @click="$emit('close')"
        class="w-10 h-10 rounded-ios-lg bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center active:scale-95">
        <XMarkIcon class="w-5 h-5 text-gray-300" />
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="p-4 rounded-ios-xl shadow-ios"
        :class="message.role === 'user' ? 'bg-theater-primary ml-auto max-w-[80%]' : 'bg-theater-gray max-w-[90%] border border-white/10'">
        <div v-if="message.role === 'user'" class="font-semibold mb-2 text-white text-sm">You</div>
        <div v-else class="font-semibold mb-2 text-theater-primary text-sm flex items-center space-x-2">
          <SparklesIcon class="w-4 h-4" />
          <span>AI Assistant</span>
        </div>
        <div class="text-white/90 leading-relaxed" v-html="formatMessage(message.content)"></div>
        <div v-if="message.timestamp" class="mt-3 flex flex-wrap gap-2">
          <button
            @click="$emit('jump-to', message.timestamp)"
            class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-ios text-sm font-medium text-white transition-all duration-200 active:scale-95 flex items-center space-x-1">
            <ClockIcon class="w-4 h-4" />
            <span>Jump to {{ formatTime(message.timestamp) }}</span>
          </button>
          <button
            v-if="pausedAt > 0 && message.timestamp !== pausedAt"
            @click="$emit('return-to-present')"
            class="px-3 py-1.5 bg-theater-primary/20 hover:bg-theater-primary/30 rounded-ios text-sm font-medium text-theater-primary transition-all duration-200 active:scale-95 flex items-center space-x-1">
            <ArrowUturnLeftIcon class="w-4 h-4" />
            <span>Return to {{ formatTime(pausedAt) }}</span>
          </button>
        </div>
      </div>

      <!-- AI Typing Indicator -->
      <div v-if="isLoading" class="p-4 bg-theater-gray rounded-ios-xl max-w-[90%] border border-white/10 shadow-ios">
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1.5">
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-theater-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
          <span class="text-sm text-gray-400">AI is thinking...</span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-white/10 p-6 bg-theater-dark/80 backdrop-blur-xl">
      <!-- Voice Recording -->
      <div v-if="isRecording" class="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-ios-xl text-center backdrop-blur-sm">
        <div class="flex items-center justify-center space-x-3">
          <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-white font-medium">Recording... Speak now</span>
        </div>
      </div>

      <div class="flex space-x-3">
        <button
          @click="toggleRecording"
          class="w-12 h-12 rounded-ios-lg flex items-center justify-center transition-all duration-200 active:scale-95 shadow-ios"
          :class="isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-theater-primary hover:bg-theater-primary/80'">
          <MicrophoneIcon v-if="!isRecording" class="w-6 h-6 text-white" />
          <StopIcon v-else class="w-6 h-6 text-white" />
        </button>
        <input
          v-model="textInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your question or use voice..."
          class="flex-1 bg-white/5 border border-white/10 rounded-ios-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-theater-primary focus:bg-white/10 transition-all duration-200 backdrop-blur-sm" />
        <button
          @click="sendMessage"
          :disabled="!textInput.trim() && !isRecording"
          class="w-12 h-12 bg-theater-primary rounded-ios-lg flex items-center justify-center hover:bg-theater-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-ios">
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
  emits: ['close', 'jump-to', 'return-to-present'],
  data() {
    return {
      messages: [],
      textInput: '',
      isRecording: false,
      isLoading: false,
      recognition: null,
      silenceTimer: null
    }
  },
  mounted() {
    this.initSpeechRecognition()
    // Auto-start recording when panel opens
    this.startRecording()
  },
  beforeUnmount() {
    this.stopRecording()
  },
  methods: {
    initSpeechRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = 'en-US'

        this.recognition.onresult = (event) => {
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
          }

          // Reset silence timer on speech
          if (finalTranscript) {
            clearTimeout(this.silenceTimer)
            this.silenceTimer = setTimeout(() => {
              this.stopRecording()
              if (this.textInput.trim()) {
                this.sendMessage()
              }
            }, 2000) // 2 seconds of silence
          }
        }

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // Auto-stop after no speech
            this.stopRecording()
          }
        }
      }
    },
    startRecording() {
      if (this.recognition && !this.isRecording) {
        this.isRecording = true
        this.recognition.start()
      }
    },
    stopRecording() {
      if (this.recognition && this.isRecording) {
        this.isRecording = false
        this.recognition.stop()
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
    async sendMessage() {
      const question = this.textInput.trim()
      if (!question && !this.isRecording) return

      this.stopRecording()

      if (!question) return

      // Add user message
      this.messages.push({
        role: 'user',
        content: question
      })

      this.textInput = ''
      this.isLoading = true

      try {
        // Send to backend (use pausedAt for context, not currentTime which may have changed)
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question,
            timestamp: this.pausedAt,
            movieId: this.movieId
          })
        })

        const data = await response.json()

        // Add AI response
        this.messages.push({
          role: 'assistant',
          content: data.answer,
          timestamp: data.timestamp
        })
      } catch (error) {
        console.error('Error sending message:', error)
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        })
      } finally {
        this.isLoading = false
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
    }
  }
}
</script>
