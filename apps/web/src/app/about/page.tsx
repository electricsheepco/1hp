'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 overflow-hidden">
      <style jsx>{`
        @keyframes slide-down {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-right {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .back-link {
          animation: slide-right 0.5s ease-out forwards;
        }

        .page-title {
          animation: slide-down 0.6s ease-out forwards;
        }

        .page-subtitle {
          animation: slide-down 0.6s ease-out 0.1s forwards;
          opacity: 0;
        }

        .section {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .section-1 { animation-delay: 0.2s; }
        .section-2 { animation-delay: 0.3s; }
        .section-3 { animation-delay: 0.4s; }
        .section-4 { animation-delay: 0.5s; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="back-link text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="page-title text-4xl font-light tracking-tight mb-4">
          About 1HP
        </h1>
        <p className="page-subtitle text-lg text-muted-foreground mb-12">
          One Human Powered. A platform for those who move themselves through space.
        </p>

        <section className="section section-1 mb-12">
          <h2 className="text-xl font-medium mb-4">What is 1HP?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            1HP serves people who run, walk, cycle, swim, and participate in triathlons —
            treating the human body as one continuous system rather than separate sport silos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We exist because movement deserves a home that respects the humans doing it.
            Not a leaderboard. Not a marketplace of motivation. Just a place where
            human-powered effort is understood and supported.
          </p>
        </section>

        <section className="section section-2 mb-12">
          <h2 className="text-xl font-medium mb-4">Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            1HP believes consistency matters more than extremes.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Walking counts.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Rest counts.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Aging counts.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Returning counts.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We treat your body as one continuous system — not separate sports,
            not isolated achievements, not numbers to be optimised.
          </p>
        </section>

        <section className="section section-3 mb-12">
          <h2 className="text-xl font-medium mb-4">What We Reject</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            1HP is deliberately built without:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              &ldquo;No pain, no gain&rdquo; rhetoric
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              Hustle culture applied to bodies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              Ranking humans by output
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              Pressure disguised as participation
            </li>
          </ul>
        </section>

        <section className="section section-4 mb-12">
          <h2 className="text-xl font-medium mb-4">The Three Pillars</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-medium mb-1">Participate</h3>
              <p className="text-sm text-muted-foreground">
                Find where humans move together. Events across India — running, cycling, swimming, walking.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-medium mb-1">Equip</h3>
              <p className="text-sm text-muted-foreground">
                Gear that lasts. Apparel and accessories chosen for durability, not trends.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-medium mb-1">Measure</h3>
              <p className="text-sm text-muted-foreground">
                Know where you are. Your body as one continuous system across all movement.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Built with care in India.
          </p>
        </footer>
      </div>
    </div>
  )
}
