import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-600">
            {isActive ? (
                <span className="text-teal-700">{children}</span>
            ) : (
                <span className="text-slate-600">{children}</span>
            )}
            {isActive && (
                <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-teal-100 rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </Link>
    );
};

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.4 }}
                            className="p-1.5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg text-white shadow-sm"
                        >
                            <Leaf size={24} />
                        </motion.div>
                        <span className="font-bold text-xl tracking-tight text-slate-800 group-hover:text-teal-700 transition-colors">
                            CivicPulse
                        </span>
                    </Link>

                    <div className="flex gap-2">
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/report">Report Issue</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
