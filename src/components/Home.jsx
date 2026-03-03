import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, PlayCircle, Lock, ChevronDown, Package, Shield, Clock, Trophy, X, User, Hash, Mail } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const testColors = [
    { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
    { accent: '#06b6d4', bg: 'rgba(6,182,212,0.10)' },
    { accent: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
];

export default function Home({ onStartTest, onViewLeaderboard, onReviewTest, user }) {
    const [packages, setPackages] = useState([]);
    const [examTests, setExamTests] = useState([]);
    const [openPkg, setOpenPkg] = useState({}); // { [pkg_id]: bool }
    const [loading, setLoading] = useState(true);
    const [loadingQ, setLoadingQ] = useState(false);
    const [regModal, setRegModal] = useState(null);
    const [regForm, setRegForm] = useState({ candidate_name: '', enrollment_number: '', roll_no: '', candidate_email: '' });
    const fetchedRef = useRef(false);

    // Fetch once on mount
    const fetchData = useCallback(async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        try {
            const token = localStorage.getItem('csa_access');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const [pkgRes, examRes] = await Promise.all([
                fetch(`${API_BASE}/packages/`, { headers }),
                fetch(`${API_BASE}/tests/exams/`, { headers }),
            ]);
            const pkgData = await pkgRes.json();
            const examData = await examRes.json();
            const pkgs = Array.isArray(pkgData) ? pkgData : [];
            setPackages(pkgs);
            setExamTests(Array.isArray(examData) ? examData : []);
            // All packages start closed by default
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const initiateExam = (test) => {
        setRegForm({ candidate_name: user?.first_name || '', enrollment_number: '', roll_no: '', candidate_email: user?.email || '' });
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
                    Practice at your own pace · Take proctored exams · Compete on the leaderboard
                </p>
            </motion.div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                    Loading...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <>
                    {/* ── Practice Packages (Folders) ── */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                            <Package size={20} color="#8b5cf6" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Practice Packages</h2>
                        </div>

                        {packages.map(pkg => (
                            <div key={pkg.id} style={{ marginBottom: '12px' }}>
                                {/* Folder header */}
                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                    onClick={() => setOpenPkg(p => ({ ...p, [pkg.id]: !p[pkg.id] }))}
                                    className="glass-panel"
                                    style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '3px solid #8b5cf6', userSelect: 'none' }}>
                                    <div style={{ fontSize: '1.8rem' }}>📁</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{pkg.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                                            {pkg.description} · {(pkg.tests || []).length} tests
                                        </div>
                                    </div>
                                    <motion.div animate={{ rotate: openPkg[pkg.id] ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                        <ChevronDown size={20} color="var(--text-secondary)" />
                                    </motion.div>
                                </motion.div>

                                {/* Tests inside folder */}
                                <AnimatePresence>
                                    {openPkg[pkg.id] && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            style={{ overflow: 'hidden' }}>
                                            <div style={{ paddingLeft: '16px', paddingTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', paddingBottom: '4px' }}>
                                                {(pkg.tests || []).map((test, i) => {
                                                    const c = testColors[i % testColors.length];
                                                    return (
                                                        <motion.div key={test.id}
                                                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                                            whileHover={{ scale: 1.02, y: -4, boxShadow: `0 12px 24px -10px ${c.accent}40` }}
                                                            transition={{ delay: i * 0.06, duration: 0.2 }}
                                                            className="glass-panel"
                                                            style={{ padding: '20px', opacity: test.is_locked ? 0.6 : 1, borderTop: `2px solid ${c.accent}`, position: 'relative', overflow: 'hidden' }}>

                                                            {/* Background Pattern */}
                                                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${c.accent}25 2px, transparent 2px)`, backgroundSize: '24px 24px', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />
                                                            {/* Decorative Top-Right Blur */}
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
                                                                    ? <div style={{ color: '#f87171', fontSize: '12px', marginTop: '12px' }}>🔒 Locked</div>
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
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* ── Exam Tests Section ── */}
                    {examTests.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                                <Shield size={20} color="#ef4444" />
                                <h2 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Proctored Exams</h2>
                                <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700' }}>
                                    🔴 LIVE
                                </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                                {examTests.map(test => {
                                    const startTime = test.scheduled_start_time ? new Date(test.scheduled_start_time) : null;
                                    const isEarly = startTime && new Date() < startTime;

                                    return (
                                        <motion.div key={test.id}
                                            whileHover={{ scale: 1.01, y: -4, boxShadow: '0 12px 24px -10px rgba(239,68,68,0.4)' }}
                                            className="glass-panel"
                                            style={{ padding: '24px', borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.03)', position: 'relative', overflow: 'hidden' }}>

                                            {/* Background Pattern */}
                                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(239,68,68,0.2) 2px, transparent 2px)', backgroundSize: '28px 28px', opacity: 0.8, pointerEvents: 'none', zIndex: 0 }} />
                                            {/* Decorative Top-Right Blur */}
                                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: '#ef4444', filter: 'blur(70px)', opacity: 0.25, zIndex: 0, borderRadius: '50%' }} />

                                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                                <span style={{ fontSize: '1.8rem' }}>🎓</span>
                                                <div>
                                                    <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>{test.name}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{test.total} questions</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#f87171', marginBottom: '16px', flexWrap: 'wrap' }}>
                                                <span>🖥️ Fullscreen required</span>
                                                <span>⏱️ {test.duration_minutes || 60} mins</span>
                                                {startTime && <span style={{ color: isEarly ? '#f59e0b' : '#4ade80' }}>🕒 Starts: {startTime.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>}
                                            </div>
                                            {test.is_locked
                                                ? <div style={{ color: '#f87171', fontSize: '13px', fontWeight: '600' }}>🔒 Locked by admin</div>
                                                : (
                                                    <div style={{ padding: '24px' }}>
                                                        {test.has_attempted ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                <button className="ghost-btn" onClick={() => onViewLeaderboard(test)} style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#818cf8', fontWeight: '700' }}>
                                                                    <Trophy size={18} /> View Leaderboard
                                                                </button>
                                                                {test.is_ended && (
                                                                    <button className="primary-btn" onClick={() => onReviewTest(test)} style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                        <Trophy size={18} /> Review Answers
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button className={isEarly ? "ghost-btn" : "primary-btn"} onClick={() => initiateExam(test)} disabled={loadingQ || isEarly} style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: isEarly ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #ef4444, #b91c1c)', cursor: isEarly ? 'not-allowed' : 'pointer', opacity: isEarly ? 0.7 : 1 }}>
                                                                {isEarly ? <><Clock size={18} /> Starts at {startTime.toLocaleTimeString([], { timeStyle: 'short' })}</> : <><Shield size={18} /> Start Proctored Exam</>}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {examTests.length === 0 && (
                        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderStyle: 'dashed', opacity: 0.6 }}>
                            <Shield size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px', display: 'block' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No proctored exams scheduled yet.</p>
                            {user?.is_admin && <p style={{ color: '#8b5cf6', fontSize: '0.85rem', marginTop: '6px' }}>Admin: mark a test as "Exam Test" in the Admin Panel to schedule it here.</p>}
                        </div>
                    )}
                </>
            )
            }

            {/* Registration Modal */}
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

                                <button type="submit" disabled={loadingQ} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', fontWeight: '700', fontSize: '16px', cursor: loadingQ ? 'not-allowed' : 'pointer', opacity: loadingQ ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    {loadingQ ? <Clock size={18} className="spin" /> : <Shield size={18} />}
                                    {loadingQ ? 'Starting...' : 'Confirm & Start Exam'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
