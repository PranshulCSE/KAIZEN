import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Sparkles, Check } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-dark-50 to-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-dark-100">
        <div className="container-lg flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-gradient-primary">Kaizen</h1>
          <div className="flex gap-3">
            <Button as={Link} to="/login" variant="ghost" size="sm">Login</Button>
            <Button as={Link} to="/register" variant="primary" size="sm">Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* HERO - SHORT & CATCHY */}
      <section className="section container-lg">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent-500" />
              <span className="text-sm font-semibold text-accent-600">AI-Powered Resume Magic</span>
            </div>
            <h1 className="mb-4">Your Resume,<br /><span className="text-gradient">Re-imagined</span></h1>
            <p className="text-lg text-dark-600 mb-6">Stop guessing. Get your resume matched to any job in seconds. Our AI shows exactly what to change - line by line.</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button as={Link} to="/register" variant="primary">Try Free Now</Button>
              <Button as="a" href="#how-it-works" variant="secondary">Watch Demo</Button>
            </div>

            <div className="flex gap-4 text-sm text-dark-600">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-success-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-success-500" />
                <span>Takes 2 minutes</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-right">
            <div className="card-filled p-8 space-y-4">
              <div className="text-sm font-mono text-dark-500">❌ Before</div>
              <p className="text-sm text-dark-700 line-through">Managed team and handled problems</p>

              <div className="h-px bg-gradient-accent"></div>

              <div className="text-sm font-mono text-success-600">✓ After</div>
              <p className="text-sm font-semibold text-dark-900">Led 5-person team, resolved 200+ issues weekly with 96% satisfaction rate</p>

              <div className="pt-4 border-t border-dark-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-dark-500">ATS Match Score</span>
                  <span className="text-lg font-bold text-gradient-primary">45 → 92</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - 3 COLS */}
      <section id="how-it-works" className="section pt-10 md:pt-14 bg-gradient-to-b from-transparent to-primary-50/20 ">
        <div className="container-lg">
          <h2 className="text-center mb-4">How It Works</h2>
          <p className="text-center text-dark-600 mb-12 max-w-2xl mx-auto">Get results in 3 simple steps</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📄', title: 'Upload Resume', desc: 'Paste your resume or upload PDF' },
              { icon: '🎯', title: 'Paste Job Post', desc: 'Share the job description' },
              { icon: '✨', title: 'Get Optimized', desc: 'See AI-powered improvements' }
            ].map((item, i) => (
              <Card key={i} hover className="p-6 text-center animate-bounce-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-dark-600 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-primary text-white">
        <div className="container-md text-center animate-fade-in">
          <h2 className="mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-white/90 mb-8">Start optimizing your resume now. Free forever plan available.</p>
          <Button as={Link} to="/register" variant="secondary" className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-dark-50">
            <span>Get Started Now</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-900 text-white/60 py-8">
        <div className="container-lg text-center text-sm">
          <p>© 2026 Kaizen. Your Resume, Optimized by AI.</p>
        </div>
      </footer>
    </div>
  );
}
