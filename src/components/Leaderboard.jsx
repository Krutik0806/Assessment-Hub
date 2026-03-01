import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, ArrowLeft, Clock, Target } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const RANK_STYLES = [
    { bg: 'linear-gradient(135deg,#fcd34d,#fbbf24)', color: '#fbbf24', emoji: '🥇' },
    { bg: 'linear-gradient(135deg,#e5e7eb,#9ca3af)', color: '#9ca3af', emoji: '🥈' },
    { bg: 'linear-gradient(135deg,#f87171,#b45309)', color: '#b45309', emoji: '🥉' },
];

function formatTime(seconds) {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function Leaderboard({ slug, testName, userResult, onHome, onReview }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const intervalRef = useRef(null);

    const fetchBoard = async () => {
        try {
            const res = await fetch(`${API_BASE}/tests/${slug}/leaderboard/`);
            const d = await res.json();
            setData(d);
            setLastUpdated(new Date());
        } catch { }
        setLoading(false);
    };

    useEffect(() => {
        fetchBoard();
        intervalRef.current = setInterval(fetchBoard, 10000); // refresh every 10s
        return () => clearInterval(intervalRef.current);
    }, [slug]);

    const entries = data?.entries || [];
    const userRank = userResult ? entries.findIndex(e => e.username === userResult.username) + 1 : null;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Trophy size={56} color="#f59e0b" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '6px' }}>Leaderboard</h1>
                <div style={{ fontWeight: '700', color: '#8b5cf6', fontSize: '1.1rem', marginBottom: '8px' }}>{testName}</div>
                {lastUpdated && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                        <RefreshCw size={12} /> Live · updates every 10s · last {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
            </motion.div>

            {/* User's own result callout */}
            {userResult && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px', borderLeft: '4px solid #8b5cf6', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '2rem' }}>{userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : '🎯'}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '4px' }}>Your Result</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span>🎯 {userResult.score || 0}/{userResult.total || 0}</span>
                            <span>📊 {userResult.percentage || 0}%</span>
                            <span>⏱ {formatTime(userResult.time_taken)}</span>
                            {userRank ? <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Rank #{userRank}</span> : null}
                        </div>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: '900', color: (userResult.percentage || 0) >= 70 ? '#10b981' : '#f59e0b' }}>
                        {userResult.percentage || 0}%
                    </div>
                </motion.div>
            )}

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    Loading leaderboard...
                </div>
            ) : entries.length === 0 ? (
                <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', opacity: 0.7 }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No exam submissions yet. Be the first! 🚀</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    {entries.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
                            {[1, 0, 2].map(posIndex => {
                                const entry = entries[posIndex];
                                if (!entry) return null;
                                const rank = posIndex + 1;
                                const style = RANK_STYLES[posIndex];
                                const isCurrentUser = userResult && entry.username === userResult.username;
                                const heights = ['220px', '260px', '200px']; // rank 2, 1, 3 heights

                                return (
                                    <motion.div key={`podium-${entry.username}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15, delay: posIndex * 0.1 }}
                                        style={{
                                            width: '140px',
                                            height: heights[posIndex],
                                            background: isCurrentUser ? `linear-gradient(to top, rgba(139,92,246,0.3), rgba(139,92,246,0.05))` : `linear-gradient(to top, ${style.color}20, rgba(255,255,255,0.02))`,
                                            borderRadius: '20px 20px 0 0',
                                            borderTop: `4px solid ${style.color}`,
                                            borderLeft: '1px solid rgba(255,255,255,0.05)',
                                            borderRight: '1px solid rgba(255,255,255,0.05)',
                                            position: 'relative',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '24px 12px',
                                            boxShadow: `0 -10px 40px -10px ${style.color}40`
                                        }}>

                                        {/* Avatar */}
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: `0 4px 16px ${style.color}60`, border: '3px solid rgba(255,255,255,0.2)', marginBottom: '16px', zIndex: 2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                            {style.emoji}
                                        </div>

                                        <div style={{ fontWeight: '800', textAlign: 'center', fontSize: '15px', color: isCurrentUser ? '#a78bfa' : 'white', wordBreak: 'break-all', lineHeight: '1.2' }}>
                                            {entry.username}
                                        </div>

                                        <div style={{ marginTop: 'auto', textAlign: 'center', width: '100%' }}>
                                            <div style={{ fontWeight: '900', fontSize: '1.4rem', color: entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                                {entry.percentage}%
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: '2px 0', borderRadius: '4px', marginTop: '4px' }}>
                                                ⏱ {formatTime(entry.time_taken)}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Remaining List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {entries.slice(3).map((entry, idx) => {
                            const i = idx + 3;
                            const rank = i + 1;
                            const isCurrentUser = userResult && entry.username === userResult.username;
                            return (
                                <motion.div key={`${entry.username}-${i}`}
                                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: Math.min(i * 0.04, 0.5) }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '16px 20px', borderRadius: '16px', background: isCurrentUser ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isCurrentUser ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                                    {/* Rank badge */}
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: '#9ca3af', flexShrink: 0 }}>
                                        {rank}
                                    </div>
                                    {/* Name */}
                                    <div style={{ flex: 1, fontWeight: isCurrentUser ? '800' : '600', color: isCurrentUser ? '#a78bfa' : 'white' }}>
                                        {entry.username}
                                        {isCurrentUser && <span style={{ marginLeft: '8px', fontSize: '11px', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: '10px' }}>You</span>}
                                    </div>
                                    {/* Score */}
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.05rem', color: entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                            {entry.percentage}%
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <span>{entry.score}/{entry.total}</span>
                                            {entry.time_taken > 0 && <span>⏱ {formatTime(entry.time_taken)}</span>}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Actions */}
            <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onHome}
                    className="ghost-btn" style={{ padding: '14px 40px', fontSize: '15px' }}>
                    <ArrowLeft size={16} /> Back to Hub
                </motion.button>
                {userResult && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onReview}
                        className="primary-btn" style={{ padding: '14px 40px', fontSize: '15px' }}>
                        <Target size={16} /> Review Answers
                    </motion.button>
                )}
            </div>
        </div>
    );
}
