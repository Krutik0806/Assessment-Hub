import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff } from 'lucide-react';
// import { useGoogleLogin } from '@react-oauth/google';  // TEMPORARILY DISABLED
import { authApi, getCaptchaToken } from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname.includes('onrender.com') 
    ? 'https://assessment-hub-backend.onrender.com/api'
    : 'http://127.0.0.1:8000/api');

export default function AuthPage({ onAuthSuccess }) {
    // const [mode, setMode] = useState('login');  // TEMPORARILY DISABLED - login only
    const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [googleLoading, setGoogleLoading] = useState(false);  // TEMPORARILY DISABLED
    const [showPw, setShowPw] = useState(false);

    const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    // ── Google Sign-In ────────────────────────────────────────────────────────────
    // TEMPORARILY DISABLED - using hardcoded student authentication only
    // The implicit flow gives us an access_token. We fetch the user's info from
    // Google's userinfo endpoint, then relay email+sub to our Django backend.
    /* const triggerGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            setError('');
            try {
                // Step 1: Get reCAPTCHA token
                const captchaToken = await getCaptchaToken('google_login');
                if (!captchaToken) {
                    throw new Error('Security verification failed. Please refresh and try again.');
                }
                
                // Step 2: Get user info from Google using the access token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (!userInfoRes.ok) throw new Error('Failed to fetch Google user info');
                const userInfo = await userInfoRes.json();

                // Step 3: Exchange with our Django backend
                const res = await fetch(`${API_BASE}/auth/google/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                        google_sub: userInfo.sub,
                        captcha_token: captchaToken,
                    }),
                });
                const data = await res.json();
                if (!res.ok) {
                    const errorMsg = data.detail || data.error || 'Backend error';
                    throw new Error(errorMsg);
                }

                // Step 4: Save tokens & log in
                saveTokens(data.access, data.refresh);
                onAuthSuccess(data.user);
            } catch (err) {
                console.error('⚠️ Google sign-in failed:', err);
                setError(`Google sign-in failed: ${err.message}`);
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: (err) => {
            console.error('Google OAuth error:', err);
            setError('Google sign-in was cancelled or blocked by your browser.');
        },
    }); */

    // ── Username / Password ────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Get reCAPTCHA token (optional - backend allows login even if this fails)
            const captchaToken = await getCaptchaToken('login');
            
            // Login with email and enrollment number
            await authApi.login(form.username, form.password, captchaToken);
            const user = await authApi.me();
            onAuthSuccess(user);
        } catch (err) {
            let msg = err.message || 'Something went wrong.';
            try {
                const parsed = JSON.parse(msg);
                msg = Object.values(parsed).flat().join(' ');
            } catch {
                // msg is already set, JSON parse failed
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-light)',
        color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '10vh', display: 'flex', alignItems: 'center', padding: '10px 24px', gap: '80px', flexWrap: 'wrap' }}>

            {/* ── Left Side: Landing Content ── */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: '64px', marginBottom: '10px', filter: 'drop-shadow(0 4px 12px rgba(139,92,246,0.3))' }}
                >
                    🎯
                </motion.div>
                <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '10px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.1', letterSpacing: '-0.03em' }}>
                    Assessment<br />Hub
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '30px', lineHeight: '1.6', maxWidth: '540px' }}>
                    The ultimate testing environment. Master your subjects with extensive practice, prove your skills in strictly proctored exams, and climb the global leaderboards.
                </p>

                <motion.div
                    initial="hidden" animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', paddingRight: '20px' }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '24px', background: 'rgba(139,92,246,0.03)', borderTop: '2px solid #8b5cf6', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '100px', opacity: 0.05, transform: 'rotate(15deg)' }}>📊</div>
                        <div style={{ fontSize: '28px', marginBottom: '14px', filter: 'drop-shadow(0 2px 8px rgba(139,92,246,0.4))' }}>📊</div>
                        <h3 style={{ fontWeight: '800', marginBottom: '8px', fontSize: '1.1rem' }}>Deep Analytics</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Detailed insights and breakdowns into your performance across all attempted practice tests.</p>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '24px', background: 'rgba(239,68,68,0.03)', borderTop: '2px solid #ef4444', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '100px', opacity: 0.05, transform: 'rotate(-10deg)' }}>🛡️</div>
                        <div style={{ fontSize: '28px', marginBottom: '14px', filter: 'drop-shadow(0 2px 8px rgba(239,68,68,0.4))' }}>🛡️</div>
                        <h3 style={{ fontWeight: '800', marginBottom: '8px', fontSize: '1.1rem' }}>Proctored Exams</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Secure, fullscreen testing environments with strict tab-monitoring to ensure integrity.</p>
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '24px', background: 'rgba(16,185,129,0.03)', borderTop: '2px solid #10b981', position: 'relative', overflow: 'hidden', gridColumn: '1 / -1' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '10px', fontSize: '120px', opacity: 0.05, transform: 'rotate(20deg)' }}>🏆</div>
                        <div style={{ fontSize: '28px', marginBottom: '14px', filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.4))' }}>🏆</div>
                        <h3 style={{ fontWeight: '800', marginBottom: '8px', fontSize: '1.1rem' }}>Global Live Leaderboards</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Compete with peers in real-time. Climb the global ranks by prioritizing speed, accuracy, and consistency across all your assessment submisssions!</p>
                    </motion.div>
                </motion.div>

                {/* Contact Admin Block */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginTop: '30px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚀 <span style={{ fontWeight: '500' }}>Wanna host your own assessment?</span>
                        Contact Admin: <a href="mailto:chamthakrutik4@gmail.com" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Krutik <span style={{ fontSize: '12px' }}>↗</span>
                        </a>
                    </p>
                </motion.div>
            </motion.div>

            {/* ── Right Side: Auth Form ── */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ flex: '1 1 400px', maxWidth: '480px', margin: '0 auto', width: '100%' }}
            >
                {/* Fun Header Above Login */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '12px' }}
                >
                    <h3 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700', 
                        background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        Aur karo login....
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Authorized students & faculty only
                    </p>
                </motion.div>

                <div className="glass-panel" style={{ padding: '36px 40px', width: '100%' }}>
                    {/* Form Header */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: '800' }}>
                            Student Login
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Enter your email and enrollment number
                        </p>
                    </div>

                    {/* TEMPORARILY DISABLED: Google Sign-In and Registration */}
                    {/* ── Google Button ─────────────────────────────────────────────────────── */}
                    {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setError(''); triggerGoogle(); }}
                        disabled={googleLoading}
                        style={{
                            width: '100%', padding: '13px 20px', borderRadius: '12px',
                            background: 'white', color: '#1f1f1f', border: 'none',
                            cursor: googleLoading ? 'not-allowed' : 'pointer',
                            fontWeight: '600', fontSize: '15px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            marginBottom: '20px', opacity: googleLoading ? 0.7 : 1,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {googleLoading ? (
                            <div style={{ width: '20px', height: '20px', border: '2px solid #ddd', borderTop: '2px solid #4285F4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path d="M19.764 10.205c0-.693-.063-1.36-.18-2H10v3.785h5.49c-.237 1.24-.955 2.29-2.034 2.994v2.49h3.294c1.928-1.775 3.014-4.393 3.014-7.27z" fill="#4285F4" />
                                <path d="M10 20c2.755 0 5.065-.912 6.754-2.476l-3.294-2.49c-.912.61-2.08.97-3.46.97-2.66 0-4.914-1.797-5.72-4.213H.875v2.566C2.555 17.746 6.04 20 10 20z" fill="#34A853" />
                                <path d="M4.28 11.79C4.077 11.18 3.963 10.53 3.963 9.86s.114-1.32.317-1.93V5.364H.875A9.975 9.975 0 000 9.86c0 1.61.385 3.13 1.072 4.496l3.208-2.566z" fill="#FBBC05" />
                                <path d="M10 3.907c1.497 0 2.84.516 3.896 1.527l2.922-2.922C14.918.994 12.608 0 10 0 6.04 0 2.555 2.254.875 5.364L4.28 7.93C5.086 5.513 7.34 3.907 10 3.907z" fill="#EA4335" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </motion.button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style> */}

                    {/* Divider */}
                    {/* <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                    </div> */}

                    {/* Mode switcher */}
                    {/* <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                        {['login', 'register'].map(m => (
                            <button key={m} onClick={() => { setMode(m); setError(''); }}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    fontWeight: '600', fontSize: '14px',
                                    background: mode === m ? 'var(--accent-gradient)' : 'transparent',
                                    color: mode === m ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s',
                                }}>
                                {m === 'login' ? '🔑 Login' : '✨ Register'}
                            </button>
                        ))}
                    </div> */}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Email Address</label>
                            <input value={form.username} onChange={update('username')} required placeholder="enrollment@paruluniversity.ac.in" type="email" style={inputStyle} />
                        </div>

                        {/* {mode === 'register' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Email</label>
                                <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" style={inputStyle} />
                            </div>
                        )} */}

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Enrollment Number (Password)</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')}
                                    required minLength={6} placeholder="Enter your enrollment number"
                                    style={{ ...inputStyle, paddingRight: '48px' }} />
                                <button type="button" onClick={() => setShowPw(s => !s)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* {mode === 'register' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>Confirm Password</label>
                                <input type="password" value={form.password2} onChange={update('password2')} required placeholder="Repeat your password" style={inputStyle} />
                            </div>
                        )} */}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#f87171', fontSize: '14px' }}>
                                ⚠️ {error}
                            </motion.div>
                        )}

                        <motion.button type="submit" disabled={loading}
                            whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}
                            className="primary-btn"
                            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loading ? 'Please wait...' : (<><LogIn size={18} /> Sign In</>)}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
