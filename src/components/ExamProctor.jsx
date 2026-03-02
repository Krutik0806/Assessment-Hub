import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XOctagon, Maximize } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const authFetch = (path, opts = {}) => {
    const token = localStorage.getItem('csa_access');
    return fetch(`${API_BASE}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
};

export default function ExamProctor({ testId, slug, testName, children, onBanned, onQuit }) {
    const [phase, setPhase] = useState('entering'); // entering | fullscreen_req | active | warning1 | banned
    const [warnings, setWarnings] = useState(0);
    const [warningMessage, setWarningMessage] = useState('');
    const [autoBanEnabled, setAutoBanEnabled] = useState(true);
    const violationInFlight = useRef(false);

    // Request fullscreen on mount
    useEffect(() => {
        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
        if (req) {
            req.call(el).then(() => setPhase('active')).catch(() => setPhase('active'));
        } else {
            setPhase('active');
        }

        return () => {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
        };
    }, []);

    const sendViolation = useCallback(async () => {
        if (violationInFlight.current) return;
        violationInFlight.current = true;
        try {
            const res = await authFetch('/exam/warn/', {
                method: 'POST',
                body: JSON.stringify({ test_id: testId }),
            });
            const data = await res.json();
            if (data.banned) {
                setPhase('banned');
                setWarningMessage(data.message || 'You are banned from this exam.');
                onBanned?.();
            } else {
                setWarnings(data.warnings);
                setWarningMessage(data.message || 'Warning: Do not switch tabs!');
                setAutoBanEnabled(data.auto_ban_enabled !== false);
                setPhase('warning1');
            }
        } catch (e) { console.error(e); }
        violationInFlight.current = false;
    }, [testId, onBanned]);

    // Tab switch / blur detection
    useEffect(() => {
        if (phase !== 'active') return;

        const onVisibilityChange = () => {
            if (document.hidden) sendViolation();
        };
        const onBlur = () => sendViolation();
        const onFullscreenChange = () => {
            if (!document.fullscreenElement) sendViolation();
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('blur', onBlur);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('blur', onBlur);
            document.removeEventListener('fullscreenchange', onFullscreenChange);
        };
    }, [phase, sendViolation]);

    const resumeExam = () => {
        // Try to re-enter fullscreen
        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen;
        if (req) req.call(el).catch(() => { });
        setPhase('active');
    };

    if (phase === 'entering') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px', background: '#0a0a0f' }}>
                <Maximize size={48} color="#8b5cf6" />
                <h2 style={{ color: 'white', fontSize: '1.5rem' }}>Entering Fullscreen...</h2>
                <p style={{ color: '#9ca3af' }}>Please allow fullscreen for the proctored exam.</p>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* The actual quiz content */}
            {children}

            {/* ── Warning 1 Overlay ── */}
            <AnimatePresence>
                {phase === 'warning1' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
                            style={{ background: 'linear-gradient(135deg, #1f1435, #1a0a0a)', border: '2px solid #f59e0b', borderRadius: '20px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
                            <AlertTriangle size={56} color="#f59e0b" style={{ margin: '0 auto 20px', display: 'block' }} />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '12px', color: '#f59e0b' }}>⚠️ Warning {warnings}{autoBanEnabled ? '/3' : ''}</h2>
                            <p style={{ color: '#e5e7eb', fontSize: '1rem', lineHeight: '1.6', marginBottom: '8px' }}>
                                You switched tabs or left the exam window.
                            </p>
                            <p style={{ color: autoBanEnabled ? '#f87171' : '#fbbf24', fontWeight: '700', marginBottom: '32px' }}>
                                {warningMessage}
                            </p>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                onClick={resumeExam}
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'black', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
                                I Understand — Return to Exam
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Banned Overlay ── */}
            <AnimatePresence>
                {phase === 'banned' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                            style={{ background: 'linear-gradient(135deg, #1a0505, #0a0a0f)', border: '2px solid #ef4444', borderRadius: '20px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
                            <XOctagon size={64} color="#ef4444" style={{ margin: '0 auto 20px', display: 'block' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#ef4444', marginBottom: '16px' }}>Access Revoked</h2>
                            <p style={{ color: '#e5e7eb', fontSize: '1rem', lineHeight: '1.6', marginBottom: '8px' }}>
                                You left the exam window a second time. Your session has been <strong style={{ color: '#ef4444' }}>terminated</strong>.
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '32px' }}>
                                Contact your administrator to request access. You cannot re-enter this exam without admin approval.
                            </p>
                            <button onClick={onQuit}
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
                                Exit
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
