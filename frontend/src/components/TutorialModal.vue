<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div class="bg-theater-dark rounded-ios-xl p-8 max-w-2xl w-full border border-white/10 shadow-ios-xl transform transition-all">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-14 h-14 bg-gradient-to-br from-theater-primary to-theater-secondary rounded-ios-xl flex items-center justify-center shadow-ios-lg">
          <SparklesIcon class="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 class="text-3xl font-bold text-white">Welcome to Omars Theater! 🎬</h2>
          <p class="text-gray-400 mt-1">Your AI-powered movie companion</p>
        </div>
      </div>
      
      <div class="space-y-4 text-lg text-gray-200">
        <div class="flex items-start space-x-4 p-4 bg-white/5 rounded-ios-lg border border-white/10">
          <div class="w-8 h-8 bg-theater-primary/20 rounded-ios flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-theater-primary font-bold">1</span>
          </div>
          <div>
            <p class="font-semibold text-white mb-1">Press Spacebar to Pause</p>
            <p class="text-sm text-gray-400">Press <kbd class="bg-white/10 px-2 py-1 rounded-ios text-sm font-mono">Spacebar</kbd> to pause the movie and open the AI chat panel.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-4 bg-white/5 rounded-ios-lg border border-white/10">
          <div class="w-8 h-8 bg-theater-primary/20 rounded-ios flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-theater-primary font-bold">2</span>
          </div>
          <div>
            <p class="font-semibold text-white mb-1">Ask Questions with Voice</p>
            <p class="text-sm text-gray-400">Your voice will be automatically recorded when you speak. The AI will transcribe and answer your questions.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-4 bg-white/5 rounded-ios-lg border border-white/10">
          <div class="w-8 h-8 bg-theater-primary/20 rounded-ios flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-theater-primary font-bold">3</span>
          </div>
          <div>
            <p class="font-semibold text-white mb-1">Spoiler-Free Explanations</p>
            <p class="text-sm text-gray-400">The AI will explain characters, scenes, and events <strong>only up to the point you paused</strong> - no spoilers!</p>
          </div>
        </div>

        <div class="flex items-start space-x-4 p-4 bg-white/5 rounded-ios-lg border border-white/10">
          <div class="w-8 h-8 bg-theater-primary/20 rounded-ios flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-theater-primary font-bold">4</span>
          </div>
          <div>
            <p class="font-semibold text-white mb-1">Jump to Timestamps</p>
            <p class="text-sm text-gray-400">Click timestamp links to jump back to earlier moments, or use "Return to Present" to resume where you left off.</p>
          </div>
        </div>
      </div>

      <button
        @click="$emit('close')"
        class="mt-8 w-full bg-theater-primary text-white px-8 py-4 rounded-ios-xl font-semibold hover:bg-theater-primary/80 transition-all duration-200 shadow-ios-lg hover:shadow-ios-xl active:scale-95 flex items-center justify-center space-x-2">
        <span>Get Started</span>
        <ArrowRightIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script>
import { SparklesIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'TutorialModal',
  components: {
    SparklesIcon,
    ArrowRightIcon
  },
  emits: ['close']
}
</script>

<style scoped>
kbd {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
}
</style>
