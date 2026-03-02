import React from 'react';
import { cn } from '../utils/cn';

export default function Card({ className, children, ...props }) {
    return (
        <div className={cn("glass rounded-2xl p-6 relative overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}
