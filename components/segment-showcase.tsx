'use client';

import { motion } from 'framer-motion';
import { Target, Users, TrendingUp, Brain, Zap, Shield } from 'lucide-react';
import { useUserSegmentation } from '../hooks/use-user-segmentation';
import { useDynamicContentTargeting } from '../hooks/use-dynamic-content-targeting';

export default function SegmentShowcase() {
  const { userSegments } = useUserSegmentation({
    userId: 'homepage_visitor',
    autoEvaluate: true
  });

  const { getContentForElement } = useDynamicContentTargeting({
    userId: 'homepage_visitor',
    userSegments,
    autoTarget: true
  });

  const showcaseContent = getContentForElement('segment-showcase');

  const features: Array<{
    icon: any;
    title: string;
    description: string;
    metric: string;
  }> = showcaseContent?.features || [
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Reach the right audience with AI-powered segmentation that adapts in real-time.",
      metric: "3x Higher Conversion"
    },
    {
      icon: Users, 
      title: "Dynamic Personalization",
      description: "Deliver unique experiences to every visitor based on their behavior and preferences.",
      metric: "5x Engagement Boost"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Anticipate customer needs before they arise with advanced ML algorithms.",
      metric: "85% Accuracy Rate"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Transform data into actionable intelligence with our neural network technology.",
      metric: "Real-time Processing"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience zero-latency personalization that scales with your traffic.",
      metric: "99.9% Uptime"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with GDPR, CCPA, and SOC 2 Type II compliance.",
      metric: "100% Compliant"
    }
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#030305] to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {showcaseContent?.headline || "Advanced Segmentation & Targeting"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {showcaseContent?.description || "Experience the power of intelligent customer segmentation that delivers personalized experiences at scale."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-primary/30 transition-all cursor-pointer hover:-translate-y-2 overflow-hidden">
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30">
                        {feature.metric}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* User Segment Detection */}
        {userSegments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-400">
                Detected as: <span className="font-semibold">{userSegments.join(', ')}</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Analytics Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white mb-4">Real-time Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-6">
              Monitor your segmentation performance and user engagement in real-time
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">6</div>
                <div className="text-sm text-gray-400">Active Segments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">48,732</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">13.2%</div>
                <div className="text-sm text-gray-400">Avg Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">2.8M</div>
                <div className="text-sm text-gray-400">Revenue Impact</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}