import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Map as MapIcon, List, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { issueService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

// Custom Map Icons based on severity
const createIcon = (color) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const icons = {
    red: createIcon('#ef4444'),    // severity >= 8
    orange: createIcon('#f97316'), // severity 6-7
    green: createIcon('#22c55e')   // severity < 6
};

const getSeverityIcon = (severity) => {
    if (severity >= 8) return icons.red;
    if (severity >= 6) return icons.orange;
    return icons.green;
};

const getSeverityColor = (severity) => {
    if (severity >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (severity >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-green-100 text-green-800 border-green-200';
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'resolved': return <CheckCircle size={16} className="text-emerald-500" />;
        case 'in progress': return <Clock size={16} className="text-blue-500" />;
        default: return <AlertTriangle size={16} className="text-amber-500" />;
    }
};

export default function Dashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list' for mobile

    // Filters
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal State
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const data = await issueService.getIssues();
            setIssues(data);
        } catch (error) {
            console.error("Failed to fetch issues", error);
            // Mock data for demo if API is unreachable
            setIssues([
                { id: 1, category: 'Pothole', description: 'Deep pothole on Main St.', severity: 8, status: 'Open', latitude: 51.505, longitude: -0.09, imgUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400' },
                { id: 2, category: 'Fallen Tree', description: 'Tree blocking lane in Park Ave.', severity: 6, status: 'In Progress', latitude: 51.51, longitude: -0.1, imgUrl: 'https://images.unsplash.com/photo-1588820485960-444738da74dd?auto=format&fit=crop&q=80&w=400' },
                { id: 3, category: 'Street Light Outage', description: 'Dark alleyway, feels unsafe.', severity: 4, status: 'Resolved', latitude: 51.49, longitude: -0.08 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(issues.map(i => i.category))];
    const statuses = ['All', 'Open', 'In Progress', 'Resolved'];

    const filteredIssues = issues.filter(issue => {
        const matchCategory = filterCategory === 'All' || issue.category === filterCategory;
        const matchStatus = filterStatus === 'All' || issue.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchCategory && matchStatus;
    });

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedIssue) return;
        setIsUpdating(true);
        try {
            await issueService.updateIssueStatus(selectedIssue.id, newStatus);
            setToast({ isVisible: true, message: 'Status updated to ' + newStatus, type: 'success' });
            setIssues(issues.map(img => img.id === selectedIssue.id ? { ...img, status: newStatus } : img));
            setSelectedIssue(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Update failed", error);
            // Optimistic update for demo
            setIssues(issues.map(img => img.id === selectedIssue.id ? { ...img, status: newStatus } : img));
            setSelectedIssue(prev => ({ ...prev, status: newStatus }));
            setToast({ isVisible: true, message: 'Mock Status updated (API error)', type: 'info' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner size="lg" className="text-teal-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Issue Dashboard</h1>
                    <p className="text-slate-500 mt-1">Monitor and manage community reports</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-lg flex items-center transition-colors ${viewMode === 'map' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <MapIcon size={18} className="mr-2 hidden sm:block" /> Map
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg flex items-center transition-colors ${viewMode === 'list' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <List size={18} className="mr-2 hidden sm:block" /> List
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

                {/* Sidebar List */}
                <div className={`lg:col-span-1 lg:flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${viewMode === 'map' ? 'hidden sm:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <List size={18} /> Found {filteredIssues.length} issues
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        <AnimatePresence>
                            {filteredIssues.map((issue) => (
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedIssue(issue)}
                                    className="p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-md cursor-pointer transition-all bg-white group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-slate-800 group-hover:text-teal-700 transition-colors">
                                            {issue.category}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(issue.severity)}`}>
                                            Sev: {issue.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{issue.description}</p>
                                    <div className="flex items-center text-xs font-medium text-slate-600 gap-1 capitalize">
                                        {getStatusIcon(issue.status)} {issue.status}
                                    </div>
                                </motion.div>
                            ))}
                            {filteredIssues.length === 0 && (
                                <div className="p-8 text-center text-slate-400">
                                    <Filter size={32} className="mx-auto mb-3 opacity-50" />
                                    <p>No issues found matching filters.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Leaflet Map */}
                <div className={`lg:col-span-2 rounded-2xl overflow-hidden shadow-sm border border-slate-200 ${viewMode === 'list' ? 'hidden sm:block' : 'block'} h-[50vh] sm:h-auto relative`}>
                    {filteredIssues.length > 0 ? (
                        <MapContainer
                            center={[filteredIssues[0].latitude || 51.505, filteredIssues[0].longitude || -0.09]}
                            zoom={13}
                            scrollWheelZoom={false}
                            className="w-full h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                            {filteredIssues.map(issue => (
                                <Marker
                                    key={issue.id}
                                    position={[parseFloat(issue.latitude) || 0, parseFloat(issue.longitude) || 0]}
                                    icon={getSeverityIcon(issue.severity)}
                                    eventHandlers={{ click: () => setSelectedIssue(issue) }}
                                >
                                    <Popup className="rounded-xl overflow-hidden shadow-lg border-0">
                                        <div className="p-1 min-w-[200px]">
                                            <h4 className="font-bold text-slate-800">{issue.category}</h4>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{issue.description}</p>
                                            <div className="mt-2 text-teal-600 font-medium text-xs flex items-center">
                                                View Details &rarr;
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                            Map view unavailable (No markers)
                        </div>
                    )}
                </div>
            </div>

            {/* Issue Detail Modal */}
            <Modal
                isOpen={!!selectedIssue}
                onClose={() => setSelectedIssue(null)}
                title={selectedIssue?.category}
            >
                {selectedIssue && (
                    <div className="space-y-6">
                        {selectedIssue.imgUrl ? (
                            <img
                                src={selectedIssue.imgUrl}
                                alt="Issue"
                                className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400">
                                <span className="text-sm">No image provided</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {selectedIssue.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="!p-4 bg-slate-50 shadow-none border border-slate-100">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Severity</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(selectedIssue.severity)}`}>
                                        Score: {selectedIssue.severity} / 10
                                    </span>
                                </Card>
                                <Card className="!p-4 bg-slate-50 shadow-none border border-slate-100">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</h4>
                                    <div className="flex items-center gap-1.5 text-sm font-medium capitalize text-slate-700">
                                        {getStatusIcon(selectedIssue.status)} {selectedIssue.status}
                                    </div>
                                </Card>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Update Status</h4>
                                <div className="flex gap-2">
                                    {['Open', 'In Progress', 'Resolved'].map((status) => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={selectedIssue.status.toLowerCase() === status.toLowerCase() ? 'primary' : 'outline'}
                                            onClick={() => handleUpdateStatus(status)}
                                            disabled={isUpdating || selectedIssue.status.toLowerCase() === status.toLowerCase()}
                                            className="flex-1"
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
