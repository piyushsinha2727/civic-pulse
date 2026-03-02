import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-16 pb-12">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden rounded-3xl bg-gradient-earthy border border-white/50 shadow-sm glass">
                {/* Animated Background Shapes */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-emerald-200/40 blur-3xl pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-teal-200/40 blur-3xl pointer-events-none"
                />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
                            Empowering Communities
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
                            Report. Resolve. <br className="hidden md:block" />
                            <span className="text-gradient">Restore our City.</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            CivicPulse is the modern platform for citizens to report environmental and infrastructure issues. Together, we can build a cleaner, safer, and more sustainable community.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/report')} className="group">
                                Report an Issue
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
                                View Dashboard
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-6xl mx-auto w-full px-4">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div variants={itemVariants}>
                        <Card className="flex flex-col items-center text-center group hover:bg-white/90 transition-colors">
                            <div className="p-4 rounded-2xl bg-teal-50 text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-2">1,204</h3>
                            <p className="text-slate-500 font-medium">Total Issues Reported</p>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="flex flex-col items-center text-center group hover:bg-white/90 transition-colors">
                            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-2">86%</h3>
                            <p className="text-slate-500 font-medium">Resolution Rate</p>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="flex flex-col items-center text-center group hover:bg-white/90 transition-colors">
                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 mb-4 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-2">12</h3>
                            <p className="text-slate-500 font-medium">High Severity Alerts</p>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}
