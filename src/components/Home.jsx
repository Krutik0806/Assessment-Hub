import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, PlayCircle, Lock, ChevronDown, Package, Shield,
    Clock, Trophy, X, User, Hash, Mail, Folder, FolderOpen, Monitor,
    BookOpen, AlertTriangle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const folderColors = [
    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: '#8b5cf6' },
    { accent: '#06b6d4', bg: 'rgba(6,182,212,0.10)', border: '#06b6d4' },
    { accent: '#10b981', bg: 'rgba(16,185,129,0.10)', border: '#10b981' },
    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: '#f59e0b' },
    { accent: '#ec4899', bg: 'rgba(236,72,153,0.10)', border: '#ec4899' },
    { accent: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: '#3b82f6' },
];

const testColors = [
    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
    { accent: '#06b6d4', bg: 'rgba(6,182,212,0.10)' },
    { accent: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
];

export default function Home({ onStartTest, onViewLeaderboard, onReviewTest, loadingReview, user }) {
    const [packages, setPackages] = useState([]);
    const [openPkg, setOpenPkg] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingQ, setLoadingQ] = useState(false);
    const [regModal, setRegModal] = useState(null);
    const [regForm, setRegForm] = useState({ candidate_name: '', enrollment_number: '', roll_no: '', candidate_email: '', batch: '' });
    const fetchedRef = useRef(false);

    const fetchData = useCallback(async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        try {
            const token = localStorage.getItem('csa_access');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${API_BASE}/packages/`, { headers });
            const data = await res.json();
            const pkgs = Array.isArray(data) ? data : [];
            setPackages(pkgs);
            // Auto-open if there's only one folder
            if (pkgs.length === 1) {
                setOpenPkg({ [pkgs[0].id]: true });
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const initiateExam = (test) => {
        setRegForm({ candidate_name: user?.first_name || '', enrollment_number: '', roll_no: '', candidate_email: user?.email || '', batch: '' });
        setRegModal(test);
    };

    const startTest = async (test, mode, candidateDetails = null) => {
        setLoadingQ(true);
        try {
            const token = localStorage.getItem('csa_access');
            const res = await fetch(`${API_BASE}/tests/${test.slug}/questions/`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (!res.ok) { alert(data.error || 'Cannot load test.'); setLoadingQ(false); return; }
            setRegModal(null);
            onStartTest(test.id, test.slug, test.name, data, mode, test.is_exam_test, candidateDetails);
        } catch (e) {
            console.error('Test Launch Error:', e);
            alert('Failed to load questions. Is the server running?');
        }
        setLoadingQ(false);
    };

    // Render a test card for practice tests
    const renderPracticeCard = (test, i) => {
        const c = testColors[i % testColors.length];
        return (
            <motion.div key={test.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -4, boxShadow: `0 12px 24px -10px ${c.accent}40` }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="glass-panel"
                style={{ padding: '20px', opacity: test.is_locked ? 0.6 : 1, borderTop: `2px solid ${c.accent}`, position: 'relative', overflow: 'hidden' }}>

                {/* Background Pattern */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${c.accent}25 2px, transparent 2px)`, backgroundSize: '24px 24px', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: c.accent, filter: 'blur(60px)', opacity: 0.3, zIndex: 0, borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ background: c.bg, padding: '10px', borderRadius: '10px' }}>
                        {test.is_locked ? <Lock size={18} color="#f87171" /> : <GraduationCap size={18} color={c.accent} />}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '600' }}>{test.total} Qs</span>
                </div>
                <div style={{ position: 'relative', zIndex: 1, fontWeight: '700', marginBottom: '4px', fontSize: '0.95rem' }}>{test.name}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {test.is_locked
                        ? <div style={{ color: '#f87171', fontSize: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={12} /> Locked</div>
                        : (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => startTest(test, 'practice')} disabled={loadingQ}
                                    style={{ flex: 1, padding: '12px 8px', fontSize: '13.5px', borderRadius: '10px', border: `1px solid ${c.accent}40`, background: `${c.accent}15`, color: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                    <GraduationCap size={16} /> Practice
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => startTest(test, 'exam')} disabled={loadingQ}
                                    style={{ flex: 1, padding: '12px 8px', fontSize: '13.5px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                                    <PlayCircle size={16} /> Exam
                                </motion.button>
                            </div>
                        )}
                </div>
            </motion.div>
        );
    };

    // Render an exam/proctored card inside a folder
    const renderExamCard = (test, i) => {
        const startTime = test.scheduled_start_time ? new Date(test.scheduled_start_time) : null;
        const isEarly = startTime && new Date() < startTime;
        return (
            <motion.div key={test.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01, y: -4, boxShadow: '0 12px 24px -10px rgba(239,68,68,0.4)' }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="glass-panel"
                style={{ padding: '24px', borderTop: '2px solid #ef4444', background: 'rgba(239,68,68,0.03)', position: 'relative', overflow: 'hidden' }}>

                {/* EXAM badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '2px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'examPulse 1.5s ease-in-out infinite' }} />
                    PROCTORED
                    <style>{`@keyframes examPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
                </div>

                {/* Background Pattern */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(239,68,68,0.18) 2px, transparent 2px)', backgroundSize: '28px 28px', opacity: 0.7, pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '130px', height: '130px', background: '#ef4444', filter: 'blur(65px)', opacity: 0.2, zIndex: 0, borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: 'rgba(239,68,68,0.12)', padding: '10px', borderRadius: '10px' }}><GraduationCap size={20} color="#ef4444" /></div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{test.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{test.total} questions</div>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px', fontSize: '11px', color: '#f87171', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span><Monitor size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />Fullscreen required</span>
                    <span><Clock size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />{test.duration_minutes || 60} mins</span>
                    {startTime && <span style={{ color: isEarly ? '#f59e0b' : '#4ade80' }}><Clock size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />Starts: {startTime.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {test.is_locked
                        ? <div style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}><Lock size={13} /> Locked by admin</div>
                        : test.has_attempted ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button className="ghost-btn" onClick={() => onViewLeaderboard(test)}
                                    style={{ flex: '1', minWidth: '120px', padding: '10px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#818cf8', fontWeight: '700' }}>
                                    <Trophy size={14} /> Leaderboard
                                </button>
                                {test.is_ended && (
                                    <button className="primary-btn" onClick={() => onReviewTest(test)} disabled={loadingReview}
                                        style={{ flex: '1', minWidth: '120px', padding: '10px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: loadingReview ? 0.6 : 1, cursor: loadingReview ? 'not-allowed' : 'pointer' }}>
                                        <Trophy size={14} /> Review
                                    </button>
                                )}
                                <button className="ghost-btn" onClick={() => onStartTest(test.id, test.slug, test.name, [], 'practice')}
                                    style={{ flex: '1', minWidth: '120px', padding: '10px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#4ade80', fontWeight: '700', border: '1px solid rgba(74,222,128,0.3)' }}>
                                    <PlayCircle size={14} /> Practice
                                </button>
                            </div>
                        ) : (
                            <button className={isEarly ? "ghost-btn" : "primary-btn"}
                                onClick={() => initiateExam(test)} disabled={loadingQ || isEarly}
                                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: isEarly ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ef4444, #b91c1c)', cursor: isEarly ? 'not-allowed' : 'pointer', opacity: isEarly ? 0.7 : 1 }}>
                                {isEarly ? <><Clock size={16} /> Starts at {startTime.toLocaleTimeString([], { timeStyle: 'short' })}</> : <><Shield size={16} /> Start Proctored Exam</>}
                            </button>
                        )}
                </div>
            </motion.div>
        );
    };

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 24px', position: 'relative' }}>
            {/* Ambient Background Orbs */}
            <motion.div animate={{ y: [0, -40, 0], x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'fixed', top: '5%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />
            <motion.div animate={{ y: [0, 50, 0], x: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none' }} />

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '12px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Assessment Hub
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                    Select a folder to access practice tests &amp; proctored exams
                </p>
            </motion.div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                    Loading...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : packages.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel"
                    style={{ padding: '60px 32px', textAlign: 'center', borderStyle: 'dashed' }}>
                    <Folder size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px' }}>No test folders available yet.</p>
                    {user?.is_admin && <p style={{ color: '#8b5cf6', fontSize: '0.88rem' }}>Admin: create a folder in the Admin Panel → Folders tab, then add tests.</p>}
                </motion.div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {packages.map((pkg, pkgIdx) => {
                        const fc = folderColors[pkgIdx % folderColors.length];
                        const tests = pkg.tests || [];
                        const examCount = tests.filter(t => t.is_exam_test).length;
                        const practiceCount = tests.filter(t => !t.is_exam_test).length;
                        const isOpen = !!openPkg[pkg.id];

                        return (
                            <div key={pkg.id}>
                                {/* Folder Header */}
                                <motion.div
                                    whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.998 }}
                                    onClick={() => setOpenPkg(p => ({ ...p, [pkg.id]: !p[pkg.id] }))}
                                    className="glass-panel"
                                    style={{ padding: '20px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `3px solid ${fc.accent}`, userSelect: 'none' }}>

                                    <motion.div
                                        animate={{ scale: isOpen ? 1.1 : 1 }}
                                        style={{ background: fc.bg, padding: '12px', borderRadius: '12px', flexShrink: 0 }}>
                                        {isOpen
                                            ? <FolderOpen size={22} color={fc.accent} />
                                            : <Folder size={22} color={fc.accent} />}
                                    </motion.div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            {pkg.name}
                                            {examCount > 0 && (
                                                <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', padding: '2px 9px', borderRadius: '100px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Shield size={10} /> {examCount} EXAM{examCount > 1 ? 'S' : ''}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            {pkg.description && <span>{pkg.description}</span>}
                                            <span><BookOpen size={11} style={{ verticalAlign: '-1px', marginRight: '3px' }} />{practiceCount} practice · {examCount} exam</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ background: fc.bg, color: fc.accent, padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700' }}>
                                            {tests.length} tests
                                        </span>
                                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                            <ChevronDown size={20} color="var(--text-secondary)" />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Tests inside folder */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            style={{ overflow: 'hidden' }}>

                                            {tests.length === 0 ? (
                                                <div style={{ paddingLeft: '20px', paddingTop: '12px' }}>
                                                    <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', borderStyle: 'dashed', opacity: 0.6 }}>
                                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No tests in this folder yet.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '4px' }}>
                                                    {/* Exam tests - show first with special styling */}
                                                    {examCount > 0 && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingLeft: '4px' }}>
                                                                <Shield size={13} color="#ef4444" />
                                                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Proctored Exams</span>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                                                                {tests.filter(t => t.is_exam_test).map((test, i) => renderExamCard(test, i))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Practice tests */}
                                                    {practiceCount > 0 && (
                                                        <div>
                                                            {examCount > 0 && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingLeft: '4px' }}>
                                                                    <GraduationCap size={13} color="#8b5cf6" />
                                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Practice Tests</span>
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                                                {tests.filter(t => !t.is_exam_test).map((test, i) => renderPracticeCard(test, i))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Registration Modal for Proctored Exam */}
            <AnimatePresence>
                {regModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop" onClick={() => setRegModal(null)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '0', overflow: 'hidden', position: 'relative', zIndex: 10000 }}>

                            <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(185,28,28,0.05))', padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield color="#ef4444" size={24} /> Pre-Exam Details</h2>
                                    <button onClick={() => setRegModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>Before commencing the proctored exam for <b>{regModal.name}</b>, please verify your candidate details.</p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); startTest(regModal, 'exam', regForm); }} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}><User size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} /> Full Name</label>
                                    <input required value={regForm.candidate_name} onChange={e => setRegForm(p => ({ ...p, candidate_name: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', color: 'white', fontSize: '15px', outline: 'none' }} placeholder="John Doe" />
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}><Hash size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} /> Enrollment No</label>
                                        <input required value={regForm.enrollment_number} onChange={e => setRegForm(p => ({ ...p, enrollment_number: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', color: 'white', fontSize: '15px', outline: 'none' }} placeholder="ENR12345" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}><Hash size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} /> Roll No</label>
                                        <input required value={regForm.roll_no} onChange={e => setRegForm(p => ({ ...p, roll_no: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', color: 'white', fontSize: '15px', outline: 'none' }} placeholder="R-450" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}><Mail size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} /> Official Email</label>
                                    <input required type="email" value={regForm.candidate_email} onChange={e => setRegForm(p => ({ ...p, candidate_email: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', color: 'white', fontSize: '15px', outline: 'none' }} placeholder="john@university.edu" />
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}><Package size={12} style={{ marginRight: '4px', verticalAlign: '-1px' }} /> Batch</label>
                                    <select required value={regForm.batch} onChange={e => setRegForm(p => ({ ...p, batch: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)', color: 'white', fontSize: '15px', outline: 'none', cursor: 'pointer' }}>
                                        <option value="" disabled style={{ background: '#1a1a2e', color: '#888' }}>Select your batch</option>
                                        <option value="A" style={{ background: '#1a1a2e', color: 'white' }}>Batch A</option>
                                        <option value="B" style={{ background: '#1a1a2e', color: 'white' }}>Batch B</option>
                                        <option value="C" style={{ background: '#1a1a2e', color: 'white' }}>Batch C</option>
                                    </select>
                                </div>

                                <button type="submit" disabled={loadingQ} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', fontWeight: '700', fontSize: '16px', cursor: loadingQ ? 'not-allowed' : 'pointer', opacity: loadingQ ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    {loadingQ ? <Clock size={18} className="spin" /> : <Shield size={18} />}
                                    {loadingQ ? 'Starting...' : 'Confirm & Start Exam'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
