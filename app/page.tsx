import { FeedbackForm } from '@/components/feedback/FeedbackForm';

export const metadata = {
  title: 'Acowale Feedback',
  description: 'Public feedback form for Acowale',
};

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <section className="space-y-8">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl shadow-purple-950/30 backdrop-blur-xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm uppercase tracking-[0.4em] text-purple-300/70">
                    Acowale Feedback
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Share feedback in seconds.
                  </h1>
                  <p className="mt-4 text-base leading-7 text-slate-300">
                    Help us make Acowale better by submitting your suggestions, bug reports, or product ideas.
                    Your voice helps shape the next release.
                  </p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 px-6 py-4 text-sm text-slate-200 ring-1 ring-purple-500/30 backdrop-blur-sm">
                  <p className="font-semibold text-white">Public feedback</p>
                  <p className="mt-2 text-slate-300">Submit anonymously or sign in if you want a reply.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/95 to-purple-950/90 p-8 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70">Feedback form</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Tell us what you think</h2>
                </div>
                <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200 ring-1 ring-purple-500/30">
                  fast & easy
                </span>
              </div>
              <FeedbackForm />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/95 to-purple-950/90 p-8 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70">Why feedback matters</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Your input moves us forward</h2>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 px-3 py-2 text-xs font-semibold text-purple-200 ring-1 ring-purple-500/30">
                  100% public
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-slate-950/90 to-purple-950/80 p-5 ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300/70">Category</p>
                  <p className="mt-2 text-lg font-semibold text-white">Product • UX • Support</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-slate-950/90 to-purple-950/80 p-5 ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300/70">Secure</p>
                  <p className="mt-2 text-lg font-semibold text-white">Validated input, safe storage.</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-slate-950/90 to-purple-950/80 p-5 ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300/70">Insight</p>
                  <p className="mt-2 text-lg font-semibold text-white">Dashboard-ready analytics.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900/95 to-purple-950/90 p-8 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70">Get in touch</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">Need support?</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Send a note to our team if you want help, follow-up or to learn how feedback is handled.
              </p>
              <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950/90 to-purple-950/80 p-5 ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                <p className="text-sm font-medium text-purple-300/70">Email</p>
                <p className="mt-2 text-base font-semibold text-white">ceo@acowale.com</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
