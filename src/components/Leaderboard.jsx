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

export default function Leaderboard({ slug, testName, userResult, onHome, onReview, user }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const fetchBoard = async () => {
        try {
            const res = await fetch(`${API_BASE}/tests/${slug}/leaderboard/`);
            const d = await res.json();
            setData(d);
        } catch { }
        setLoading(false);
    };

    useEffect(() => {
        fetchBoard();
        intervalRef.current = setInterval(fetchBoard, 30000); // refresh every 30s
        return () => clearInterval(intervalRef.current);
    }, [slug]);

    const entries = data?.entries || [];
    // Find user's actual result from leaderboard entries (backend data)
    const username = userResult?.username || user?.username;
    const userEntry = username ? entries.find(e => e.username === username) : null;
    const userRank = userEntry ? entries.findIndex(e => e.username === username) + 1 : null;
    
    // Debug logging
    useEffect(() => {
        if (data) {
            console.log('Leaderboard Debug:', {
                username,
                hasUserEntry: !!userEntry,
                userRank,
                isEnded: data?.is_ended,
                entriesCount: entries.length,
                userResultUsername: userResult?.username,
                userUsername: user?.username,
                firstEntry: entries[0]?.username
            });
        }
    }, [data, userEntry, username]);
    
    // Debug logging
    useEffect(() => {
        console.log('Leaderboard Debug:', {
            username,
            hasUserEntry: !!userEntry,
            userRank,
            isEnded: data?.is_ended,
            entriesCount: entries.length,
            userResultUsername: userResult?.username,
            userUsername: user?.username
        });
    }, [data, userEntry, username]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Trophy size={56} color="#f59e0b" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '6px' }}>Leaderboard</h1>
                <div style={{ fontWeight: '700', color: '#8b5cf6', fontSize: '1.1rem', marginBottom: '8px' }}>{testName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
                    {entries.length} {entries.length === 1 ? 'participant' : 'participants'}
                </div>
            </motion.div>

            {/* User's own result callout */}
            {userEntry && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px', borderLeft: '4px solid #8b5cf6', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '2rem' }}>{userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : '🎯'}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '4px' }}>Your Result</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span>🎯 {userEntry.score || 0}/{userEntry.total || 0}</span>
                            <span>📊 {userEntry.percentage || 0}%</span>
                            <span>⏱ {formatTime(userEntry.time_taken)}</span>
                            {userRank ? <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>Rank #{userRank}</span> : null}
                        </div>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: '900', color: (userEntry.percentage || 0) >= 70 ? '#10b981' : '#f59e0b' }}>
                        {userEntry.percentage || 0}%
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
                            {[1, 0, 2].map((posIndex, idx) => {
                                const entry = entries[posIndex];
                                if (!entry) return null;
                                const rank = posIndex + 1;
                                const style = RANK_STYLES[posIndex];
                                const isCurrentUser = userResult && entry.username === userResult.username;
                                const heights = ['220px', '260px', '200px']; // 2nd, 1st, 3rd (in display order left to right)

                                return (
                                    <motion.div key={`podium-${entry.username}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15, delay: idx * 0.1 }}
                                        style={{
                                            width: '140px',
                                            height: heights[idx],
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

                                                        <div style={{ fontWeight: '800', textAlign: 'center', fontSize: '14px', color: isCurrentUser ? '#a78bfa' : 'white', wordBreak: 'break-word', lineHeight: '1.3', marginTop: 'auto' }}>
                                            {entry.display_name || entry.username}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Table Format */}
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginTop: '40px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(139,92,246,0.1)', borderBottom: '2px solid rgba(139,92,246,0.3)' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', width: '80px' }}>Rank</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enrollment No</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', width: '120px' }}>Correct Ans</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', width: '120px' }}>Time Taken</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)', width: '100px' }}>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Show user's result first if they participated */}
                                {userEntry && (
                                    <>
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -12 }} 
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ 
                                                background: 'rgba(139,92,246,0.2)',
                                                borderLeft: '4px solid #8b5cf6',
                                                borderBottom: '1px solid rgba(139,92,246,0.4)'
                                            }}
                                        >
                                            <td style={{ padding: '16px 20px', fontWeight: '800', fontSize: '0.95rem', color: '#a78bfa' }}>
                                                {userRank <= 3 ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>{userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : '🥉'}</span>
                                                        <span>{userRank}</span>
                                                    </span>
                                                ) : userRank}
                                            </td>
                                            <td style={{ padding: '16px 20px', fontWeight: '800', color: '#a78bfa' }}>
                                                {userEntry.display_name || userEntry.username}
                                                <span style={{ marginLeft: '10px', fontSize: '10px', background: 'rgba(139,92,246,0.4)', color: 'white', padding: '3px 8px', borderRadius: '10px', fontWeight: '700' }}>YOUR RESULT</span>
                                            </td>
                                            <td style={{ padding: '16px 20px', color: '#a78bfa', fontSize: '0.9rem' }}>
                                                {userEntry.enrollment_number || '—'}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800', fontSize: '1rem' }}>
                                                <span style={{ color: userEntry.percentage >= 80 ? '#10b981' : userEntry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                                    {userEntry.score}
                                                </span>
                                                <span style={{ color: '#a78bfa', fontWeight: '400' }}>/{userEntry.total}</span>
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', color: '#a78bfa', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '600' }}>
                                                {formatTime(userEntry.time_taken)}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '900', fontSize: '1.1rem', color: userEntry.percentage >= 80 ? '#10b981' : userEntry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                                {userEntry.percentage}%
                                            </td>
                                        </motion.tr>
                                        {/* Spacing row */}
                                        <tr style={{ height: '2px', background: 'rgba(139,92,246,0.2)' }}></tr>
                                    </>
                                )}
                                
                                {/* All rankings */}
                                {entries.map((entry, idx) => {
                                    const rank = idx + 1;
                                    const isCurrentUser = userEntry && entry.username === userEntry.username;
                                    const isPodium = rank <= 3;
                                    
                                    return (
                                        <motion.tr 
                                            key={`${entry.username}-${idx}`}
                                            initial={{ opacity: 0, x: -12 }} 
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                                            style={{ 
                                                background: isCurrentUser ? 'rgba(139,92,246,0.08)' : idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                borderLeft: '4px solid transparent',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                                            }}
                                        >
                                            <td style={{ padding: '14px 20px', fontWeight: '700', fontSize: '0.95rem', color: isPodium ? '#f59e0b' : 'var(--text-secondary)' }}>
                                                {isPodium ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
                                                        <span>{rank}</span>
                                                    </span>
                                                ) : rank}
                                            </td>
                                            <td style={{ padding: '14px 20px', fontWeight: isCurrentUser ? '700' : '600', color: isCurrentUser ? '#a78bfa' : 'white' }}>
                                                {entry.display_name || entry.username}
                                            </td>
                                            <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {entry.enrollment_number || '—'}
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>
                                                <span style={{ color: entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                                    {entry.score}
                                                </span>
                                                <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>/{entry.total}</span>
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                                {formatTime(entry.time_taken)}
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: entry.percentage >= 80 ? '#10b981' : entry.percentage >= 60 ? '#f59e0b' : '#f87171' }}>
                                                {entry.percentage}%
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Actions */}
            <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onHome}
                    className="ghost-btn" style={{ padding: '14px 40px', fontSize: '15px' }}>
                    <ArrowLeft size={16} /> Back to Hub
                </motion.button>
                {userEntry && data?.is_ended && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onReview}
                        className="primary-btn" style={{ padding: '14px 40px', fontSize: '15px' }}>
                        <Target size={16} /> Review Answers
                    </motion.button>
                )}
            </div>
        </div>
    );
}
