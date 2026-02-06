'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Calendar,
  Clock,
  Zap,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Menu,
  X,
  Globe,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassCard } from '../components/ui/glass-card';

export default function PremiumLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Bento grid items with varying sizes and depths
  const bentoItems = [
    {
      id: 1,
      title: 'Intelligent Prioritization',
      description: 'AI-powered task sorting that learns your workflow patterns',
      icon: Zap,
      size: 'large',
      depth: 1,
      color: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/30'
    },
    {
      id: 2,
      title: 'Focus Mode',
      description: 'Distraction-free environment with ambient soundscapes',
      size: 'medium',
      depth: 2,
      color: 'from-purple-500/10 to-violet-500/10',
      border: 'border-purple-500/30'
    },
    {
      id: 3,
      title: 'Quick Capture',
      description: 'Ctrl+Space anywhere to capture thoughts instantly',
      size: 'small',
      depth: 3,
      color: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/30'
    },
    {
      id: 4,
      title: 'Smart Dependencies',
      description: 'Automatic task relationships that prevent bottlenecks',
      icon: Clock,
      size: 'tall',
      depth: 1,
      color: 'from-orange-500/10 to-amber-500/10',
      border: 'border-orange-500/30'
    },
    {
      id: 5,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with contextual commenting',
      size: 'wide',
      depth: 2,
      color: 'from-rose-500/10 to-pink-500/10',
      border: 'border-rose-500/30'
    },
    {
      id: 6,
      title: 'Performance',
      stat: '99.9%',
      label: 'Uptime Guarantee',
      size: 'square',
      depth: 3,
      color: 'from-indigo-500/10 to-blue-500/10',
      border: 'border-indigo-500/30'
    },
    {
      id: 7,
      title: 'Time Intelligence',
      description: 'Predictive analytics for optimal task scheduling',
      icon: BarChart3,
      size: 'large',
      depth: 1,
      color: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/30'
    },
    {
      id: 8,
      title: 'Cross-Platform',
      description: 'Seamless sync across all devices',
      size: 'medium',
      depth: 2,
      color: 'from-yellow-500/10 to-amber-500/10',
      border: 'border-yellow-500/30'
    }
  ];

  const stats = [
    { value: '87%', label: 'Increase in focus time' },
    { value: '2.3x', label: 'Faster task completion' },
    { value: '150K+', label: 'Active users' },
    { value: '98%', label: 'Customer satisfaction' }
  ];

  const features = [
    {
      icon: Activity,
      title: 'Real-time Sync',
      description: 'All your tasks update instantly across all devices'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption keeps your data safe'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deployed in 150+ regions worldwide'
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Track productivity trends over time'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">EVOLVE</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </motion.button>
            <Button variant="primary" size="md" className="px-6 py-2">
              Start Free Trial
            </Button>
            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
              {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2"
                >
                  {item}
                </a>
              ))}
              <button className="w-full text-left text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
            >
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Trusted by 150K+ professionals worldwide</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Focus
              </span>{' '}
              without friction.<br />
              <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Productivity evolved.
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Transform how your team works with an intelligent productivity platform
              that adapts to your workflow, not the other way around.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            >
              <Button
                variant="primary"
                size="lg"
                className="group"
                icon={<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                Start Free Trial
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="group"
                icon={<Play className="mr-2 w-5 h-5" />}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Product Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative mx-auto max-w-4xl h-96 rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>

              {/* Simulated App Interface */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Evolve Dashboard</div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="mb-6">
                    <div className="text-lg font-semibold mb-4 text-gray-200">Today's Focus</div>
                    <div className="space-y-3">
                      {[
                        { title: 'Q4 Roadmap Review', team: 'Marketing Team', due: 'Tomorrow', priority: 'high' },
                        { title: 'Client Presentation', team: 'Sales Team', due: 'In 3 days', priority: 'medium' },
                        { title: 'Team Sync Meeting', team: 'All Hands', due: 'Today', priority: 'low' },
                        { title: 'Weekly Report', team: 'Finance', due: 'Completed', priority: 'completed' }
                      ].map((task, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 1 }}
                          className={`flex items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                            task.priority === 'high'
                              ? 'bg-red-500/10 border-red-500/30'
                              : task.priority === 'medium'
                              ? 'bg-yellow-500/10 border-yellow-500/30'
                              : task.priority === 'low'
                              ? 'bg-blue-500/10 border-blue-500/30'
                              : 'bg-green-500/10 border-green-500/30 line-through'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border mr-4 flex items-center justify-center ${
                            task.priority === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-500'
                          }`}>
                            {task.priority === 'completed' && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${task.priority === 'completed' ? 'text-gray-400' : 'text-white'}`}>
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              {task.team} • {task.due}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">modern teams</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade features with an intuitive interface that your team will love.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                hoverEffect={true}
                elevated={true}
                className="text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Designed for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">deep work</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Every feature crafted to eliminate distractions and amplify focus.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bentoItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`
                  relative rounded-2xl border backdrop-blur-xl overflow-hidden group
                  ${item.size === 'large' ? 'lg:col-span-2 lg:row-span-1' : ''}
                  ${item.size === 'medium' ? 'md:col-span-1' : ''}
                  ${item.size === 'small' ? 'md:col-span-1' : ''}
                  ${item.size === 'tall' ? 'lg:row-span-2' : ''}
                  ${item.size === 'wide' ? 'lg:col-span-2' : ''}
                  ${item.size === 'square' ? '' : ''}
                  bg-gradient-to-br ${item.color} ${item.border}
                `}
                style={{
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 p-6 h-full flex flex-col">
                  {item.icon && (
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {item.stat ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <div className="text-4xl font-bold text-white mb-2">{item.stat}</div>
                      <div className="text-gray-300 text-sm">{item.label}</div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400">Learn more →</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard
            elevated={true}
            className="text-center p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to evolve your productivity?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who've transformed their workflow with Evolve.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">EVOLVE</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © 2026 Evolve. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}