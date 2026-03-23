import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useEmiraStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      
      // Analysis state
      analysisResult: '',
      isStreaming: false,
      isComplete: false,
      error: null,
      activeAnalysis: null,
      lastAnalysisTime: null,
      
      setAnalysisResult: (result) => set({ analysisResult: result }),
      appendAnalysisResult: (token) => set((state) => ({ analysisResult: state.analysisResult + token })),
      setIsStreaming: (isStreaming) => set({ isStreaming }),
      setIsComplete: (isComplete) => set({ isComplete }),
      setError: (error) => set({ error }),
      setActiveAnalysis: (activeAnalysis) => set({ activeAnalysis }),
      setLastAnalysisTime: (lastAnalysisTime) => set({ lastAnalysisTime }),
      resetAnalysis: () => set({ 
        analysisResult: '', 
        isStreaming: false, 
        isComplete: false, 
        error: null, 
        activeAnalysis: null 
      }),
    }),
    {
      name: 'emira-auth-storage',
      // We only want to persist the auth state, not the transient analysis state
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
)
