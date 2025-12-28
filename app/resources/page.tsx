"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play, Download, Calendar, Book, Video, FileText, Users, Sparkles, Star } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const featuredContent = {
    title: "The Complete Guide to Customer Engagement in 2024",
    description: "Learn how leading enterprises are transforming customer relationships with AI-powered personalization and omnichannel strategies.",
    type: "Guide",
    duration: "45 min read",
    image: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20guide%20cover%20modern%20minimalist%20design%2C%20customer%20engagement%20theme%2C%20purple%20and%20blue%20gradient%2C%20clean%20typography%2C%20premium%20corporate%20style%2C%20high-quality%20visual%2C%20centered%20composition&image_size=landscape_4_3"
  }

  const resources = [
    {
      category: "Guides",
      icon: Book,
      items: [
        {
          title: "AI-Powered Personalization Strategy",
          description: "Complete framework for implementing AI-driven personalization at enterprise scale.",
          type: "Guide",
          duration: "30 min read",
          featured: true
        },
        {
          title: "Customer Data Platform Implementation",
          description: "Step-by-step guide to deploying a CDP for unified customer experiences.",
          type: "Guide",
          duration: "25 min read"
        },
        {
          title: "Omnichannel Journey Orchestration",
          description: "Best practices for designing seamless customer journeys across all touchpoints.",
          type: "Guide",
          duration: "35 min read"
        }
      ]
    },
    {
      category: "Webinars",
      icon: Video,
      items: [
        {
          title: "The Future of Customer Engagement",
          description: "Industry experts discuss emerging trends and technologies shaping customer engagement.",
          type: "Webinar",
          duration: "60 min",
          featured: true
        },
        {
          title: "AI in Marketing: Beyond the Hype",
          description: "Practical applications of AI in marketing and customer experience initiatives.",
          type: "Webinar",
          duration: "45 min"
        },
        {
          title: "Enterprise Personalization at Scale",
          description: "How leading brands deliver personalized experiences to millions of customers.",
          type: "Webinar",
          duration: "50 min"
        }
      ]
    },
    {
      category: "Case Studies",
      icon: FileText,
      items: [
        {
          title: "TechCorp: 40% Increase in Retention",
          description: "How TechCorp transformed customer retention with AI-powered personalization.",
          type: "Case Study",
          duration: "15 min read",
          featured: true
        },
        {
          title: "FashionForward: 2.5x Revenue Growth",
          description: "E-commerce personalization strategy that drove significant revenue growth.",
          type: "Case Study",
          duration: "12 min read"
        },
        {
          title: "FinanceFirst: 60% CAC Reduction",
          description: "Predictive analytics implementation that optimized marketing spend.",
          type: "Case Study",
          duration: "18 min read"
        }
      ]
    },
    {
      category: "Documentation",
      icon: FileText,
      items: [
        {
          title: "API Reference",
          description: "Complete API documentation for developers integrating with Alya platform.",
          type: "Documentation",
          duration: "Reference"
        },
        {
          title: "Implementation Guide",
          description: "Technical guide for implementing Alya in your existing tech stack.",
          type: "Documentation",
          duration: "Guide"
        },
        {
          title: "Best Practices",
          description: "Industry best practices for maximizing ROI with customer engagement platforms.",
          type: "Documentation",
          duration: "Guide"
        }
      ]
    }
  ]

  const upcomingWebinars = [
    {
      title: "Customer Engagement Trends 2025",
      date: "January 15, 2025",
      time: "2:00 PM EST",
      speakers: ["Dr. Emily Chen", "Michael Rodriguez"],
      description: "Explore the latest trends and technologies shaping customer engagement in 2025."
    },
    {
      title: "AI Ethics in Customer Experience",
      date: "January 22, 2025",
      time: "11:00 AM EST",
      speakers: ["Sarah Thompson", "David Kim"],
      description: "Discuss ethical considerations when implementing AI in customer experience initiatives."
    },
    {
      title: "Enterprise Personalization Strategies",
      date: "January 29, 2025",
      time: "3:00 PM EST",
      speakers: ["Jennifer Liu", "Robert Martinez"],
      description: "Learn how to implement personalization strategies that scale across enterprise organizations."
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Resources & Insights</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                Master Customer
              </span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Engagement
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Access comprehensive guides, webinars, case studies, and documentation to accelerate your customer engagement strategy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="#featured">
                <Button variant="premium" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Book className="w-5 h-5 mr-2" />
                  Explore Resources
                </Button>
              </Link>
              <Link href="#webinars">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Webinars
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content */}
      <section id="featured" className="py-32 px-6 bg-[#030305]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center">
              Featured Content
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center">
              Start with our most popular and comprehensive resources.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Most Popular</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white">{featuredContent.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{featuredContent.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{featuredContent.type}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{featuredContent.duration}</span>
                </div>
                <Button variant="premium" size="lg" className="rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Read Now
                </Button>
              </div>
              <div className="relative">
                <img
                  src={featuredContent.image}
                  alt={featuredContent.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-20">
            {resources.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">{category.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIndex * 0.05, duration: 0.4 }}
                      className="group"
                    >
                      <div className={`p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 ${item.featured ? 'ring-2 ring-primary/20' : ''}`}>
                        {item.featured && (
                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                            <Star className="w-3 h-3" />
                            Featured
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section id="webinars" className="py-32 px-6 bg-[#030305]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Upcoming Webinars
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join industry experts and learn from customer engagement leaders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWebinars.map((webinar, index) => (
              <motion.div
                key={webinar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{webinar.date} at {webinar.time}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{webinar.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{webinar.description}</p>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Speakers:</div>
                    <div className="flex flex-wrap gap-2">
                      {webinar.speakers.map((speaker) => (
                        <span key={speaker} className="px-2 py-1 rounded-full bg-white/5 text-xs text-muted-foreground">
                          {speaker}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/webinars">
              <Button variant="premium" size="lg" className="rounded-full">
                View All Webinars
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
              Ready to Transform Your
              <br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Customer Engagement?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Get started with Alya and join 2000+ enterprises building lasting customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/demo">
                <Button variant="premium" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Request Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Users className="w-5 h-5 mr-2" />
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