import { Link } from 'react-router';
import { ArrowRight, Zap, TrendingUp, Sparkles, Check, FileCheck, Shield, Award, Play, Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Logo from '../assets/Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0B0D10] text-dark-900 dark:text-dark-50 selection:bg-primary-100 selection:text-primary-700 transition-colors">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/85 dark:bg-dark-900/85 backdrop-blur-xl border-b border-dark-100/80 dark:border-dark-800 transition-colors">
        <div className="container-lg flex items-center justify-between py-3.5">
          <Logo showBadge />
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-600" />}
            </button>

            <Button as={Link} to="/login" variant="ghost" size="sm" className="font-semibold text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white">
              Log in
            </Button>
            <Button as={Link} to="/register" variant="primary" size="sm" className="shadow-md shadow-primary-500/20 font-semibold">
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-primary-400/10 via-accent-300/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container-lg relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="md:col-span-7 flex flex-col items-start animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-6 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                <span>Next-Gen AI Resume & ATS Engine</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-dark-900 dark:text-white leading-[1.12] mb-6">
                Your Resume,{' '}
                <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-accent-500 bg-clip-text text-transparent">
                  Perfected by AI.
                </span>
              </h1>

              <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 max-w-xl leading-relaxed">
                Stop submitting applications into the black hole. Kaizen benchmarks your resume against real job listings and rewrites bullet points to match ATS algorithms in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button as={Link} to="/register" variant="primary" size="lg" className="shadow-lg shadow-primary-500/25 px-6">
                  <span>Try Free Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button as="a" href="#how-it-works" variant="secondary" size="lg" className="px-5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>How It Works</span>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-dark-600 dark:text-dark-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Takes under 2 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>PDF Export Ready</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="md:col-span-5 animate-fade-in-right">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-500 to-accent-400 opacity-20 blur-xl" />

                <div className="relative rounded-2xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 p-6 shadow-xl shadow-dark-900/5 transition-colors">
                  <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono text-dark-400 dark:text-dark-500">Live AI Redline Comparison</span>
                  </div>

                  {/* Before state */}
                  <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mb-1">
                      <span>✕</span>
                      <span>ORIGINAL BULLET</span>
                    </div>
                    <p className="text-xs text-dark-500 dark:text-dark-400 line-through leading-relaxed">
                      "Managed team and handled problems across different projects."
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center justify-center my-2">
                    <div className="px-3 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Improved
                    </div>
                  </div>

                  {/* After state */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                      <span>✓</span>
                      <span>HIGH-IMPACT ATS REVISION</span>
                    </div>
                    <p className="text-xs font-bold text-dark-800 dark:text-white leading-relaxed">
                      "Led high-velocity 5-person engineering team, resolving 200+ issues weekly with 96% client satisfaction rate."
                    </p>
                  </div>

                  {/* ATS Score Improvement pill */}
                  <div className="pt-3 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-dark-500 dark:text-dark-400 uppercase tracking-wider">ATS Match Score</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-dark-400 dark:text-dark-500 line-through">45%</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">92%</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          +47 PTS
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-dark-900 border-y border-dark-100 dark:border-dark-800 transition-colors">
        <div className="container-lg">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-dark-900 dark:text-white mt-4 mb-3">
              How Kaizen Empowers Your Job Search
            </h2>
            <p className="text-dark-600 dark:text-dark-300 text-sm sm:text-base">
              From raw resume to recruiter-ready in under two minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Resume',
                desc: 'Upload any existing PDF or DOCX file. Our engine automatically parses your experience, skills, and dates.',
                color: 'from-primary-500 to-indigo-600'
              },
              {
                step: '02',
                title: 'Target Any Job Post',
                desc: 'Paste the target job description. Kaizen extracts core keywords, required skills, and recruiter weights.',
                color: 'from-accent-500 to-amber-600'
              },
              {
                step: '03',
                title: 'Generate & Export PDF',
                desc: 'Review high-scoring suggestions, choose the best revisions, and download your recruiter-ready PDF instantly.',
                color: 'from-emerald-500 to-teal-600'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-[#F6F7F2] dark:bg-dark-950 border border-dark-100 dark:border-dark-800 p-8 hover:bg-white dark:hover:bg-dark-900 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white font-mono font-bold flex items-center justify-center text-sm shadow-md mb-6 group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-display text-dark-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 text-white">
        <div className="container-md text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-primary-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span>Ready for your next career move?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display mb-4 tracking-tight">
            Stop Guessing. Start Getting Interviews.
          </h2>
          <p className="text-primary-200/90 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Join candidates worldwide who optimize their resumes and land top roles at leading tech companies.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              variant="lime"
              size="lg"
              className="font-bold shadow-xl shadow-lime/20 px-8"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 text-ink" />
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="secondary"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 px-6"
            >
              Sign In to Account
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 py-10 transition-colors">
        <div className="container-lg flex flex-wrap items-center justify-between gap-6">
          <Logo />
          <p className="text-xs text-dark-500 dark:text-dark-400 font-mono">
            © {new Date().getFullYear()} Kaizen AI Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-dark-600 dark:text-dark-400">
            <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">Login</Link>
            <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400">Register</Link>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
