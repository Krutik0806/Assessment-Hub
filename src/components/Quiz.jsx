import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';

export default function Quiz({ testData, mode, onFinish, onQuit, user, submitting = false }) {
    const isPractice = mode === 'practice';
    const questions = testData?.questions || [];
    const totalQ = questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(totalQ).fill(null));
    const [lockedIn, setLockedIn] = useState(Array(totalQ).fill(false));
    const [correctArr, setCorrectArr] = useState(Array(totalQ).fill(null));

    // Timer configuration based on admin settings
    const durationSeconds = testData?.duration_minutes ? testData.duration_minutes * 60 : 60 * 60;
    const [timeLeft, setTimeLeft] = useState(durationSeconds);

    useEffect(() => {
        if (isPractice) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    finishTest();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isPractice]);

    const finishTest = () => {
        let correct = 0, wrong = 0, skipped = 0;

        if (!isPractice) {
            questions.forEach((q, i) => {
                const sel = userAnswers[i] || [];
                if (sel.length === 0) skipped++;
                else {
                    const sortedSel = [...sel].sort();
                    const sortedAns = [...q.answer].sort();
                    if (JSON.stringify(sortedSel) === JSON.stringify(sortedAns)) {
                        correct++;
                    } else {
                        wrong++;
                    }
                }
            });
        } else {
            correct = correctArr.filter(x => x === true).length;
            wrong = correctArr.filter(x => x === false).length;
            skipped = totalQ - correct - wrong;
        }

        const time_taken = durationSeconds - timeLeft;
        onFinish({ correct, wrong, skipped, total: totalQ, userAnswers, testData, isPractice, time_taken });
    };

    const handleOptionClick = (optIdx) => {
        const q = questions[currentIndex];
        let currentSel = userAnswers[currentIndex] || [];

        if (isPractice) {
            if (q.multi) {
                if (currentSel.includes(optIdx)) currentSel = currentSel.filter(x => x !== optIdx);
                else currentSel = [...currentSel, optIdx];

                updateAnswer(currentSel);
                // Auto-submit if exact number of required options are selected
                if (currentSel.length === q.answer.length) {
                    submitPracticeAnswer(currentSel);
                }
            } else {
                submitPracticeAnswer([optIdx]);
            }
        } else {
            // Exam mode
            if (currentSel.includes(optIdx)) currentSel = currentSel.filter(x => x !== optIdx);
            else {
                if (!q.multi) currentSel = [optIdx];
                else currentSel = [...currentSel, optIdx];
            }
            updateAnswer(currentSel);
        }
    };

    const updateAnswer = (sel) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentIndex] = sel;
        setUserAnswers(newAnswers);
    };

    const submitPracticeAnswer = (sel) => {
        const q = questions[currentIndex];
        const sortedSel = [...sel].sort();
        const sortedAns = [...q.answer].sort();
        const isCorrect = JSON.stringify(sortedSel) === JSON.stringify(sortedAns);

        const newLocked = [...lockedIn];
        newLocked[currentIndex] = true;
        setLockedIn(newLocked);

        const newCorrect = [...correctArr];
        newCorrect[currentIndex] = isCorrect;
        setCorrectArr(newCorrect);

        updateAnswer(sel);
    };

    const navigate = (dir) => {
        const next = currentIndex + dir;
        if (next >= 0 && next < totalQ) setCurrentIndex(next);
    };

    const q = questions[currentIndex];
    const isLocked = lockedIn[currentIndex];
    const currentSel = userAnswers[currentIndex] || [];

    const answeredCount = userAnswers.filter(a => a !== null && a.length > 0).length;

    return (
        <div className="quiz-container">
            {/* Quiz Area */}
            <section className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ color: 'var(--accent-base)', fontWeight: '600' }}>Question {currentIndex + 1} of {totalQ}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {q.multi && (
                            <span style={{ fontSize: '12px', background: 'rgba(167, 139, 250, 0.2)', padding: '4px 10px', borderRadius: '100px', color: 'var(--accent-base)' }}>
                                Select {q.answer.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Bar under header */}
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '32px', overflow: 'hidden' }}>
                    <motion.div
                        style={{ height: '100%', background: 'var(--accent-gradient)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(answeredCount / totalQ) * 100}%` }}
                    />
                </div>

                {/* Question Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 style={{ fontSize: '1.4rem', lineHeight: '1.5', marginBottom: '24px' }}>{q.question}</h2>

                        {q.image && (
                            <img src={'/' + q.image} alt="Ref" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '24px' }} />
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {q.options.map((opt, i) => {
                                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                                const isSelected = currentSel.includes(i);

                                let btnStateClass = '';
                                if (isLocked) {
                                    if (q.answer.includes(i)) btnStateClass = 'correct';
                                    else if (isSelected) btnStateClass = 'wrong';
                                } else if (isSelected) {
                                    btnStateClass = 'selected';
                                }

                                return (
                                    <motion.button
                                        key={i}
                                        disabled={isLocked}
                                        whileHover={!isLocked ? { scale: 1.01 } : {}}
                                        whileTap={!isLocked ? { scale: 0.99 } : {}}
                                        className={`option-btn ${btnStateClass}`}
                                        onClick={() => handleOptionClick(i)}
                                    >
                                        <div className="option-letter">{letters[i]}</div>
                                        <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
                                        {isLocked && q.answer.includes(i) && <CheckCircle2 size={18} color="white" />}
                                        {isLocked && !q.answer.includes(i) && isSelected && <XCircle size={18} color="white" />}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {isPractice && isLocked && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        background: correctArr[currentIndex] ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        border: `1px solid ${correctArr[currentIndex] ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                        marginBottom: '32px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: correctArr[currentIndex] ? 'var(--success)' : 'var(--danger)' }}>
                                        <Info size={18} />
                                        {correctArr[currentIndex] ? 'Correct!' : 'Incorrect'}
                                    </div>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{q.explanation}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                    <button className="ghost-btn" onClick={() => navigate(-1)} disabled={currentIndex === 0}>
                        <ArrowLeft size={16} /> Previous
                    </button>

                    <button className="primary-btn" onClick={() => currentIndex === totalQ - 1 ? finishTest() : navigate(1)} disabled={submitting && currentIndex === totalQ - 1}>
                        {currentIndex === totalQ - 1 ? (submitting ? 'Submitting...' : 'Finish Test') : 'Next'} <ArrowRight size={16} />
                    </button>
                </div>

            </section>

            {/* Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HelpCircle size={18} /> Test Status
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Answered</span>
                        <span style={{ fontWeight: 'bold' }}>{answeredCount} / {totalQ}</span>
                    </div>

                    {!isPractice && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', color: timeLeft < 300 ? 'var(--danger)' : 'var(--text-primary)' }}>
                            <span>Time Left</span>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    )}

                    <button className="ghost-btn" style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }} onClick={onQuit}>
                        Quit Test
                    </button>
                </div>

                {/* Question Map */}
                <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Question Map</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                        {questions.map((_, i) => {
                            let bg = 'rgba(255,255,255,0.05)';
                            let border = 'transparent';

                            if (i === currentIndex) {
                                border = 'var(--accent-base)';
                                bg = 'rgba(167, 139, 250, 0.1)';
                            } else if (isPractice) {
                                if (correctArr[i] === true) bg = 'var(--success)';
                                else if (correctArr[i] === false) bg = 'var(--danger)';
                            } else if (userAnswers[i] && userAnswers[i].length > 0) {
                                bg = 'var(--accent-base)';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '8px',
                                        border: `1px solid ${border}`,
                                        background: bg,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        fontWeight: i === currentIndex ? 'bold' : 'normal'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    );
}
