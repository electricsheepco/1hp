'use client'

import Link from 'next/link'

export default function TermsPage() {
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
        .section-7 { animation-delay: 0.8s; }
        .section-8 { animation-delay: 0.9s; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="back-link text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="page-title text-4xl font-light tracking-tight mb-4">
          Terms of Use
        </h1>
        <p className="page-subtitle text-lg text-muted-foreground mb-12">
          The agreement between you and 1HP. Readable, not riddled with legalese.
        </p>

        <div className="space-y-10">
          <section className="section section-1">
            <h2 className="text-xl font-medium mb-4">Acceptance</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using 1HP, you agree to these terms. If you don&apos;t agree,
              please don&apos;t use the platform. We&apos;ll notify you of significant
              changes, and continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="section section-2">
            <h2 className="text-xl font-medium mb-4">What 1HP Provides</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              1HP offers:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>A directory of human-powered events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Curated gear recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Runstate — tools to understand your movement patterns</span>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We aim to keep the platform available and accurate, but we can&apos;t
              guarantee uninterrupted service or that all event information is current.
            </p>
          </section>

          <section className="section section-3">
            <h2 className="text-xl font-medium mb-4">Your Account</h2>
            <p className="text-muted-foreground leading-relaxed">
              You&apos;re responsible for maintaining the security of your account
              credentials. Don&apos;t share your login. If you suspect unauthorised
              access, contact us immediately. You must be at least 16 years old
              to create an account.
            </p>
          </section>

          <section className="section section-4">
            <h2 className="text-xl font-medium mb-4">Your Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When using 1HP, you agree to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Provide accurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Use the platform for lawful purposes only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Respect other users and their privacy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Not attempt to circumvent security measures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span>Not scrape, harvest, or automate access without permission</span>
              </li>
            </ul>
          </section>

          <section className="section section-5">
            <h2 className="text-xl font-medium mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              1HP&apos;s content, design, and code are protected by intellectual property
              laws. Your activity data remains yours. By using Runstate, you grant us
              a licence to process your data to provide the service — nothing more.
            </p>
          </section>

          <section className="section section-6">
            <h2 className="text-xl font-medium mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              1HP integrates with services like Strava. Your use of these integrations
              is also subject to their terms. We&apos;re not responsible for third-party
              service availability or their handling of your data.
            </p>
          </section>

          <section className="section section-7">
            <h2 className="text-xl font-medium mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              1HP is provided &ldquo;as is&rdquo;. We&apos;re not liable for decisions you make
              based on information from the platform, injuries during activities,
              or issues with events listed on the platform. See our{' '}
              <Link href="/disclaimer" className="text-primary hover:underline">
                Disclaimer
              </Link>{' '}
              for health-specific guidance.
            </p>
          </section>

          <section className="section section-8">
            <h2 className="text-xl font-medium mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can close your account at any time. We may suspend or terminate
              accounts that violate these terms. Upon termination, your right to
              use the platform ends, but provisions that should survive (like
              limitation of liability) continue.
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </footer>
      </div>
    </div>
  )
}
