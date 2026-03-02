import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={24} />,
        error: <XCircle className="text-red-500" size={24} />,
        info: <Info className="text-blue-500" size={24} />
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="fixed bottom-4 right-4 z-[200] max-w-md w-full glass bg-white/95 shadow-xl rounded-xl p-4 border flex items-start gap-4"
                >
                    <div className="shrink-0">{icons[type]}</div>
                    <div className="flex-1 mt-0.5">
                        <p className="text-sm font-medium text-slate-800">{message}</p>
                    </div>
                    <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
