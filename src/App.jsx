import { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import AuthPage from './components/AuthPage';
import AdminPage from './components/AdminPage';
import ExamProctor from './components/ExamProctor';
import Leaderboard from './components/Leaderboard';
import { authApi, getTokens, clearTokens } from './api';

export default function App() {
  const [view, setView] = useState('loading');
  const [activeTest, setActiveTest] = useState(null);
  const [testMode, setTestMode] = useState('practice');
  const [isExamTest, setIsExamTest] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const { access } = getTokens();
    if (access) {
      authApi.me()
        .then(u => { 
          console.log('App.jsx: User loaded from authApi.me():', u); 
          setUser(u); 
          setView('home'); 
        })
        .catch(() => { clearTokens(); setView('auth'); });
    } else {
      setView('auth');
    }
  }, []);

  const handleStartTest = (testId, slug, name, questions, mode, isExam = false, details = null) => {
    setActiveTest({ id: testId, slug, name, questions });
    setTestMode(mode);
    setIsExamTest(isExam);
    setCandidateDetails(details);
    // For proctored exams, load questions here if not already loaded
    if (questions.length === 0 && isExam) {
      const token = localStorage.getItem('csa_access');
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/tests/${slug}/questions/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then(r => r.json()).then(data => {
        if (Array.isArray(data)) {
          setActiveTest({ id: testId, slug, name, questions: data });
          setView('quiz');
        } else {
          alert(data.error || 'Failed to load questions');
        }
      });
    } else {
      setView('quiz');
    }
  };

  const handleFinishTest = async (results) => {
    if (submitting) return; // Prevent duplicate submissions
    setSubmitting(true);
    
    setQuizResults({ ...results, username: user?.username });

    // Build payload for backend
    const answers = results.testData.questions.map((q, i) => ({
      question_id: q.id,
      selected: results.userAnswers[i] || []
    }));

    try {
      const token = localStorage.getItem('csa_access');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/attempts/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          test_id: results.testData.id,
          mode: isExamTest ? 'exam' : 'practice',
          time_taken: results.time_taken || 0,
          answers,
          ...(candidateDetails || {})
        })
      });
      
      if (response.status === 429) {
        // Too many requests - duplicate submission
        console.warn('Duplicate submission prevented by server');
        setSubmitting(false);
        return;
      }
    } catch (e) {
      console.error('Failed to submit attempt:', e);
      setSubmitting(false);
      return;
    }

    if (isExamTest) {
      setView('leaderboard');
    } else {
      setView('results');
    }
    setSubmitting(false);
  };

  const goHome = () => {
    setView('home');
    setActiveTest(null);
    setCandidateDetails(null);
    setQuizResults(null);
    setIsExamTest(false);
  };

  const handleLogout = () => { authApi.logout(); setUser(null); setView('auth'); };

  if (view === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Restoring session...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {/* Hide navbar during exam (fullscreen) */}
      {view !== 'quiz' || !isExamTest ? (
        <nav className="navbar">
          <div className="nav-brand" onClick={user ? goHome : undefined} style={{ cursor: user ? 'pointer' : 'default' }}>
            <div className="nav-logo">🎯</div>
            <div>
              <div className="nav-title">Assessment Platform</div>
              <div className="nav-subtitle">Question Bank</div>
            </div>
          </div>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.is_admin && view !== 'admin' && (
                <button onClick={() => setView('admin')} style={{ padding: '7px 14px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  🛡️ Admin
                </button>
              )}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>👋 {user.username}</span>
              <button className="ghost-btn" onClick={handleLogout} style={{ padding: '7px 14px', fontSize: '13px' }}>Logout</button>
            </div>
          )}
        </nav>
      ) : null}

      {view === 'auth' && <AuthPage onAuthSuccess={(u) => { setUser(u); setView('home'); }} />}
      {view === 'home' && <Home 
        onStartTest={handleStartTest} 
        onViewLeaderboard={(test) => { setActiveTest(test); setView('leaderboard'); }} 
        onReviewTest={async (test) => {
          if (loadingReview) return;
          setLoadingReview(true);
          // Fetch user's latest exam attempt for this test
          const token = localStorage.getItem('csa_access');
          try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/attempts/`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const attempts = await res.json();
            console.log('📊 All attempts:', attempts);
            
            // Find most recent exam attempt for this test
            const testAttempt = attempts.find(a => a.test_slug === test.slug && a.mode === 'exam');
            console.log('📋 Test attempt for review:', testAttempt);
            
            if (!testAttempt) {
              alert('No exam attempt found for this test.');
              setLoadingReview(false);
              return;
            }

            if (!testAttempt.user_answers || testAttempt.user_answers.length === 0) {
              alert('No answer data available for review.');
              setLoadingReview(false);
              return;
            }

            console.log('✅ User answers:', testAttempt.user_answers);

            // Build questions from user_answers (which includes correct answers & explanations)
            const questions = testAttempt.user_answers.map((ua, idx) => ({
              id: idx + 1,
              number: ua.question_number,
              question: ua.question_text,
              options: ua.options,
              answer: ua.correct_answer || [],
              explanation: ua.explanation || 'No explanation available.',
              image: null,
              multi: (ua.correct_answer && ua.correct_answer.length > 1) || false
            }));

            // Transform attempt data to Results format
            const userAnswers = testAttempt.user_answers.map(ua => ua.selected || []);
            let correct = 0, wrong = 0, skipped = 0;
            testAttempt.user_answers.forEach(ua => {
              if (!ua.selected || ua.selected.length === 0) skipped++;
              else if (ua.is_correct) correct++;
              else wrong++;
            });

            console.log(`📈 Scores - Correct: ${correct}, Wrong: ${wrong}, Skipped: ${skipped}, Total: ${testAttempt.total}`);

            const resultsData = {
              correct,
              wrong,
              skipped,
              total: testAttempt.total || questions.length,
              userAnswers,
              testData: { id: test.id, slug: test.slug, name: test.name, questions },
              isPractice: false,
              username: user?.username
            };

            setActiveTest(test);
            setQuizResults(resultsData);
            setView('results');
          } catch (error) {
            console.error('❌ Error loading review data:', error);
            alert('Failed to load review data. Check console for details.');
          } finally {
            setLoadingReview(false);
          }
        }}
        loadingReview={loadingReview}
        user={user} 
      />}
      {view === 'admin' && <AdminPage user={user} onBack={goHome} />}

      {/* Quiz — possibly wrapped in ExamProctor */}
      {view === 'quiz' && activeTest && (
        isExamTest ? (
          <ExamProctor testId={activeTest.id} slug={activeTest.slug} testName={activeTest.name} onBanned={goHome} onQuit={goHome}>
            <Quiz testData={activeTest} mode="exam" user={user} isExamMode submitting={submitting} onFinish={handleFinishTest} onQuit={goHome} />
          </ExamProctor>
        ) : (
          <Quiz testData={activeTest} mode={testMode} user={user} submitting={submitting} onFinish={handleFinishTest} onQuit={goHome} />
        )
      )}

      {/* After exam → Leaderboard; after practice → Results */}
      {view === 'results' && quizResults && <Results results={quizResults} user={user} onHome={goHome} />}
      {view === 'leaderboard' && activeTest && (() => {
        console.log('App.jsx: Rendering Leaderboard with user:', user);
        return (
          <Leaderboard
            slug={activeTest.slug}
            testName={activeTest.name}
            userResult={quizResults}
            user={user}
            onHome={goHome}
            onReview={async () => {
              if (loadingReview) return;
              // If quizResults already exists, just show them
              if (quizResults) {
                setView('results');
                return;
              }
              
              setLoadingReview(true);
              // Otherwise fetch the user's latest exam attempt
              const token = localStorage.getItem('csa_access');
              try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/attempts/`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const attempts = await res.json();
                console.log('📊 All attempts:', attempts);
                
                const testAttempt = attempts.find(a => a.test_slug === activeTest.slug && a.mode === 'exam');
                console.log('📋 Test attempt for review:', testAttempt);
                
                if (!testAttempt) {
                  alert('No exam attempt found for this test.');
                  setLoadingReview(false);
                  return;
                }

                if (!testAttempt.user_answers || testAttempt.user_answers.length === 0) {
                  alert('No answer data available for review.');
                  setLoadingReview(false);
                  return;
                }

                console.log('✅ User answers:', testAttempt.user_answers);

                // Build questions from user_answers (which includes correct answers & explanations)
                const questions = testAttempt.user_answers.map((ua, idx) => ({
                  id: idx + 1,
                  number: ua.question_number,
                  question: ua.question_text,
                  options: ua.options,
                  answer: ua.correct_answer || [],
                  explanation: ua.explanation || 'No explanation available.',
                  image: null,
                  multi: (ua.correct_answer && ua.correct_answer.length > 1) || false
                }));

                // Transform to Results format
                const userAnswers = testAttempt.user_answers.map(ua => ua.selected || []);
                let correct = 0, wrong = 0, skipped = 0;
                testAttempt.user_answers.forEach(ua => {
                  if (!ua.selected || ua.selected.length === 0) skipped++;
                  else if (ua.is_correct) correct++;
                  else wrong++;
                });

                console.log(`📈 Scores - Correct: ${correct}, Wrong: ${wrong}, Skipped: ${skipped}, Total: ${testAttempt.total}`);

                const resultsData = {
                  correct,
                  wrong,
                  skipped,
                  total: testAttempt.total || questions.length,
                  userAnswers,
                  testData: { id: activeTest.id, slug: activeTest.slug, name: activeTest.name, questions },
                  isPractice: false,
                  username: user?.username
                };

                setQuizResults(resultsData);
                setView('results');
              } catch (error) {
                console.error('❌ Error loading review data:', error);
                alert('Failed to load review data. Check console for details.');
              } finally {
                setLoadingReview(false);
              }
            }}}
            loadingReview={loadingReview}
          />
        );
      })()}

      {/* Watermark Footer */}
      {view !== 'quiz' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '16px', 
          right: '20px', 
          fontSize: '11px', 
          color: 'rgba(255,255,255,0.3)', 
          fontWeight: '500',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>Made with ❤️ by</span>
          <span style={{ fontWeight: '700', color: 'rgba(139,92,246,0.6)' }}>Krutik Chamtha</span>
        </div>
      )}
    </>
  );
}
