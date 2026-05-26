import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff, ArrowLeft, RefreshCw, UserX, UserCheck, Shield, UploadCloud, FileText, CheckCircle, Trash2, Download, Clock, Bell, AlertTriangle, Users, Target, BookOpen, CalendarClock, BarChart2, Folder, FolderPlus, FolderOpen, MoveRight, Edit2, X, ChevronDown } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const apiFetch = (path, opts = {}) => {
    const token = localStorage.getItem('csa_access');
    return fetch(`${API_BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) } }).then(r => r.json());
};

const Pill = ({ children, color }) => (
    <span style={{ background: `${color}22`, color, padding: '2px 9px', borderRadius: '16px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>{children}</span>
);
const Btn = ({ onClick, disabled, color, bg, children }) => (
    <motion.button whileHover={!disabled ? { scale: 1.04 } : {}} whileTap={!disabled ? { scale: 0.96 } : {}}
        onClick={onClick} disabled={disabled}
        style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', background: bg, color, fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', opacity: disabled ? 0.6 : 1, whiteSpace: 'nowrap' }}>
        {children}
    </motion.button>
);

export default function AdminPage({ user, onBack }) {
    const [tab, setTab] = useState('overview');
    const [dash, setDash] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);

    // Edit Timing State
    const [editingTiming, setEditingTiming] = useState(null);
    const [timingForm, setTimingForm] = useState({ duration_minutes: 60, scheduled_start_time: '' });

    // PDF Upload state
    const fileInputRef = useRef(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfName, setPdfName] = useState('');
    const [pdfPackageId, setPdfPackageId] = useState('');
    const [pdfUploading, setPdfUploading] = useState(false);
    const [pdfResult, setPdfResult] = useState(null);
    const [pdfError, setPdfError] = useState(null);

    // Folder/Package management state
    const [packages, setPackages] = useState([]);
    const [pkgBusy, setPkgBusy] = useState(null);
    const [newFolder, setNewFolder] = useState({ name: '', description: '' });
    const [editingFolder, setEditingFolder] = useState(null); // { id, name, description }
    const [movingTest, setMovingTest] = useState(null); // test id being moved

    const loadAll = useCallback(async () => {
        setLoading(true);
        const [d, u, pkgs] = await Promise.all([
            apiFetch('/admin-panel/dashboard/'),
            apiFetch('/admin-panel/users/'),
            apiFetch('/admin-panel/packages/'),
        ]);
        setDash(d);
        setUsers(Array.isArray(u) ? u : []);
        setPackages(Array.isArray(pkgs) ? pkgs : []);
        setLoading(false);
    }, []);
    useEffect(() => { loadAll(); }, [loadAll]);

    const act = async (key, path) => {
        setBusy(key);
        const r = await apiFetch(path, { method: 'PATCH' });
        console.log('AdminPage act response:', r);
        setDash(p => {
            if (!p) return p;
            const updatedTests = p.tests.map(t => {
                if (t.id === r.id) {
                    const updated = { ...t, ...r };
                    console.log('Test state updated:', { old: t, new: updated });
                    return updated;
                }
                return t;
            });
            return { ...p, tests: updatedTests };
        });
        setBusy(null);
    };

    const togLock = (id) => act(`lock-${id}`, `/admin-panel/tests/${id}/lock/`);
    const togActive = (id) => act(`act-${id}`, `/admin-panel/tests/${id}/active/`);
    const togExam = (id) => act(`exam-${id}`, `/admin-panel/tests/${id}/exam/`);
    const togAutoBan = (id) => act(`autoban-${id}`, `/admin-panel/tests/${id}/auto-ban/`);
    const togEndTest = (id) => {
        console.log('End Test clicked for test ID:', id);
        return act(`endtest-${id}`, `/admin-panel/tests/${id}/end/`);
    };

    const exportTest = async (id, name) => {
        setBusy(`exp-${id}`);
        try {
            const token = localStorage.getItem('csa_access');
            const res = await fetch(`${API_BASE}/admin-panel/tests/${id}/export/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `exam_results_${name.replace(/\\s+/g, '_')}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            alert(e.message);
        }
        setBusy(null);
    };

    const saveTiming = async (id) => {
        setBusy(`timing-${id}`);
        try {
            const formData = {
                duration_minutes: timingForm.duration_minutes
            };
            if (timingForm.scheduled_start_time) {
                formData.scheduled_start_time = new Date(timingForm.scheduled_start_time).toISOString();
            } else {
                formData.scheduled_start_time = null;
            }

            const r = await apiFetch(`/admin-panel/tests/${id}/timing/`, {
                method: 'PATCH',
                body: JSON.stringify(formData)
            });
            if (r.error) throw new Error(r.error);
            setDash(p => p ? ({ ...p, tests: p.tests.map(t => t.id === id ? { ...t, ...r } : t) }) : p);
            setEditingTiming(null);
        } catch (e) {
            alert('Failed to update timing: ' + e.message);
        }
        setBusy(null);
    };

    const delTest = async (id, name) => {
        if (!window.confirm(`Are you absolutely sure you want to PERMANENTLY delete the test "${name}"? This cannot be undone.`)) return;
        setBusy(`del-${id}`);
        try {
            await apiFetch(`/admin-panel/tests/${id}/delete/`, { method: 'DELETE' });
            setDash(p => p ? ({ ...p, tests: p.tests.filter(t => t.id !== id) }) : p);
        } catch (e) {
            alert('Failed to delete test: ' + e.message);
        }
        setBusy(null);
    };

    const togUser = async (id) => {
        setBusy(`user-${id}`);
        const r = await apiFetch(`/admin-panel/users/${id}/toggle/`, { method: 'PATCH' });
        setUsers(p => p.map(u => u.id === id ? { ...u, is_active: r.is_active } : u));
        setBusy(null);
    };
    const unbanUser = async (id, testId) => {
        setBusy(`unban-${id}-${testId}`);
        await apiFetch(`/admin-panel/users/${id}/unban/`, { method: 'PATCH', body: JSON.stringify(testId ? { test_id: testId } : {}) });
        setUsers(p => p.map(u => u.id === id ? { ...u, active_bans: testId ? u.active_bans.filter(b => b.test_id !== testId) : [] } : u));
        setBusy(null);
    };

    // PDF Upload Logic
    const handlePdfUpload = async (e) => {
        e.preventDefault();
        if (!pdfFile || !pdfName.trim()) return;

        setPdfUploading(true);
        setPdfError(null);
        setPdfResult(null);

        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('test_name', pdfName.trim());
        if (pdfPackageId) {
            formData.append('package_id', pdfPackageId);
        }

        try {
            const token = localStorage.getItem('csa_access');
            const res = await fetch(`${API_BASE}/admin-panel/create-from-pdf/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to extract PDF');

            setPdfResult(data);
            setPdfFile(null);
            setPdfName('');
            setPdfPackageId('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            loadAll(); // refresh tests list
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('✅ PDF Extraction Complete!', {
                    body: `Successfully extracted ${data.summary?.total_questions || data.test.total} questions from "${data.test.name}"`,
                    icon: '/favicon.ico',
                    tag: 'pdf-extraction',
                });
            }
        } catch (err) {
            setPdfError(err.message);
        } finally {
            setPdfUploading(false);
        }
    };

    // Folder/Package management handlers
    const createFolder = async () => {
        if (!newFolder.name.trim()) return;
        setPkgBusy('create');
        try {
            const r = await apiFetch('/admin-panel/packages/create/', { method: 'POST', body: JSON.stringify(newFolder) });
            if (r.error) throw new Error(r.error);
            setPackages(p => [...p, r]);
            setNewFolder({ name: '', description: '' });
        } catch (e) { alert(e.message); }
        setPkgBusy(null);
    };

    const saveEditFolder = async () => {
        if (!editingFolder?.name?.trim()) return;
        setPkgBusy(`edit-${editingFolder.id}`);
        try {
            const r = await apiFetch(`/admin-panel/packages/${editingFolder.id}/update/`, { method: 'PATCH', body: JSON.stringify({ name: editingFolder.name, description: editingFolder.description }) });
            if (r.error) throw new Error(r.error);
            setPackages(p => p.map(pkg => pkg.id === r.id ? r : pkg));
            setEditingFolder(null);
        } catch (e) { alert(e.message); }
        setPkgBusy(null);
    };

    const deleteFolder = async (id, name) => {
        if (!window.confirm(`Delete folder "${name}"? Tests inside will become un-categorized.`)) return;
        setPkgBusy(`del-${id}`);
        try {
            await apiFetch(`/admin-panel/packages/${id}/delete/`, { method: 'DELETE' });
            setPackages(p => p.filter(pkg => pkg.id !== id));
        } catch (e) { alert(e.message); }
        setPkgBusy(null);
    };

    const moveTestToFolder = async (testId, pkgId) => {
        setPkgBusy(`move-${testId}`);
        try {
            const r = await apiFetch(`/admin-panel/tests/${testId}/move/`, { method: 'PATCH', body: JSON.stringify({ package_id: pkgId || null }) });
            if (r.error) throw new Error(r.error);
            setMovingTest(null);
            loadAll();
        } catch (e) { alert(e.message); }
        setPkgBusy(null);
    };

    // ── Text Import State ──────────────────────────────────────────────────────
    const [txtText, setTxtText] = useState('');
    const [txtPreview, setTxtPreview] = useState(null);   // { count, questions }
    const [txtPreviewErr, setTxtPreviewErr] = useState(null);
    const [txtPreviewing, setTxtPreviewing] = useState(false);
    const [txtDestMode, setTxtDestMode] = useState('existing'); // 'existing' | 'new'
    const [txtTestId, setTxtTestId] = useState('');
    const [txtNewName, setTxtNewName] = useState('');
    const [txtNewPkgId, setTxtNewPkgId] = useState('');
    const [txtImporting, setTxtImporting] = useState(false);
    const [txtResult, setTxtResult] = useState(null);
    const [txtImportErr, setTxtImportErr] = useState(null);
    const [txtExpandedQ, setTxtExpandedQ] = useState(null); // expanded preview question index

    const handleTxtPreview = async () => {
        if (!txtText.trim()) return;
        setTxtPreviewing(true);
        setTxtPreviewErr(null);
        setTxtPreview(null);
        try {
            const r = await apiFetch('/admin-panel/preview-text-import/', { method: 'POST', body: JSON.stringify({ text: txtText }) });
            if (r.error) throw new Error(r.error);
            setTxtPreview(r);
        } catch (e) { setTxtPreviewErr(e.message); }
        setTxtPreviewing(false);
    };

    const handleTxtImport = async () => {
        setTxtImporting(true);
        setTxtImportErr(null);
        setTxtResult(null);
        const body = { text: txtText };
        if (txtDestMode === 'existing') {
            if (!txtTestId) { setTxtImportErr('Please select a test.'); setTxtImporting(false); return; }
            body.test_id = txtTestId;
        } else {
            if (!txtNewName.trim()) { setTxtImportErr('Please enter a test name.'); setTxtImporting(false); return; }
            body.test_name = txtNewName.trim();
            if (txtNewPkgId) body.package_id = txtNewPkgId;
        }
        try {
            const r = await apiFetch('/admin-panel/import-from-text/', { method: 'POST', body: JSON.stringify(body) });
            if (r.error) throw new Error(r.error);
            setTxtResult(r);
            // reset
            setTxtText(''); setTxtPreview(null); setTxtTestId(''); setTxtNewName(''); setTxtNewPkgId('');
            loadAll();
        } catch (e) { setTxtImportErr(e.message); }
        setTxtImporting(false);
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'tests', label: 'Tests' },
        { id: 'folders', label: '📁 Folders' },
        { id: 'ai_import', label: 'AI PDF Import' },
        { id: 'text_import', label: '📝 Text Import' },
        { id: 'users', label: 'Users' }
    ];

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
                <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '18px' }}>
                    <ArrowLeft size={14} /> Back to Practice Hub
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={24} color="white" /></div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.6rem', marginBottom: '2px' }}>Admin Control Panel</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Signed in as <strong style={{ color: '#a78bfa' }}>{user?.username}</strong></p>
                    </div>
                    <Btn onClick={loadAll} color="var(--text-secondary)" bg="rgba(255,255,255,0.05)"><RefreshCw size={13} /> Refresh</Btn>
                </div>
            </motion.div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.04)', borderRadius: '13px', padding: '4px', width: 'fit-content', marginBottom: '24px', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 20px', borderRadius: '11px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '13px', background: tab === t.id ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : 'transparent', color: tab === t.id ? 'white' : 'var(--text-secondary)', transition: 'all .2s' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 10px' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    Loading...
                </div>
            ) : (
                <AnimatePresence mode="wait">

                    {/* ── Overview ── */}
                    {tab === 'overview' && (
                        <motion.div key="ov" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
                                {[
                                    { icon: <Users size={22} />, label: 'Total Users', value: dash?.total_users || 0, color: '#8b5cf6' },
                                    { icon: <FileText size={22} />, label: 'Total Attempts', value: dash?.total_attempts || 0, color: '#06b6d4' },
                                    { icon: <Target size={22} />, label: 'Avg Score', value: `${dash?.avg_score || 0}%`, color: '#10b981' },
                                    { icon: <Lock size={22} />, label: 'Locked Tests', value: dash?.tests?.filter(t => t.is_locked).length || 0, color: '#f59e0b' },
                                    { icon: <ShieldCheck size={22} />, label: 'Banned Students', value: dash?.banned_users || 0, color: '#ef4444' },
                                ].map(({ icon, label, value, color }) => (
                                    <motion.div key={label} whileHover={{ y: -2 }} className="glass-panel" style={{ padding: '18px', textAlign: 'center', borderTop: `2px solid ${color}` }}>
                                        <div style={{ color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
                                        <div style={{ fontSize: '1.9rem', fontWeight: '900', color }}>{value}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>{label}</div>
                                    </motion.div>
                                ))}
                            </div>
                            {dash?.tests?.map(t => (
                                <div key={t.id} className="glass-panel" style={{ padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {t.name}
                                            {t.is_exam_test && <Pill color="#ef4444">EXAM</Pill>}
                                            {t.is_locked && <Pill color="#f87171">LOCKED</Pill>}
                                            {!t.is_active && <Pill color="#9ca3af">Hidden</Pill>}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '3px', display: 'flex', gap: '12px' }}>
                                            <span>{t.total_questions} Qs</span><span>{t.attempt_count} attempts</span><span>{t.avg_score}% avg</span>
                                        </div>
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${Math.min(t.avg_score, 100)}%`, background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* ── AI PDF Import ── */}
                    {tab === 'ai_import' && (
                        <motion.div key="ai" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Notification Permission Banner */}
                            {'Notification' in window && Notification.permission === 'default' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ marginBottom: '20px', padding: '16px', background: 'rgba(147,51,234,0.1)', border: '1px solid rgba(147,51,234,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Bell size={20} color="#c084fc" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#c084fc', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            Enable Desktop Notifications
                                        </div>
                                        <div style={{ color: '#e9d5ff', fontSize: '0.8rem' }}>
                                            Get notified when PDF extraction completes, even if you switch tabs
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => Notification.requestPermission()}
                                        style={{ padding: '8px 16px', background: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', borderRadius: '8px', color: '#c084fc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                        Enable
                                    </button>
                                </motion.div>
                            )}

                            <div className="glass-panel" style={{ padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                        <UploadCloud size={28} color="white" />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>AI Paper Extraction</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                        Upload a PDF test paper. Gemini AI will extract all questions, options, and correct answers automatically to create a new playable test.
                                    </p>
                                </div>

                                <form onSubmit={handlePdfUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Test Name (Required)</label>
                                        <input type="text" value={pdfName} onChange={e => setPdfName(e.target.value)} required placeholder="e.g. CSA Spring Exam 2026"
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px' }} />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📁 Add to Folder</label>
                                        <select value={pdfPackageId} onChange={e => setPdfPackageId(e.target.value)}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', colorScheme: 'dark', cursor: 'pointer' }}>
                                            <option value="" style={{ background: '#1a1a2e' }}>— Default (PU SN folder) —</option>
                                            {packages.map(pkg => (
                                                <option key={pkg.id} value={pkg.id} style={{ background: '#1a1a2e' }}>{pkg.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PDF File</label>
                                        <div style={{ border: '2px dashed rgba(139,92,246,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'rgba(139,92,246,0.02)' }}>
                                            <input type="file" ref={fileInputRef} accept=".pdf" required onChange={e => setPdfFile(e.target.files[0])}
                                                style={{ display: 'none' }} id="pdf-upload" />
                                            <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                <FileText size={32} color={pdfFile ? '#4ade80' : '#a78bfa'} />
                                                <span style={{ color: pdfFile ? '#4ade80' : '#a78bfa', fontWeight: '600' }}>
                                                    {pdfFile ? pdfFile.name : 'Click to select PDF'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                        {pdfError && (
                                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> {pdfError}
                                        </div>
                                        )}

                                    <button type="submit" disabled={pdfUploading || !pdfFile || !pdfName.trim()}
                                        className="primary-btn" style={{ padding: '14px', fontSize: '16px', justifyContent: 'center', opacity: (pdfUploading || !pdfFile || !pdfName.trim()) ? 0.6 : 1 }}>
                                        {pdfUploading ? (
                                            <><RefreshCw size={18} className="spin" /> Reading PDF & Extracting with Gemini...</>
                                        ) : (
                                            <><UploadCloud size={18} /> Generate Test from PDF</>
                                        )}
                                        <style>{`.spin { animation: spin 1.2s linear infinite }`}</style>
                                    </button>
                                </form>

                                {/* Success Result */}
                                {pdfResult && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        style={{ marginTop: '24px', padding: '24px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80', marginBottom: '16px', fontWeight: '700', fontSize: '1.1rem' }}>
                                            <CheckCircle size={24} /> {pdfResult.message || 'Test Created Successfully!'}
                                        </div>

                                        {/* Extraction Summary */}
                                        {pdfResult.summary && (
                                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
                                                <div style={{ color: '#a7f3d0', fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>
                                                    Extraction Summary
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                                                    <div>
                                                        <div style={{ color: '#6ee7b7', fontSize: '0.75rem', marginBottom: '4px' }}>Total Questions</div>
                                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.3rem' }}>{pdfResult.summary.total_questions}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#6ee7b7', fontSize: '0.75rem', marginBottom: '4px' }}>Single Choice</div>
                                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.3rem' }}>{pdfResult.summary.single_choice}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#6ee7b7', fontSize: '0.75rem', marginBottom: '4px' }}>Multi Choice</div>
                                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.3rem' }}>{pdfResult.summary.multi_choice}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#6ee7b7', fontSize: '0.75rem', marginBottom: '4px' }}>Processing Time</div>
                                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.3rem' }}>{pdfResult.summary.extraction_time_seconds}s</div>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(167,243,208,0.2)', color: '#d1fae5', fontSize: '0.8rem' }}>
                                                    PDF: <strong>{pdfResult.summary.pdf_filename}</strong><br />
                                                    Package: <strong>{pdfResult.summary.package}</strong><br />
                                                    Slug: <strong>{pdfResult.summary.test_slug}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {/* Success Message */}
                                        <div style={{ padding: '12px', background: 'rgba(74,222,128,0.15)', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
                                            <div style={{ fontSize: '0.9rem', color: '#d1fae5', textAlign: 'center' }}>
                                                <strong>{pdfResult.test.name}</strong> is now available in the Tests tab!
                                            </div>
                                        </div>

                                        {/* Success Actions */}
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(167,243,208,0.2)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <button 
                                                onClick={() => { setTab('tests'); setPdfResult(null); }}
                                                style={{ padding: '8px 16px', background: 'rgba(74,222,128,0.2)', border: '1px solid #4ade80', borderRadius: '8px', color: '#4ade80', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                                                View in Tests Tab
                                            </button>
                                            <button 
                                                onClick={() => setPdfResult(null)}
                                                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#d1fae5', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                Close
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Tests ── */}
                    {tab === 'tests' && (
                        <motion.div key="tests" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                                <strong>Lock</strong> blocks students. <strong>Hide</strong> removes it from home. <strong>Exam</strong> enables proctored fullscreen mode.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {dash?.tests?.map((t, i) => (
                                    <motion.div key={t.id} layout className="glass-panel"
                                        style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', opacity: t.is_active ? 1 : 0.55, borderLeft: `3px solid ${t.is_exam_test ? '#ef4444' : t.is_locked ? '#f87171' : '#8b5cf6'}`, marginBottom: '4px' }}>
                                        <div style={{ background: 'rgba(139,92,246,0.1)', padding: '10px', borderRadius: '10px', flexShrink: 0 }}><FileText size={18} color="#a78bfa" /></div>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                                                {t.name}
                                                {t.is_exam_test && <Pill color="#ef4444">EXAM</Pill>}
                                                {t.is_locked && <Pill color="#f87171">LOCKED</Pill>}
                                                {!t.is_active && <Pill color="#9ca3af">HIDDEN</Pill>}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.77rem', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                <span><BookOpen size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />{t.total_questions} Qs</span>
                                                <span><Clock size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />{t.duration_minutes || 60} mins</span>
                                                {t.scheduled_start_time && <span><CalendarClock size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />{new Date(t.scheduled_start_time).toLocaleString()}</span>}
                                                <span><BarChart2 size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />{t.attempt_count} attempts</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                                            <Btn onClick={() => togLock(t.id)} disabled={busy === `lock-${t.id}`} color={t.is_locked ? '#4ade80' : '#f87171'} bg={t.is_locked ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}>
                                                {t.is_locked ? <><Unlock size={12} /> Unlock</> : <><Lock size={12} /> Lock</>}
                                            </Btn>
                                            <Btn onClick={() => togActive(t.id)} disabled={busy === `act-${t.id}`} color={t.is_active ? '#9ca3af' : '#818cf8'} bg={t.is_active ? 'rgba(107,114,128,0.1)' : 'rgba(99,102,241,0.1)'}>
                                                {t.is_active ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                                            </Btn>
                                            <Btn onClick={() => togExam(t.id)} disabled={busy === `exam-${t.id}`} color={t.is_exam_test ? '#4ade80' : '#ef4444'} bg={t.is_exam_test ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)'}>
                                                <Shield size={12} /> {t.is_exam_test ? 'Remove Exam' : 'Set as Exam'}
                                            </Btn>
                                            {t.is_exam_test && (
                                                <>
                                                    <Btn onClick={() => togAutoBan(t.id)} disabled={busy === `autoban-${t.id}`} color={t.enable_auto_ban ? '#fbbf24' : '#9ca3af'} bg={t.enable_auto_ban ? 'rgba(251,191,36,0.1)' : 'rgba(156,163,175,0.1)'}>
                                                        <ShieldCheck size={12} /> {t.enable_auto_ban ? 'Auto-Ban ON' : 'Auto-Ban OFF'}
                                                    </Btn>
                                                    <Btn onClick={() => togEndTest(t.id)} disabled={busy === `endtest-${t.id}`} color={t.is_ended ? '#ef4444' : '#10b981'} bg={t.is_ended ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}>
                                                        <ShieldCheck size={12} /> {t.is_ended ? 'Test Ended ✓' : 'End Test'}
                                                    </Btn>
                                                    <Btn onClick={() => exportTest(t.id, t.name)} disabled={busy === `exp-${t.id}`} color="#10b981" bg="rgba(16,185,129,0.1)">
                                                        <Download size={12} /> Export CSV
                                                    </Btn>
                                                </>
                                            )}
                                            <Btn onClick={() => delTest(t.id, t.name)} disabled={busy === `del-${t.id}`} color="#f43f5e" bg="rgba(244,63,94,0.1)">
                                                <Trash2 size={12} /> Delete
                                            </Btn>
                                            <Btn onClick={() => {
                                                const tzOffset = (new Date()).getTimezoneOffset() * 60000;
                                                const localISOTime = t.scheduled_start_time ? new Date(new Date(t.scheduled_start_time).getTime() - tzOffset).toISOString().slice(0, 16) : '';
                                                setEditingTiming(t.id);
                                                setTimingForm({ duration_minutes: t.duration_minutes || 60, scheduled_start_time: localISOTime });
                                            }} disabled={busy === `timing-${t.id}`} color="#3b82f6" bg="rgba(59,130,246,0.1)">
                                                <Clock size={12} /> Edit Timing
                                            </Btn>
                                            <Btn onClick={() => setMovingTest(movingTest === t.id ? null : t.id)} color="#f59e0b" bg="rgba(245,158,11,0.1)">
                                                <MoveRight size={12} /> Move
                                            </Btn>
                                        </div>

                                        {/* Inline Timing Edit Form */}
                                        <AnimatePresence>
                                            {editingTiming === t.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ width: '100%', overflow: 'hidden' }}>
                                                    <div style={{ width: '100%', marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                                        <div style={{ flex: 1, minWidth: '120px' }}>
                                                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Total Time (Minutes)</label>
                                                            <input type="number" min="1" value={timingForm.duration_minutes} onChange={e => setTimingForm(p => ({ ...p, duration_minutes: parseInt(e.target.value) || 0 }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', color: 'white', fontSize: '14px' }} />
                                                        </div>
                                                        {t.is_exam_test && (
                                                            <div style={{ flex: 2, minWidth: '200px' }}>
                                                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Scheduled Start Time (Local)</label>
                                                                <input type="datetime-local" value={timingForm.scheduled_start_time} onChange={e => setTimingForm(p => ({ ...p, scheduled_start_time: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', color: 'white', fontSize: '14px', colorScheme: 'dark' }} />
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <Btn onClick={() => setEditingTiming(null)} color="var(--text-secondary)" bg="rgba(255,255,255,0.05)">Cancel</Btn>
                                                            <Btn onClick={() => saveTiming(t.id)} disabled={busy} color="#4ade80" bg="rgba(34,197,94,0.1)">Save Timing</Btn>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Inline Move to Folder */}
                                        <AnimatePresence>
                                            {movingTest === t.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ width: '100%', overflow: 'hidden' }}>
                                                    <div style={{ width: '100%', marginTop: '12px', padding: '14px', background: 'rgba(245,158,11,0.06)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}><MoveRight size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} />Move to folder:</span>
                                                        <select defaultValue="" onChange={e => moveTestToFolder(t.id, e.target.value)} disabled={pkgBusy === `move-${t.id}`}
                                                            style={{ flex: 1, minWidth: '160px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.3)', color: 'white', fontSize: '13px', colorScheme: 'dark', cursor: 'pointer' }}>
                                                            <option value="">— Select folder —</option>
                                                            {packages.map(pkg => <option key={pkg.id} value={pkg.id} style={{ background: '#1a1a2e' }}>{pkg.name}</option>)}
                                                        </select>
                                                        <Btn onClick={() => setMovingTest(null)} color="var(--text-secondary)" bg="rgba(255,255,255,0.05)">Cancel</Btn>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Folders ── */}
                    {tab === 'folders' && (
                        <motion.div key="folders" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Create Folder */}
                            <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', borderTop: '2px solid #8b5cf6' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FolderPlus size={18} color="#8b5cf6" /> Create New Folder
                                </h3>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 2, minWidth: '180px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Folder Name *</label>
                                        <input value={newFolder.name} onChange={e => setNewFolder(p => ({ ...p, name: e.target.value }))} placeholder="e.g. PU SN Batch 2026"
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px' }} />
                                    </div>
                                    <div style={{ flex: 3, minWidth: '200px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description (optional)</label>
                                        <input value={newFolder.description} onChange={e => setNewFolder(p => ({ ...p, description: e.target.value }))} placeholder="e.g. ServiceNow CAD Practice Tests"
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px' }} />
                                    </div>
                                    <Btn onClick={createFolder} disabled={pkgBusy === 'create' || !newFolder.name.trim()} color="white" bg="linear-gradient(135deg,#8b5cf6,#6d28d9)">
                                        <FolderPlus size={13} /> {pkgBusy === 'create' ? 'Creating...' : 'Create Folder'}
                                    </Btn>
                                </div>
                            </div>

                            {/* Folder List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {packages.length === 0 ? (
                                    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', opacity: 0.6, borderStyle: 'dashed' }}>
                                        <Folder size={32} color="var(--text-secondary)" style={{ margin: '0 auto 10px', display: 'block' }} />
                                        <p style={{ color: 'var(--text-secondary)' }}>No folders yet. Create one above!</p>
                                    </div>
                                ) : packages.map(pkg => (
                                    <motion.div key={pkg.id} layout className="glass-panel"
                                        style={{ padding: '20px 24px', borderLeft: '3px solid #8b5cf6' }}>
                                        {editingFolder?.id === pkg.id ? (
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                                <div style={{ flex: 2, minWidth: '150px' }}>
                                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Name</label>
                                                    <input value={editingFolder.name} onChange={e => setEditingFolder(p => ({ ...p, name: e.target.value }))}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(139,92,246,0.4)', color: 'white', fontSize: '14px' }} />
                                                </div>
                                                <div style={{ flex: 3, minWidth: '180px' }}>
                                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '5px' }}>Description</label>
                                                    <input value={editingFolder.description} onChange={e => setEditingFolder(p => ({ ...p, description: e.target.value }))}
                                                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px' }} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <Btn onClick={() => setEditingFolder(null)} color="var(--text-secondary)" bg="rgba(255,255,255,0.05)">Cancel</Btn>
                                                    <Btn onClick={saveEditFolder} disabled={pkgBusy === `edit-${pkg.id}`} color="#4ade80" bg="rgba(34,197,94,0.1)">Save</Btn>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                                <div style={{ background: 'rgba(139,92,246,0.1)', padding: '10px', borderRadius: '10px', flexShrink: 0 }}>
                                                    <FolderOpen size={18} color="#a78bfa" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{pkg.name}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                                                        {pkg.description || '—'} · <strong style={{ color: '#a78bfa' }}>{pkg.test_count}</strong> tests
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                                                    <Btn onClick={() => setEditingFolder({ id: pkg.id, name: pkg.name, description: pkg.description || '' })} color="#a78bfa" bg="rgba(139,92,246,0.1)">
                                                        <Edit2 size={12} /> Edit
                                                    </Btn>
                                                    <Btn onClick={() => deleteFolder(pkg.id, pkg.name)} disabled={pkgBusy === `del-${pkg.id}`} color="#f43f5e" bg="rgba(244,63,94,0.1)">
                                                        <Trash2 size={12} /> Delete
                                                    </Btn>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Text Import ── */}
                    {tab === 'text_import' && (
                        <motion.div key="txt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                            {/* Success banner */}
                            <AnimatePresence>
                                {txtResult && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ marginBottom: '20px', padding: '20px 24px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                        <CheckCircle size={22} color="#4ade80" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '1rem' }}>{txtResult.message}</div>
                                            <div style={{ color: '#a7f3d0', fontSize: '0.82rem', marginTop: '2px' }}>Test now has <strong>{txtResult.test.total}</strong> total questions.</div>
                                        </div>
                                        <button onClick={() => { setTxtResult(null); setTab('tests'); }}
                                            style={{ padding: '8px 14px', background: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', borderRadius: '8px', color: '#4ade80', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                                            View in Tests Tab
                                        </button>
                                        <button onClick={() => setTxtResult(null)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                                {/* ── Left: Paste + Preview ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="glass-panel" style={{ padding: '24px', borderTop: '2px solid #8b5cf6' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            ✏️ Paste Questions
                                        </h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '14px', lineHeight: '1.5' }}>
                                            Paste text in the format below. Questions are separated by <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '4px' }}>Question N</code> headers.
                                        </p>

                                        {/* Format hint */}
                                        <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '12px 14px', fontSize: '11px', fontFamily: 'monospace', color: '#c4b5fd', marginBottom: '14px', lineHeight: '1.7', whiteSpace: 'pre' }}>{`Question 1
Question: Your question text here?

All Options:
A) First option
B) Second option
C) Third option

Correct Ans: A, C
Explanation: Optional explanation.`}</div>

                                        <textarea
                                            value={txtText}
                                            onChange={e => { setTxtText(e.target.value); setTxtPreview(null); setTxtPreviewErr(null); setTxtResult(null); }}
                                            placeholder="Paste your questions here..."
                                            rows={18}
                                            style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', lineHeight: '1.6' }}
                                        />

                                        {txtPreviewErr && (
                                            <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} /> {txtPreviewErr}
                                            </div>
                                        )}

                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={handleTxtPreview} disabled={!txtText.trim() || txtPreviewing}
                                            style={{ marginTop: '14px', width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: (!txtText.trim() || txtPreviewing) ? 'not-allowed' : 'pointer', opacity: (!txtText.trim() || txtPreviewing) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            {txtPreviewing ? <><RefreshCw size={16} className="spin" /> Parsing...</> : <>👁️ Preview Parsed Questions</>}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* ── Right: Preview Results + Destination ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                    {/* Preview panel */}
                                    {txtPreview ? (
                                        <div className="glass-panel" style={{ padding: '20px', borderTop: '2px solid #10b981' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                                <CheckCircle size={18} color="#10b981" />
                                                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#4ade80' }}>{txtPreview.count} question{txtPreview.count !== 1 ? 's' : ''} parsed successfully</span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                                                {txtPreview.questions.map((q, idx) => (
                                                    <div key={idx}
                                                        onClick={() => setTxtExpandedQ(txtExpandedQ === idx ? null : idx)}
                                                        style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                    <span style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>Q{q.number}</span>
                                                                    {q.multi && <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>MSQ</span>}
                                                                    <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 7px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>✓ {q.correct_letters.join(', ')}</span>
                                                                </div>
                                                                <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                                                                    {q.question.length > 90 && txtExpandedQ !== idx ? q.question.slice(0, 90) + '…' : q.question}
                                                                </div>
                                                            </div>
                                                            <ChevronDown size={14} color="var(--text-secondary)" style={{ flexShrink: 0, transform: txtExpandedQ === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginTop: '2px' }} />
                                                        </div>

                                                        {txtExpandedQ === idx && (
                                                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                                                                    {q.options.map((opt, oi) => {
                                                                        const letter = ['A','B','C','D','E'][oi];
                                                                        const isCorrect = q.correct_letters.includes(letter);
                                                                        return (
                                                                            <div key={oi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '6px 8px', borderRadius: '6px', background: isCorrect ? 'rgba(16,185,129,0.12)' : 'transparent', border: isCorrect ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent' }}>
                                                                                <span style={{ fontWeight: '700', color: isCorrect ? '#4ade80' : '#a78bfa', fontSize: '12px', flexShrink: 0 }}>{letter})</span>
                                                                                <span style={{ fontSize: '12px', color: isCorrect ? '#d1fae5' : 'var(--text-secondary)', lineHeight: '1.4' }}>{opt}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {q.explanation && (
                                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', lineHeight: '1.5' }}>
                                                                        💡 {q.explanation.slice(0, 200)}{q.explanation.length > 200 ? '…' : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', opacity: 0.5, borderStyle: 'dashed', flex: 0 }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👁️</div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preview will appear here after parsing</p>
                                        </div>
                                    )}

                                    {/* Destination selector — only shown after preview */}
                                    {txtPreview && (
                                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            className="glass-panel" style={{ padding: '22px', borderTop: '2px solid #f59e0b' }}>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <MoveRight size={16} color="#f59e0b" /> Where to add these questions?
                                            </h3>

                                            {/* Radio */}
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                                {[['existing', '➕ Add to existing test'], ['new', '🆕 Create new test']].map(([val, label]) => (
                                                    <button key={val} onClick={() => setTxtDestMode(val)}
                                                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: txtDestMode === val ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)', background: txtDestMode === val ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)', color: txtDestMode === val ? '#fbbf24' : 'var(--text-secondary)', fontWeight: txtDestMode === val ? '700' : '500', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>

                                            {txtDestMode === 'existing' ? (
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '7px' }}>Select test to add to</label>
                                                    <select value={txtTestId} onChange={e => setTxtTestId(e.target.value)}
                                                        style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px', colorScheme: 'dark', cursor: 'pointer' }}>
                                                        <option value="" style={{ background: '#1a1a2e' }}>— Select a test —</option>
                                                        {(dash?.tests || []).map(t => (
                                                            <option key={t.id} value={t.id} style={{ background: '#1a1a2e' }}>
                                                                {t.name} ({t.total_questions} Qs)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '7px' }}>New Test Name *</label>
                                                        <input value={txtNewName} onChange={e => setTxtNewName(e.target.value)} placeholder="e.g. CSA Module 3 Practice"
                                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px' }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '7px' }}>Add to Folder</label>
                                                        <select value={txtNewPkgId} onChange={e => setTxtNewPkgId(e.target.value)}
                                                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '14px', colorScheme: 'dark', cursor: 'pointer' }}>
                                                            <option value="" style={{ background: '#1a1a2e' }}>— Default (PU SN) —</option>
                                                            {packages.map(pkg => (
                                                                <option key={pkg.id} value={pkg.id} style={{ background: '#1a1a2e' }}>{pkg.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {txtImportErr && (
                                                <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#f87171', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <AlertTriangle size={14} /> {txtImportErr}
                                                </div>
                                            )}

                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                onClick={handleTxtImport} disabled={txtImporting}
                                                style={{ marginTop: '16px', width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: txtImporting ? 'not-allowed' : 'pointer', opacity: txtImporting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                {txtImporting ? <><RefreshCw size={16} className="spin" /> Importing...</> : <>✅ Import {txtPreview.count} Question{txtPreview.count !== 1 ? 's' : ''}</>}
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Users ── */}
                    {tab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{users.length} registered students</p>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <span>{users.filter(u => u.is_active).length} active</span>
                                    <span>·</span>
                                    <span>{users.filter(u => !u.is_active).length} disabled</span>
                                    <span>·</span>
                                    <span>{users.filter(u => u.active_bans?.length > 0).length} exam-banned</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {users.map((u, i) => {
                                    const isAdmin = u.email === 'chamthakrutik4@gmail.com';
                                    return (
                                        <motion.div key={u.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                                            className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', opacity: u.is_active ? 1 : 0.5, marginBottom: '6px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isAdmin ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', color: 'white', flexShrink: 0 }}>
                                                {u.username ? u.username[0].toUpperCase() : '?'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: '140px' }}>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                    {u.username}
                                                    {isAdmin && <Pill color="#a78bfa">Admin</Pill>}
                                                    {!u.is_active && <Pill color="#f87171">Disabled</Pill>}
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    <span>{u.email || '—'}</span>
                                                    <span>{u.attempt_count} attempts</span>
                                                    {u.last_attempt && <span>Last: {new Date(u.last_attempt).toLocaleDateString()}</span>}
                                                </div>
                                                {(u.active_bans || []).length > 0 && (
                                                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        {u.active_bans.map(ban => (
                                                            <span key={ban.test_id} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>
                                                                Banned: {ban.test_name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                                                {(u.active_bans || []).map(ban => (
                                                    <Btn key={ban.test_id} onClick={() => unbanUser(u.id, ban.test_id)} disabled={busy === `unban-${u.id}-${ban.test_id}`} color="#4ade80" bg="rgba(34,197,94,0.1)">
                                                        <UserCheck size={12} /> Unban {ban.test_name}
                                                    </Btn>
                                                ))}
                                                {!isAdmin && (
                                                    <Btn onClick={() => togUser(u.id)} disabled={busy === `user-${u.id}`} color={u.is_active ? '#f87171' : '#4ade80'} bg={u.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'}>
                                                        {u.is_active ? <><UserX size={12} /> Disable</> : <><UserCheck size={12} /> Enable</>}
                                                    </Btn>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
