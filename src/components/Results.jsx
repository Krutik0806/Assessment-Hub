import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, CheckCircle2, XCircle, RotateCcw, ListChecks, Award, BookOpen } from 'lucide-react';

export default function Results({ results, onHome }) {
    const { correct, wrong, skipped, total, userAnswers, testData, isPractice } = results;
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 70;

    const [showReview, setShowReview] = useState(false);

    if (showReview) {
        return (
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><ListChecks size={24} /> Answers Review</h2>
                    <button className="ghost-btn" onClick={() => setShowReview(false)}>
                        <RotateCcw size={18} /> Back to Score
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {testData.questions.map((q, i) => {
                        // Safety check: skip if question data is incomplete
                        if (!q || !q.options || !Array.isArray(q.answer)) {
                            console.warn(`Question ${i + 1} has incomplete data:`, q);
                            return null;
                        }
                        
                        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                        const sel = userAnswers[i] || [];

                        let isCorrect = false;
                        if (sel.length > 0) {
                            const sortedSel = [...sel].sort();
                            const sortedAns = [...q.answer].sort();
                            isCorrect = JSON.stringify(sortedSel) === JSON.stringify(sortedAns);
                        }
                        const isSkipped = sel.length === 0;

                        const correctLabels = q.answer.map(ai => `${letters[ai]}. ${q.options[ai]}`).join('\n');
                        const userLabels = sel.length > 0 ? sel.map(si => `${letters[si]}. ${q.options[si]}`).join('\n') : 'Skipped';

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel"
                                style={{
                                    padding: '24px',
                                    borderLeft: `4px solid ${isSkipped ? 'var(--text-secondary)' : (isCorrect ? 'var(--success)' : 'var(--danger)')}`
                                }}
                            >
                                <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Question {i + 1} {isSkipped ? '(Skipped)' : (isCorrect ? '(Correct)' : '(Incorrect)')}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', lineHeight: '1.5' }}>{q.question}</h3>

                                {q.image && <img src={'../' + q.image} alt="Reference" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', marginBottom: '16px' }} />}

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '8px' }}>Correct Answer</div>
                                        <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{correctLabels}</div>
                                    </div>

                                    {!isSkipped && (
                                        <div style={{ background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                                            <div style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', marginBottom: '8px' }}>Your Selection</div>
                                            <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{userLabels}</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}>Explanation</div>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{q.explanation}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', flex: 1 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '48px', maxWidth: '600px', width: '100%', textAlign: 'center' }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    style={{ color: passed ? '#a78bfa' : '#06b6d4', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
                >
                    {passed ? <Award size={64} /> : <BookOpen size={64} />}
                </motion.div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{passed ? 'Great Job!' : 'Keep Practicing!'}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
                    {passed ? 'You successfully passed the test. Excellent.' : 'Review your answers below to see where you can improve.'}
                </p>

                {/* Circular Progress (conceptual) */}
                <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 40px' }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <motion.circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke={passed ? "url(#scoreGrad)" : "var(--danger)"}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="440"
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * (pct / 100)) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
                        />
                        <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2rem', fontWeight: '800' }}>{pct}%</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{correct} / {total}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{correct}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correct</div>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{wrong}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wrong</div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{skipped}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Skipped</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="ghost-btn" onClick={onHome} style={{ flex: 1, justifyContent: 'center' }}>
                        <HomeIcon size={18} /> Home
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="primary-btn" onClick={() => setShowReview(true)} style={{ flex: 2, justifyContent: 'center' }}>
                        <ListChecks size={18} /> Review Answers
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
}
