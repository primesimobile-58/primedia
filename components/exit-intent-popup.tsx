"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Sparkles, Gift, ArrowRight } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'

interface ExitIntentPopupProps {
  onNewsletterSignup?: (email: string) => void;
}

export default function ExitIntentPopup({ onNewsletterSignup }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { trackNewsletterSignup, trackEvent } = useAnalytics()

  useEffect(() => {
    let exitIntentTriggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from the top of the page (exit intent)
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true
        setIsVisible(true)
        
        // Track exit intent trigger
        trackEvent('Exit Intent Triggered', { trigger: 'mouse_leave' })
        
        // Set a cookie to prevent showing again in this session
        sessionStorage.setItem('exitIntentShown', 'true')
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show on Escape key if not already shown
      if (e.key === 'Escape' && !sessionStorage.getItem('exitIntentShown')) {
        setIsVisible(true)
        sessionStorage.setItem('exitIntentShown', 'true')
        
        // Track exit intent trigger
        trackEvent('Exit Intent Triggered', { trigger: 'escape_key' })
      }
    }

    // Check if already shown in this session
    if (!sessionStorage.getItem('exitIntentShown')) {
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSubmitStatus('error')
      setErrorMessage('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      // Track newsletter signup attempt
      trackEvent('Newsletter Signup Attempt', { source: 'exit_intent_popup' })

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'exit_intent_popup'
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setEmail('')
        
        // Track successful newsletter signup
        trackNewsletterSignup(email, 'exit_intent_popup')
        
        // Call the callback if provided
        if (onNewsletterSignup) {
          onNewsletterSignup(email)
        }
        
        // Hide popup after 3 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to subscribe')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePopup = () => {
    setIsVisible(false)
    // Track popup dismissal
    trackEvent('Exit Intent Popup Dismissed', { source: 'close_button' })
    // Set a longer-term cookie to prevent showing for 7 days
    localStorage.setItem('exitIntentDismissed', new Date().toISOString())
  }

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('exitIntentDismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      if (dismissedDate > sevenDaysAgo) {
        return // Don't show if dismissed within 7 days
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Popup Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-white/60 group-hover:text-white" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Wait! Don't Miss Out
              </h2>
              <p className="text-muted-foreground">
                Get exclusive insights on customer engagement before you go
              </p>
            </div>

            {/* Value Proposition */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-white">AI-powered personalization strategies</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-white">Industry benchmarks and case studies</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-white">Monthly product updates and tips</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="exit-email" className="text-white text-sm mb-2 block">
                  Business Email Address
                </Label>
                <Input
                  id="exit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  required
                  disabled={isSubmitting || submitStatus === 'success'}
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center text-sm"
                >
                  ✅ Success! Check your email for exclusive content.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm"
                >
                  ❌ {errorMessage}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="premium"
                className="w-full rounded-lg"
                disabled={isSubmitting || submitStatus === 'success'}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Subscribing...
                  </>
                ) : submitStatus === 'success' ? (
                  "✓ Subscribed!"
                ) : (
                  <>
                    Get Free Access
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
