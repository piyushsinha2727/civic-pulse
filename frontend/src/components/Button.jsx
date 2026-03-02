import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import Spinner from './Spinner';

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-sm",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
        outline: "bg-transparent border-2 border-teal-500 text-teal-600 hover:bg-teal-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
            {children}
        </motion.button>
    );
}
