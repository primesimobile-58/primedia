"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play, Star, TrendingUp, Users, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function StoriesPage() {
  const stories = [
    {
      company: "TechCorp Global",
      industry: "Enterprise Software",
      logo: "TC",
      title: "40% Increase in Customer Retention",
      description: "TechCorp transformed their customer engagement strategy with Alya's AI-powered personalization, resulting in unprecedented retention rates.",
      challenge: "TechCorp struggled with fragmented customer data across multiple systems and generic marketing campaigns that failed to resonate with their enterprise clients.",
      solution: "Implemented Alya's CDP to unify customer data and deployed AI-driven personalization across email, web, and mobile channels.",
      results: [
        { metric: "40%", label: "Increase in customer retention" },
        { metric: "3x", label: "Higher email engagement rates" },
        { metric: "25%", label: "Reduction in churn rate" },
        { metric: "60%", label: "Faster campaign deployment" }
      ],
      testimonial: {
        text: "Alya transformed how we engage with our customers. The AI insights and personalization capabilities are game-changing for enterprise software.",
        author: "Sarah Johnson",
        title: "VP of Marketing"
      },
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      company: "FashionForward",
      industry: "E-commerce",
      logo: "FF",
      title: "2.5x Revenue Growth Through Personalization",
      description: "FashionForward scaled personalized shopping experiences to millions of customers, driving significant revenue growth.",
      challenge: "Generic product recommendations and one-size-fits-all marketing campaigns were limiting customer engagement and conversion rates.",
      solution: "Deployed Alya's personalization engine across their e-commerce platform with real-time product recommendations and dynamic content.",
      results: [
        { metric: "2.5x", label: "Revenue growth" },
        { metric: "35%", label: "Increase in conversion rate" },
        { metric: "50%", label: "Higher average order value" },
        { metric: "45%", label: "Improvement in customer satisfaction" }
      ],
      testimonial: {
        text: "The personalization capabilities exceeded our expectations. Our customers now receive truly relevant experiences that drive loyalty and sales.",
        author: "Michael Chen",
        title: "Chief Digital Officer"
      },
      gradient: "from-pink-500 to-purple-500"
    },
    {
      company: "FinanceFirst",
      industry: "Financial Services",
      logo: "FI",
      title: "60% Reduction in Customer Acquisition Cost",
      description: "FinanceFirst optimized their marketing spend and improved targeting precision with Alya's predictive analytics.",
      challenge: "High customer acquisition costs and difficulty identifying high-value prospects in a competitive financial services market.",
      solution: "Implemented Alya's predictive analytics and customer scoring to optimize marketing campaigns and focus on high-value segments.",
      results: [
        { metric: "60%", label: "Reduction in CAC" },
        { metric: "80%", label: "Improvement in lead quality" },
        { metric: "2x", label: "Higher conversion rates" },
        { metric: "30%", label: "Increase in customer lifetime value" }
      ],
      testimonial: {
        text: "Alya's predictive capabilities gave us the competitive edge we needed. We're now targeting the right customers with the right message at the right time.",
        author: "David Rodriguez",
        title: "Head of Growth Marketing"
      },
      gradient: "from-green-500 to-teal-500"
    }
  ]

  const metrics = [
    { icon: Users, value: "2000+", label: "Enterprise Customers" },
    { icon: TrendingUp, value: "3.2x", label: "Average ROI" },
    { icon: Target, value: "95%", label: "Customer Satisfaction" },
    { icon: Zap, value: "24h", label: "Time to First Value" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                Customer Success
              </span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              See how 2000+ enterprises are transforming their customer engagement with Alya's AI-powered platform.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-32 px-6 bg-[#030305]">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-32">
            {stories.map((story, index) => (
              <motion.div
                key={story.company}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Story Content */}
                  <div className="space-y-8">
                    {/* Company Header */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center text-2xl font-bold text-white`}>
                        {story.logo}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{story.company}</h3>
                        <p className="text-muted-foreground">{story.industry}</p>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {story.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {story.results.map((result, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="text-2xl font-bold text-primary mb-1">{result.metric}</div>
                          <div className="text-sm text-muted-foreground">{result.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-white mb-4 italic">
                        "{story.testimonial.text}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-white">{story.testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{story.testimonial.title}</div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className="relative">
                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-8">
                      <div className="h-full flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Challenge</span>
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">{story.challenge}</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Solution</span>
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">{story.solution}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to Write Your
              <br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Success Story?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Join 2000+ enterprises that have transformed their customer engagement with Alya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/demo">
                <Button variant="premium" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}