"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Command, Play, ChevronDown, Brain, Globe, Shield, Layers, BarChart3, Star, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useAnalytics } from "@/hooks/use-analytics"
import { useUserSegmentation } from "@/hooks/use-user-segmentation"
import { useDynamicContentTargeting } from "@/hooks/use-dynamic-content-targeting"
import SegmentShowcase from "@/components/segment-showcase"

const Advanced3DBackground = dynamic(() => import('@/components/advanced-3d-background'), {
  ssr: false
})

const ExitIntentPopup = dynamic(() => import('@/components/exit-intent-popup'), {
  ssr: false
})

export default function HomepageContent() {
  const targetRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { trackButtonClick, trackDemoRequest, trackNewsletterSignup, trackFormSubmission } = useAnalytics()
  const { segments, userSegments, evaluateSegments, isLoading: segmentsLoading } = useUserSegmentation({
    userId: 'homepage_visitor',
    autoEvaluate: true,
    trackEvents: true
  })
  const { targetedContent, getContentForElement, trackContentView, trackContentClick } = useDynamicContentTargeting({
    userId: 'homepage_visitor',
    userSegments,
    autoTarget: true,
    trackEvents: true
  })

  const heroContent = getContentForElement('hero-section')
  const featuresContent = getContentForElement('features-section')
  const pricingContent = getContentForElement('pricing-section')

  const [locale, setLocale] = useState<'tr' | 'en'>("tr")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const translate = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      tr: {
        beUnstoppable: "Müşteri etkileşiminde durdurulamaz olun",
        onePlatform: "Tek platform, her kanal, sonsuz olanaklar. CDP · AI · Personalization · Journey · Reporting",
        explorePlatform: "Platformu Keşfet",
        watchDemo: "Demoyu İzle",
        promisesTitle: "Bizi farklı kılan üç vaad",
        beFirst: "Önce olun",
        beFocused: "Odaklı olun",
        beProgressive: "Gelişmiş olun",
        trustedBy: "2000+ müşterinin güveni",
        capabilities: "Bir platform. İhtiyacınız olan her şey.",
        cdp: "CDP",
        ai: "AI",
        personalization: "Personalization",
        journey: "Journey Orchestration",
        reporting: "Reporting",
        enterprise: "Kurumsal yetkinlikler",
        security: "Güvenlik ve Uyumluluk",
        scalability: "Ölçeklenebilirlik",
        integrations: "Entegrasyonlar",
        signIn: "Giriş Yap",
        getStarted: "Başla",
        platform: "Platform",
        intelligence: "Intelligence",
        enterpriseNav: "Enterprise"
      },
      en: {
        beUnstoppable: "Be unstoppable in customer engagement",
        onePlatform: "One platform, every channel, infinite possibilities. CDP · AI · Personalization · Journey · Reporting",
        explorePlatform: "Explore Platform",
        watchDemo: "Watch Demo",
        promisesTitle: "The three promises that set us apart",
        beFirst: "Be first",
        beFocused: "Be focused",
        beProgressive: "Be progressive",
        trustedBy: "Trusted by 2,000+ customers",
        capabilities: "One platform. Everything you need.",
        cdp: "CDP",
        ai: "AI",
        personalization: "Personalization",
        journey: "Journey Orchestration",
        reporting: "Reporting",
        enterprise: "Enterprise-grade",
        security: "Security & Compliance",
        scalability: "Scalability",
        integrations: "Integrations",
        signIn: "Sign In",
        getStarted: "Get Started",
        platform: "Platform",
        intelligence: "Intelligence",
        enterpriseNav: "Enterprise"
      }
    }
    return dict[locale][key] || key
  }
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])



  useEffect(() => {
    // Track content views
    trackContentView('hero-section', 'hero-default')
    trackContentView('features-section', 'features-default')
    trackContentView('pricing-section', 'pricing-default')
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Performance optimization: throttle scroll events
  useEffect(() => {
    let ticking = false
    
    const updateScrollProgress = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxScroll) * 100
      setScrollProgress(progress)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDemoClick = () => {
    trackDemoRequest({ source: 'homepage', cta: 'hero-cta' })
    window.location.href = '/demo'
  }

  const handleNewsletterSignup = (email: string) => {
    trackNewsletterSignup(email, 'homepage')
  }

  const handleFeatureClick = (feature: string) => {
    trackButtonClick(`feature_${feature}`, { source: 'homepage' })
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    use_case: "",
    team_size: "",
    timeline: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ')
      const lastName = lastNameParts.join(' ') || firstName

      // Track form submission attempt
      trackFormSubmission('Demo Request', {
        company: formData.company,
        team_size: formData.team_size,
        use_case: formData.use_case,
      })

      let response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          use_case: formData.use_case || 'customer_journey_optimization',
          team_size: formData.team_size || 50,
          timeline: formData.timeline || '3_months'
        })
      })
      if (!response.ok) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if (url && anon) {
          response = await fetch(`${url}/rest/v1/demo_requests`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: anon,
              Authorization: `Bearer ${anon}`,
              Prefer: 'return=representation'
            },
            body: JSON.stringify({
              name: `${firstName} ${lastName}`,
              email: formData.email,
              company: formData.company,
              phone: formData.phone,
              use_case: formData.use_case || 'customer_journey_optimization',
              team_size: formData.team_size || 50,
              timeline: formData.timeline || '3_months'
            })
          })
        }
      }

      if (!response.ok) throw new Error('Failed to submit form')

      setSubmitStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          use_case: "",
          team_size: "",
          timeline: ""
        })
        setSubmitStatus('idle')
      }, 3000)

    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" ref={targetRef}>
      {/* Mouse Follower */}
      <motion.div
        className="fixed w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
        style={{
          opacity: isHovering ? 0.8 : 0.3,
          scale: isHovering ? 1.2 : 1,
        }}
      />

      {/* Navbar */}
      <motion.nav 
        className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={"https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=logo%20unicorn%20crest%20luminous%20neon%20gradient%2C%20aurora%20borealis%2C%20glassmorphism%2C%20futuristic%20tech%20emblem%2C%20letter%20A%20integrated%20with%20unicorn%20silhouette%2C%20premium%20startup%20brand%2C%20dark%20background%2C%20high-detail%2C%20vector-styled%2C%20centered%2C%20glowing%20edges%2C%203D%20depth%2C%20cinematic%20lighting&image_size=square_hd"}
              alt="Alya Unicorn Logo"
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold tracking-tight">Alya</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <motion.a 
              href="#platform" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translate('platform')}
            </motion.a>
            <motion.a 
              href="#intelligence" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translate('intelligence')}
            </motion.a>
            <motion.a 
              href="#enterprise" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translate('enterpriseNav')}
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm">
              <option value="tr">TR</option>
              <option value="en">EN</option>
            </select>
            <Link href="/auth/login" prefetch={false} className="text-sm text-gray-300 hover:text-white">{translate('signIn')}</Link>
            <Link href="/demo" prefetch={false}>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">{translate('getStarted')}</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 w-full z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#platform" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {translate('platform')}
              </a>
              <a href="#intelligence" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {translate('intelligence')}
              </a>
              <a href="#enterprise" className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {translate('enterpriseNav')}
              </a>
              <div className="pt-4 border-t border-white/10">
                <Link href="/auth/login" prefetch={false} className="block text-gray-300 hover:text-white py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('signIn')}
                </Link>
                <Link href="/demo" prefetch={false} className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 w-full">
                    {translate('getStarted')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Advanced3DBackground />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Exit Intent Popup */}
      <ExitIntentPopup onNewsletterSignup={handleNewsletterSignup} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div 
          className="text-center max-w-6xl mx-auto z-10"
          style={{ opacity, scale, y }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Customer Engagement Platform
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {translate('beUnstoppable')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {translate('onePlatform')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/dashboard" prefetch={false}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {translate('explorePlatform')}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 group"
              onClick={() => handleFeatureClick('platform')}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {translate('watchDemo')}
            </Button>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '2,000+', label: 'Customers' },
              { value: '50M+', label: 'Users Tracked' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' }
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Customer Logos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{translate('trustedBy')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              { name: 'Microsoft', logo: 'M' },
              { name: 'Amazon', logo: 'A' },
              { name: 'Google', logo: 'G' },
              { name: 'Apple', logo: 'A' },
              { name: 'Netflix', logo: 'N' },
              { name: 'Spotify', logo: 'S' }
            ].map((brand) => (
              <motion.div
                key={brand.name}
                className="flex items-center justify-center h-16 bg-gray-800/30 rounded-lg border border-gray-700"
                whileHover={{ scale: 1.05, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-2xl font-bold text-gray-400">{brand.logo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section id="platform" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{translate('promisesTitle')}</h2>
            <p className="text-xl text-gray-300">The three promises that set us apart</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: translate('beFirst'), desc: 'Move faster with unified data and AI-powered insights that enable real-time decision making.' },
              { title: translate('beFocused'), desc: 'Stay focused on what matters with intelligent automation and predictive analytics.' },
              { title: translate('beProgressive'), desc: 'Lead the market with innovative solutions that adapt to changing customer needs.' }
            ].map((promise, index) => (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{promise.title}</h3>
                <p className="text-gray-300">{promise.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-300">See what our customers say about Alya</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "VP of Marketing",
                company: "TechCorp",
                content: "Alya's AI-powered insights helped us increase customer engagement by 340%. The platform is intuitive and the results speak for themselves.",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "Chief Digital Officer",
                company: "GlobalRetail",
                content: "The journey orchestration capabilities are game-changing. We've seen a 50% reduction in churn and significant improvement in customer lifetime value.",
                rating: 5
              },
              {
                name: "Emma Thompson",
                role: "Head of Customer Experience",
                company: "FinanceFlow",
                content: "Alya's personalization engine delivers real-time experiences that our customers love. Our conversion rates have never been higher.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-gray-300">Real success stories from our customers</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "340% Increase in Engagement",
                company: "E-commerce Giant",
                metric: "340%",
                description: "Using Alya's AI-powered personalization, this leading e-commerce platform achieved unprecedented customer engagement rates.",
                challenge: "Low customer engagement and high bounce rates",
                solution: "Implemented Alya's real-time personalization engine",
                result: "340% increase in customer engagement and 45% reduction in bounce rate"
              },
              {
                title: "50% Reduction in Churn",
                company: "SaaS Platform",
                metric: "50%",
                description: "A B2B SaaS company used Alya's predictive analytics to identify at-risk customers and reduce churn significantly.",
                challenge: "High customer churn rate affecting revenue growth",
                solution: "Deployed Alya's churn prediction and journey orchestration",
                result: "50% reduction in churn and $2M additional revenue retained"
              }
            ].map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">{study.title}</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {study.metric}
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{study.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Challenge</h4>
                    <p className="text-sm text-gray-400">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Solution</h4>
                    <p className="text-sm text-gray-400">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Result</h4>
                    <p className="text-sm text-gray-400">{study.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {featuresContent?.headline || "AI-Powered Marketing Intelligence"}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {featuresContent?.subheadline || "Leverage machine learning to predict customer behavior and optimize your marketing campaigns in real-time."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Predictive Analytics",
                description: "Forecast customer behavior and campaign performance with 94% accuracy using our advanced ML models."
              },
              {
                icon: Globe,
                title: "Real-Time Personalization",
                description: "Deliver personalized experiences to millions of customers simultaneously with our scalable AI engine."
              },
              {
                icon: Command,
                title: "Campaign Optimization",
                description: "Automatically optimize campaigns across channels to maximize ROI and minimize acquisition costs."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/20"
                onClick={() => handleFeatureClick(feature.title.toLowerCase().replace(' ', '-'))}
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="intelligence" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {translate('capabilities')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">CDP, AI, Personalization, Journey, Reporting – tek çatı altında.</p>
          </motion.div>

          {/* Demo Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gray-900/50 rounded-2xl p-8 border border-gray-700"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white">Request a Demo</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="use_case" className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Use Case
                </label>
                <select
                  id="use_case"
                  name="use_case"
                  value={formData.use_case}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select your primary use case</option>
                  <option value="customer_segmentation">Customer Segmentation</option>
                  <option value="campaign_optimization">Campaign Optimization</option>
                  <option value="predictive_analytics">Predictive Analytics</option>
                  <option value="personalization">Personalization</option>
                  <option value="lead_scoring">Lead Scoring</option>
                  <option value="churn_prediction">Churn Prediction</option>
                </select>
              </div>

              <div>
                <label htmlFor="team_size" className="block text-sm font-medium text-gray-300 mb-2">
                  Team Size
                </label>
                <select
                  id="team_size"
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              {submitStatus === 'error' && (
                <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="bg-green-900/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
                  Thank you! We'll be in touch within 24 hours to schedule your demo.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? 'Request Sent!' : 'Request Demo'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{translate('enterprise')}</h2>
            <p className="text-gray-300">SSO, RBAC, denetim logları; edge mimari ve entegrasyonlarla kurumsal seviyede.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Shield className="w-8 h-8 mb-4" />
              <div className="text-lg font-semibold mb-2">{translate('security')}</div>
              <div className="text-gray-300">SSO, RBAC, RLS ve denetim logları.</div>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Layers className="w-8 h-8 mb-4" />
              <div className="text-lg font-semibold mb-2">{translate('scalability')}</div>
              <div className="text-gray-300">Edge bölgeler ve global CDN ile düşük gecikme.</div>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <BarChart3 className="w-8 h-8 mb-4" />
              <div className="text-lg font-semibold mb-2">{translate('integrations')}</div>
              <div className="text-gray-300">API-first, webhooks ve CRM/ESP entegrasyonları.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <p className="text-gray-400">© 2024 Alya Intelligence. All rights reserved.</p>
          <form
            className="flex items-center gap-3"
            onSubmit={async (e) => {
              e.preventDefault()
              const formEl = e.target as HTMLFormElement
              const input = formEl.elements.namedItem('email') as HTMLInputElement
              const email = input.value
              if (!email) return
              let res = await fetch('/api/newsletter-subscribe', {
                method: 'POST', headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, source: 'homepage' })
              })
              if (!res.ok) {
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL
                const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                if (url && anon) {
                  res = await fetch(`${url}/rest/v1/newsletter_subscriptions`, {
                    method: 'POST',
                    headers: {
                      'content-type': 'application/json',
                      apikey: anon,
                      Authorization: `Bearer ${anon}`,
                      Prefer: 'return=representation'
                    },
                    body: JSON.stringify({ email, source: 'homepage' })
                  })
                }
              }
              input.value = ''
            }}
          >
            <input name="email" type="email" placeholder="Subscribe to newsletter" className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none" />
            <Button size="sm" variant="premium">Subscribe</Button>
          </form>
        </div>
      </footer>
    </div>
  )
}
