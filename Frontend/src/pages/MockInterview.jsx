import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Play,
  RotateCcw,
  Clock,
  Volume2,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { API_BASE_URL } from '../constants/config.js';

export default function MockInterview() {
  const { resumes, isLoading: resumesLoading } = useResumes();

  // Setup state
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [interviewMode, setInterviewMode] = useState('mixed');
  const [candidateName, setCandidateName] = useState('Candidate');

  // Interview session state
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [candidateAnswer, setCandidateAnswer] = useState('');

  // History / Transcript
  const [transcript, setTranscript] = useState([]); // [{ question, category, answer, evaluation }]
  const [finalSummary, setFinalSummary] = useState(null);

  // Speech-to-Text state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Socket connection ref
  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Pre-select first resume
  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
      const name = resumes[0].content?.personalInfo?.name;
      if (name) setCandidateName(name);
    }
  }, [resumes, selectedResumeId]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => `${prev} ${fullTranscript}`.trim());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast.error('Speech-to-text is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success('Microphone turned off.');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening... Speak your answer.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Socket setup on Start Interview
  const handleStartInterview = () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume to ground your interview.');
      return;
    }

    const selectedResume = resumes.find((r) => r._id === selectedResumeId);
    const resumeSummary = {
      name: selectedResume?.content?.personalInfo?.name,
      skills: selectedResume?.content?.skills || [],
      experience: (selectedResume?.content?.experience || []).slice(0, 3),
      projects: (selectedResume?.content?.projects || []).slice(0, 3)
    };

    // Connect Socket.io
    const backendUrl = API_BASE_URL.replace('/api', '');
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to AI Mock Interview server');
      socket.emit('start_interview', {
        targetRole,
        resumeSummary,
        candidateName
      });
    });

    socket.on('interview_started', (data) => {
      setIsInterviewActive(true);
      setCurrentQuestion(data.firstQuestion);
      setCurrentCategory(data.category);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions || 5);
      setTranscript([]);
      setFinalSummary(null);
      toast.success('Mock Interview started! AI is ready.');
    });

    socket.on('evaluating_answer', () => {
      setIsEvaluating(true);
    });

    socket.on('answer_evaluated', (data) => {
      setIsEvaluating(false);
      const evaluatedTurn = {
        question: currentQuestion,
        category: currentCategory,
        answer: candidateAnswer,
        evaluation: {
          score: data.score,
          feedback: data.feedback,
          starBreakdown: data.starBreakdown,
          strengths: data.strengths,
          improvementTips: data.improvementTips,
          idealAnswer: data.idealAnswer
        }
      };

      setTranscript((prev) => [...prev, evaluatedTurn]);
      setCandidateAnswer('');

      if (data.isInterviewComplete || !data.nextQuestion) {
        // Request final scorecard
        setIsInterviewActive(false);
        setIsSummaryLoading(true);
        socket.emit('finish_interview', {
          transcript: [...transcript, evaluatedTurn],
          targetRole
        });
      } else {
        // Proceed to next question
        setCurrentQuestion(data.nextQuestion);
        setCurrentCategory(data.questionCategory || 'Technical Question');
        setQuestionNumber(data.questionNumber + 1);
      }
    });

    socket.on('interview_summary_ready', (data) => {
      setIsSummaryLoading(false);
      setFinalSummary(data.summary);
      if ((data.summary?.overallScore || 0) >= 75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      toast.success('Interview evaluation complete!');
    });

    socket.on('error', (err) => {
      setIsEvaluating(false);
      setIsSummaryLoading(false);
      toast.error(err.message || 'Socket error occurred');
    });
  };

  const handleSubmitAnswer = () => {
    if (!candidateAnswer.trim() || candidateAnswer.trim().length < 5) {
      toast.error('Please type or speak an answer before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (!socketRef.current) return;

    socketRef.current.emit('submit_answer', {
      history: transcript,
      currentAnswer: candidateAnswer.trim(),
      targetRole,
      questionNumber,
      totalQuestions
    });
  };

  const handleEndInterviewEarly = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setIsInterviewActive(false);
    setIsEvaluating(false);
    toast('Interview session closed.');
  };

  if (resumesLoading) {
    return <PageLoader label="Loading mock interview engine" />;
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-900 via-indigo-950 to-dark-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-primary-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Real-Time Socket.io AI Simulator</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              AI Real-Time Mock Interviewer
            </h1>
            <p className="mt-2 text-sm sm:text-base text-primary-200/90 leading-relaxed">
              Practice live technical, system design, and STAR behavioral interviews with an AI hiring manager. Get instant scoring, rubric breakdowns, and ideal answer formulas.
            </p>
          </div>

          {isInterviewActive && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Live Interview in Session</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEndInterviewEarly}
                className="text-xs bg-white/10 text-white border-white/20"
              >
                End Session
              </Button>
            </div>
          )}
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {!isInterviewActive && !finalSummary ? (
        /* SETUP SCREEN */
        <div className="max-w-3xl mx-auto w-full">
          <Card className="p-8 border-dark-100 dark:border-dark-800 space-y-6 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800">
              <h2 className="text-base font-bold font-display text-dark-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                <span>Configure Your Interview Session</span>
              </h2>
              <span className="text-xs font-mono text-dark-400">5-Question Deep Dive</span>
            </div>

            {/* Resume Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-2">
                1. Select Resume Context
              </label>
              {resumes.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  Please upload a resume first so the interviewer can ask questions based on your verified experience.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary-500"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.optimization?.atsScore || 0}% ATS)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-2">
                2. Target Job Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Full Stack Software Engineer',
                  'Frontend Specialist',
                  'Backend / Distributed Systems',
                  'DevOps / Cloud Architect',
                  'AI / ML Engineer',
                  'Engineering Lead'
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                      targetRole === role
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-200 font-bold shadow-2xs'
                        : 'border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:border-dark-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Format Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-2">
                3. Interview Round Focus
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mixed', label: 'Standard Mixed Round', desc: 'Tech + STAR Behavioral' },
                  { id: 'technical', label: 'Technical Deep Dive', desc: 'Architecture & code decisions' },
                  { id: 'behavioral', label: 'STAR Leadership', desc: 'Conflict, impact & teamwork' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setInterviewMode(m.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      interviewMode === m.id
                        ? 'border-accent-600 bg-accent-50 dark:bg-accent-950/40 text-accent-950 dark:text-accent-200 font-bold shadow-2xs'
                        : 'border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 text-dark-600 dark:text-dark-400 hover:border-dark-200'
                    }`}
                  >
                    <p className="text-xs font-bold">{m.label}</p>
                    <p className="text-[10px] text-dark-400 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="lime"
              size="lg"
              onClick={handleStartInterview}
              className="w-full justify-center font-bold text-sm shadow-xl shadow-lime/20"
            >
              <Play className="w-4 h-4 text-ink fill-current" />
              <span>Launch Live Mock Interview Session</span>
            </Button>
          </Card>
        </div>
      ) : isInterviewActive ? (
        /* ACTIVE INTERVIEW ROOM */
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Interview Q&A Canvas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Current Question Card */}
            <Card className="p-6 border-primary-200 dark:border-primary-900 shadow-md bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-dark-900 dark:to-dark-950 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary-600 text-white">
                    Question {questionNumber} of {totalQuestions}
                  </span>
                  <span className="text-xs font-mono text-dark-500 dark:text-dark-400">
                    Category: {currentCategory}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-dark-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 text-sm font-semibold text-dark-900 dark:text-white leading-relaxed flex items-start gap-3">
                <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <p>{currentQuestion}</p>
              </div>

              {/* Candidate Answer Box */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your Response:</span>
                  </label>

                  {/* Speech-to-Text Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isListening
                        ? 'bg-danger-500 text-white animate-pulse shadow-md'
                        : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Recording Audio...' : 'Voice Input (Mic)'}</span>
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Type your answer or click 'Voice Input' to speak naturally using the STAR method..."
                  disabled={isEvaluating}
                  className="w-full p-4 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 leading-relaxed resize-none font-sans"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-dark-400">
                    Tip: Structure with Situation ➔ Task ➔ Action ➔ Result
                  </span>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSubmitAnswer}
                    isLoading={isEvaluating}
                    className="font-bold text-xs shadow-md"
                  >
                    <span>Submit Answer</span>
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar: Live Transcript & Immediate STAR Feedback */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-dark-600 dark:text-dark-400">
              Live Evaluation History ({transcript.length})
            </h3>

            {transcript.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-dark-200 dark:border-dark-800 text-center text-xs text-dark-400">
                Submit your first answer to view instant AI scoring & STAR rubric feedback.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {transcript.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-dark-400">
                        Q{idx + 1}: {item.category}
                      </span>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        Score: {item.evaluation.score} / 10
                      </span>
                    </div>

                    <p className="text-[11px] text-dark-600 dark:text-dark-300 line-clamp-2 italic">
                      "{item.answer}"
                    </p>

                    <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-950 text-xs space-y-1.5">
                      <p className="text-dark-800 dark:text-dark-200 font-medium">
                        {item.evaluation.feedback}
                      </p>
                      {item.evaluation.idealAnswer && (
                        <div className="pt-1.5 border-t border-dark-100 dark:border-dark-800 text-[11px] text-primary-600 dark:text-primary-400">
                          <strong>Ideal Answer snippet:</strong> {item.evaluation.idealAnswer.substring(0, 150)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* FINAL ASSESSMENT SCORECARD */
        <div className="max-w-4xl mx-auto w-full space-y-6 animate-scale-in">
          {isSummaryLoading ? (
            <div className="p-12 text-center bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800">
              <PageLoader label="Generating comprehensive hiring committee scorecard" />
            </div>
          ) : finalSummary ? (
            <div className="space-y-6">
              {/* Top Scorecard Banner */}
              <div className="p-8 rounded-2xl bg-gradient-to-r from-dark-900 via-primary-950 to-dark-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Interview Complete</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-display">
                    Final Candidate Scorecard
                  </h2>
                  <p className="text-xs text-primary-200 mt-1 font-mono">
                    Target Role: {targetRole} | {transcript.length} Questions Answered
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary-200 block">
                      Overall Match
                    </span>
                    <span className="text-4xl font-black font-display text-emerald-400">
                      {finalSummary.overallScore || 88}%
                    </span>
                  </div>

                  <div className="text-center pl-6 border-l border-white/15">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary-200 block">
                      Recommendation
                    </span>
                    <span className="text-lg font-black uppercase text-accent-400">
                      {finalSummary.recommendation || 'Hire'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              {finalSummary.breakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Technical Depth', score: finalSummary.breakdown.technical },
                    { label: 'Communication', score: finalSummary.breakdown.communication },
                    { label: 'Problem Solving', score: finalSummary.breakdown.problemSolving },
                    { label: 'STAR Method', score: finalSummary.breakdown.starMethod }
                  ].map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 text-center shadow-sm"
                    >
                      <span className="text-[11px] font-mono text-dark-400 block">{r.label}</span>
                      <span className="text-2xl font-black font-display text-dark-900 dark:text-white mt-1 block">
                        {r.score || 85}%
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths & Growth Areas */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="p-6 border-emerald-100 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Demonstrated Strengths</span>
                  </h3>
                  <ul className="space-y-2">
                    {finalSummary.keyStrengths?.map((s, i) => (
                      <li key={i} className="text-xs text-emerald-950 dark:text-emerald-300 leading-relaxed flex items-start gap-2">
                        <span>✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-amber-100 dark:border-amber-950 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Areas to Polish</span>
                  </h3>
                  <ul className="space-y-2">
                    {finalSummary.areasForGrowth?.map((g, i) => (
                      <li key={i} className="text-xs text-amber-950 dark:text-amber-300 leading-relaxed flex items-start gap-2">
                        <span>•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Executive Summary Notes */}
              {finalSummary.summaryNotes && (
                <Card className="p-6 border-dark-100 dark:border-dark-800 space-y-3">
                  <h3 className="text-sm font-bold text-dark-900 dark:text-white">
                    Hiring Committee Assessment
                  </h3>
                  <p className="text-xs text-dark-700 dark:text-dark-300 leading-relaxed whitespace-pre-line">
                    {finalSummary.summaryNotes}
                  </p>
                </Card>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setFinalSummary(null);
                    setIsInterviewActive(false);
                  }}
                  className="font-bold text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Another Mock Session</span>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
