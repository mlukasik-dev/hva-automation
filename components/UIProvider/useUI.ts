import { useContext } from 'react'
import { uiContext } from './UIProvider'

export function useUI() {
  const context = useContext(uiContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
