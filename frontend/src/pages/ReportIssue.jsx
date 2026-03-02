import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, AlertCircle } from 'lucide-react';
import { issueService } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

export default function ReportIssue() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        latitude: '',
        longitude: '',
        image: null
    });

    const [errors, setErrors] = useState({});

    const categories = [
        'Pothole',
        'Fallen Tree',
        'Vandalism',
        'Street Light Outage',
        'Waste Management',
        'Other'
    ];

    const validate = () => {
        const newErrors = {};
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Valid latitude is required';
        if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Valid longitude is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on interact
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);
            if (formData.image) {
                data.append('image', formData.image);
            }

            // Send data to backend API
            await issueService.reportIssue(data);

            setToast({
                isVisible: true,
                message: 'Issue reported successfully! Thank you for helping the community.',
                type: 'success'
            });

            // Reset form
            setFormData({
                category: '',
                description: '',
                latitude: '',
                longitude: '',
                image: null
            });

        } catch (error) {
            console.error("Error reporting issue", error);
            setToast({
                isVisible: true,
                message: 'Failed to report issue. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    }));
                    setErrors(prev => ({ ...prev, latitude: null, longitude: null }));
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert('Unable to retrieve your location. Please enter manually.');
                }
            );
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="!p-8 shadow-xl mt-4">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Report an Issue</h1>
                        <p className="text-slate-500">Provide details to help your community fix the problem.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full bg-slate-50 border ${errors.category ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2`}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 flex items-center text-sm text-red-500"><AlertCircle size={14} className="mr-1" />{errors.category}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`w-full bg-slate-50 border ${errors.description ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2`}
                                placeholder="Please describe the issue in detail..."
                            />
                            {errors.description && <p className="mt-1 flex items-center text-sm text-red-500"><AlertCircle size={14} className="mr-1" />{errors.description}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-sm font-medium text-slate-700">Location Coordinates *</label>
                                <button
                                    type="button"
                                    onClick={getUserLocation}
                                    className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center transition-colors"
                                >
                                    <MapPin size={14} className="mr-1" /> Get Current Location
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="Latitude"
                                        className={`w-full bg-slate-50 border ${errors.latitude ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2`}
                                    />
                                    {errors.latitude && <p className="mt-1 flex items-center text-sm text-red-500"><AlertCircle size={14} className="mr-1" />{errors.latitude}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="Longitude"
                                        className={`w-full bg-slate-50 border ${errors.longitude ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2`}
                                    />
                                    {errors.longitude && <p className="mt-1 flex items-center text-sm text-red-500"><AlertCircle size={14} className="mr-1" />{errors.longitude}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photo</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-10 w-10 text-slate-400" />
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                    {formData.image && <p className="text-sm font-medium text-teal-700 mt-2">{formData.image.name}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                                Submit Issue Report
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
