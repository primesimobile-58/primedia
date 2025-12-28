"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Rocket, Mail, MessageSquare, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Campaign Details" },
  { id: 2, title: "Target Audience" },
  { id: 3, title: "Content Creation" },
  { id: 4, title: "Review & Launch" },
];

const campaignTypes = [
  { id: "email", name: "Email Blast", icon: Mail, description: "Send beautiful newsletters." },
  { id: "push", name: "Push Notification", icon: Smartphone, description: "Engage users on mobile." },
  { id: "sms", name: "SMS", icon: MessageSquare, description: "Direct text messages." },
  { id: "automation", name: "Automation", icon: Zap, description: "Trigger-based journeys." },
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    audience: "",
    subject: "",
    content: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <Link href="/dashboard/campaigns" className="text-muted-foreground hover:text-white flex items-center gap-1 text-sm mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
           </Link>
           <h2 className="text-3xl font-bold tracking-tight text-white glow-text">Create New Campaign</h2>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 w-full -z-10" />
        <div 
           className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-purple-500 w-full -z-10 transition-all duration-500"
           style={{ width: `${((currentStep - 1) / 3) * 100}%` }} 
        />
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2 bg-[#030712] px-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                currentStep >= step.id 
                  ? "border-purple-500 bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                  : "border-white/20 text-muted-foreground bg-black"
              )}
            >
              {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className={cn(
               "text-xs font-medium transition-colors",
               currentStep >= step.id ? "text-white" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Wizard Content */}
      <Card className="glass-card min-h-[400px] flex flex-col">
        <CardContent className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input 
                    placeholder="e.g. Summer Sale 2025" 
                    value={formData.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {campaignTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div 
                          key={type.id}
                          onClick={() => updateForm("type", type.id)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all hover:bg-white/5",
                            formData.type === type.id 
                              ? "border-purple-500 bg-purple-500/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]" 
                              : "border-white/10"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-2">
                             <div className={cn("p-2 rounded-md", formData.type === type.id ? "bg-purple-500 text-white" : "bg-white/10 text-muted-foreground")}>
                                <Icon className="w-5 h-5" />
                             </div>
                             <span className="font-semibold">{type.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-[3.25rem]">{type.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="space-y-4">
                    <Label>Select Segment</Label>
                    <div className="space-y-2">
                       {['All Users', 'Active Last 30 Days', 'VIP Customers', 'New Signups'].map((segment) => (
                          <div 
                            key={segment}
                            onClick={() => updateForm("audience", segment)}
                            className={cn(
                               "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                               formData.audience === segment 
                                ? "border-purple-500 bg-purple-500/10" 
                                : "border-white/10 hover:bg-white/5"
                            )}
                          >
                             <div className="flex items-center gap-3">
                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", formData.audience === segment ? "border-purple-500" : "border-muted-foreground")}>
                                   {formData.audience === segment && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                                </div>
                                <span>{segment}</span>
                             </div>
                             <span className="text-sm text-muted-foreground">1,234 users</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input 
                    placeholder="Enter email subject..." 
                    value={formData.subject}
                    onChange={(e) => updateForm("subject", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <textarea 
                    className="flex min-h-[200px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Write your message here..."
                    value={formData.content}
                    onChange={(e) => updateForm("content", e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                   <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Campaign Summary</h3>
                      <div className="space-y-2 text-sm">
                         <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-muted-foreground">Name</span>
                            <span>{formData.name || "Untitled"}</span>
                         </div>
                         <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-muted-foreground">Type</span>
                            <span className="capitalize">{formData.type || "Not selected"}</span>
                         </div>
                         <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-muted-foreground">Audience</span>
                            <span>{formData.audience || "Not selected"}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Preview</h3>
                      <div className="space-y-2">
                         <div className="font-medium text-white">{formData.subject || "No Subject"}</div>
                         <div className="text-sm text-muted-foreground whitespace-pre-wrap">{formData.content || "No content yet..."}</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/5 p-6">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-32"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button 
              variant="premium" 
              onClick={nextStep}
              className="w-32"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/dashboard/campaigns">
               <Button 
                 variant="premium" 
                 className="w-32 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none"
               >
                 <Rocket className="w-4 h-4 mr-2" /> Launch
               </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
