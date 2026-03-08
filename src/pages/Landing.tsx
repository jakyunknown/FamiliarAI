import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface LandingProps {
  onSignInClick?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onSignInClick }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-700">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb orb-cyan" />
        <div className="orb orb-green" />
        <div className="dot-field" />
        <div className="scan-line scan-line-a" />
        <div className="scan-line scan-line-b" />
        <div className="grid-overlay" />
      </div>

      <div className="relative container mx-auto px-4 pt-20 pb-14 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="reveal-up mx-auto mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-700">
            Real-time caregiver intelligence
          </div>

          <h1 className="reveal-up mx-auto max-w-4xl text-center text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            <span className="block">Meet</span>
            <span className="hero-highlight block">FamiliarAI</span>
            <span className="block text-slate-700">for clear, calm caregiving.</span>
          </h1>
          <p className="reveal-up mx-auto mt-6 max-w-3xl text-center text-base text-slate-600 [animation-delay:120ms] md:text-xl">
            FamiliarAI is built for older adults with dementia. It learns the people they meet often,
            then shows each person&apos;s name and relationship so daily conversations feel familiar again.
          </p>

          <div className="reveal-up mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:220ms] md:mt-10 md:gap-4">
            <Button variant="primary" size="large" className="btn-glow" onClick={onSignInClick}>
              Sign In
            </Button>
            <Button variant="secondary" size="large" className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
              See How It Works
            </Button>
          </div>

          <div className="reveal-up mt-10 grid grid-cols-2 gap-3 [animation-delay:300ms] md:mt-14 md:gap-4 md:grid-cols-4">
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700 md:text-3xl">96%</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Recognition rate</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700 md:text-3xl">&lt;2s</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Alert latency</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700 md:text-3xl">24/7</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Continuous log</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700 md:text-3xl">1 Tap</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">New person label</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 pb-14 md:pb-20">
        <h2 className="reveal-up text-center text-3xl font-bold text-slate-900 md:text-4xl">
          Why caregivers choose FamiliarAI
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="feature-card reveal-up p-7 [animation-delay:80ms]">
            <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-700">
              Memory Support
            </p>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Learns Familiar Faces</h3>
            <p className="text-slate-600">
              The camera recognizes people seen repeatedly and keeps profiles fresh over time.
            </p>
          </Card>
          <Card className="feature-card reveal-up p-7 [animation-delay:180ms]">
            <p className="mb-4 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-700">
              Instant Recall
            </p>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Names + Relationships</h3>
            <p className="text-slate-600">
              When someone appears, FamiliarAI can surface cues like &quot;Anita - Daughter&quot; in real time.
            </p>
          </Card>
          <Card className="feature-card reveal-up p-7 [animation-delay:280ms]">
            <p className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-700">
              Caregiver Control
            </p>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Easy Profile Updates</h3>
            <p className="text-slate-600">
              Caregivers can quickly label new visitors and edit relationship info when needed.
            </p>
          </Card>
        </div>
      </div>

      <div className="relative border-y border-slate-200 bg-slate-50/80 py-14 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="reveal-up mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl">How It Works</h2>
          <div className="mx-auto max-w-3xl">
            <ol className="space-y-6">
              <li className="reveal-up timeline-card flex items-start rounded-xl p-5 [animation-delay:80ms]">
                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <p className="text-base md:text-lg text-slate-700">
                  Camera sees a visitor and checks if they are already familiar.
                </p>
              </li>
              <li className="reveal-up timeline-card flex items-start rounded-xl p-5 [animation-delay:160ms]">
                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <p className="text-base md:text-lg text-slate-700">
                  FamiliarAI shows the person&apos;s name and relationship for memory support.
                </p>
              </li>
              <li className="reveal-up timeline-card flex items-start rounded-xl p-5 [animation-delay:240ms]">
                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <p className="text-base md:text-lg text-slate-700">
                  If someone is new, the caregiver adds details so future visits are recognized.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <footer className="bg-white py-8 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-900 font-semibold">FamiliarAI</p>
          <p className="text-slate-500 text-sm mt-2">Hackathon project</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
