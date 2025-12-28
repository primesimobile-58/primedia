"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Check, Play, Sparkles, Brain, Target, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Customer Intelligence",
      description: "Leverage advanced machine learning to predict customer behavior, personalize experiences, and optimize campaigns in real-time.",
      capabilities: [
        "Predictive Customer Scoring",
        "Churn Prediction & Prevention",
        "Next Best Action Recommendations",
        "Lifetime Value Optimization",
        "Automated Segment Discovery"
      ]
    },
    {
      icon: Target,
      title: "Omnichannel Journey Orchestration",
      description: "Design and execute seamless customer journeys across all touchpoints with our visual journey builder.",
      capabilities: [
        "Visual Journey Designer",
        "Real-time Trigger Campaigns",
        "Cross-channel Consistency",
        "Behavior-based Automation",
        "A/B/n Testing at Scale"
      ]
    },
    {
      icon: Zap,
      title: "Real-time Personalization Engine",
      description: "Deliver 1:1 personalized experiences at scale with our enterprise-grade personalization platform.",
      capabilities: [
        "Dynamic Content Generation",
        "Product Recommendations",
        "Website Personalization",
        "Email Personalization",
        "Mobile App Personalization"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security & Compliance",
      description: "Bank-grade security and compliance for enterprise requirements including GDPR, CCPA, and SOC 2 Type II.",
      capabilities: [
        "SOC 2 Type II Certified",
        "GDPR & CCPA Compliant",
        "Data Encryption at Rest",
        "Role-based Access Control",
        "Audit Logging & Monitoring"
      ]
    }
  ]

  const integrations = [
    { name: "Salesforce", category: "CRM" },
    { name: "HubSpot", category: "CRM" },
    { name: "Shopify", category: "E-commerce" },
    { name: "Magento", category: "E-commerce" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Facebook Ads", category: "Advertising" },
    { name: "Google Ads", category: "Advertising" },
    { name: "Slack", category: "Communication" },
    { name: "Segment", category: "CDP" },
    { name: "Snowflake", category: "Data Warehouse" },
    { name: "AWS", category: "Cloud" },
    { name: "Azure", category: "Cloud" }
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
              <span className="text-sm font-medium text-primary">Enterprise Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                The Complete
              </span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Customer Engagement
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Unify customer data, orchestrate journeys, and deliver personalized experiences at scale. 
              Everything you need to build lasting customer relationships.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/demo">
                <Button variant="premium" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Product Tour
                </Button>
              </Link>
              <Link href="/dashboard?onboarding=1">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-[#030305]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Built for Enterprise Scale
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature designed to handle millions of customers, billions of interactions, and complex enterprise requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    {feature.capabilities.map((capability) => (
                      <div key={capability} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Connect Everything
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              200+ pre-built integrations with your favorite tools and platforms. No code required.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group"
              >
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-500 rounded" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/integrations">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Integrations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-[#030305]">
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
              Join 2000+ enterprises that have chosen Alya to build lasting customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/demo">
                <Button variant="premium" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Request Demo
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