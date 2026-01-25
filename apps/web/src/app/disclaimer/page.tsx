'use client'

import Link from 'next/link'

export default function DisclaimerPage() {
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
        .section-5 { animation-delay: 0.6s; }
        .section-6 { animation-delay: 0.7s; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="back-link text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="page-title text-4xl font-light tracking-tight mb-4">
          Disclaimer
        </h1>
        <p className="page-subtitle text-lg text-muted-foreground mb-12">
          Important boundaries about what 1HP is — and what it isn&apos;t.
        </p>

        <div className="space-y-10">
          <section className="section section-1">
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
              <h2 className="text-xl font-medium mb-4">Not Medical Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                1HP is not a medical service. Nothing on this platform — including
                Runstate insights, event recommendations, or gear suggestions — should
                be interpreted as medical advice. Always consult a qualified healthcare
                professional before starting, changing, or intensifying any physical activity.
              </p>
            </div>
          </section>

          <section className="section section-2">
            <h2 className="text-xl font-medium mb-4">Listen to Your Body</h2>
            <p className="text-muted-foreground leading-relaxed">
              This aligns with 1HP&apos;s core philosophy: your body is not a machine to
              be optimised. Pain is information. Fatigue is information. If something
              feels wrong, stop. No data point, streak, or event is worth injury.
            </p>
          </section>

          <section className="section section-3">
            <h2 className="text-xl font-medium mb-4">Runstate Limitations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Runstate analyses your activity data to identify patterns and offer
              observations. It cannot:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2" />
                <span>Diagnose medical conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2" />
                <span>Predict injuries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2" />
                <span>Replace professional coaching or physiotherapy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2" />
                <span>Account for factors outside your tracked activities</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Runstate tells you where you are. What you do with that information
              is your responsibility.
            </p>
          </section>

          <section className="section section-4">
            <h2 className="text-xl font-medium mb-4">Event Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              Event details on 1HP (dates, locations, registration links) are provided
              as a convenience. We strive for accuracy but cannot guarantee it. Always
              verify event information with the official organisers before making plans
              or payments.
            </p>
          </section>

          <section className="section section-5">
            <h2 className="text-xl font-medium mb-4">Gear Recommendations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Product recommendations in the Equip section are curated opinions, not
              endorsements. Individual needs vary. What works for one person may not
              work for another. We may earn commissions from purchases made through
              affiliate links — this doesn&apos;t influence our curation, but transparency
              matters.
            </p>
          </section>

          <section className="section section-6">
            <h2 className="text-xl font-medium mb-4">Assumption of Risk</h2>
            <p className="text-muted-foreground leading-relaxed">
              Physical activity carries inherent risks. By using 1HP to find events or
              track your movement, you acknowledge that running, cycling, swimming,
              walking, and related activities can result in injury or worse. You
              participate at your own risk.
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{' '}
            <a href="mailto:hello@1hp.in" className="text-primary hover:underline">
              hello@1hp.in
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
