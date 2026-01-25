'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="back-link text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="page-title text-4xl font-light tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="page-subtitle text-lg text-muted-foreground mb-12">
          How we handle your information. Written plainly, without legal obscurity.
        </p>

        <div className="space-y-10">
          <section className="section section-1">
            <h2 className="text-xl font-medium mb-4">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed">
              1HP collects only what&apos;s necessary to provide the service you&apos;ve asked for.
              We don&apos;t sell your data. We don&apos;t build advertising profiles.
              Your movement data is yours — we&apos;re just helping you understand it.
            </p>
          </section>

          <section className="section section-2">
            <h2 className="text-xl font-medium mb-4">What We Collect</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-medium mb-2">Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  Email address, name (if provided), and authentication credentials.
                  Used solely for account access and communication you&apos;ve opted into.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-medium mb-2">Activity Data</h3>
                <p className="text-sm text-muted-foreground">
                  If you connect Strava or other fitness services, we access the activity
                  data you&apos;ve authorised. This powers Runstate&apos;s understanding of your
                  movement patterns.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-medium mb-2">Usage Data</h3>
                <p className="text-sm text-muted-foreground">
                  Basic analytics to understand how the platform is used — pages visited,
                  features accessed. No personal identification, no tracking across other sites.
                </p>
              </div>
            </div>
          </section>

          <section className="section section-3">
            <h2 className="text-xl font-medium mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We integrate with services that have their own privacy practices:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Strava</strong> — for activity synchronisation (governed by Strava&apos;s privacy policy)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Vercel</strong> — for hosting (governed by Vercel&apos;s privacy policy)</span>
              </li>
            </ul>
          </section>

          <section className="section section-4">
            <h2 className="text-xl font-medium mb-4">Data Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using industry-standard encryption.
              Activity data is processed to generate insights, then the raw data
              can be deleted at your request while retaining only aggregated,
              non-identifiable patterns.
            </p>
          </section>

          <section className="section section-5">
            <h2 className="text-xl font-medium mb-4">Your Rights</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Access</strong> — request a copy of your data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Correction</strong> — update inaccurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Deletion</strong> — remove your account and associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Portability</strong> — export your data in a standard format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                <span><strong>Disconnection</strong> — revoke access to connected services at any time</span>
              </li>
            </ul>
          </section>

          <section className="section section-6">
            <h2 className="text-xl font-medium mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication and session management.
              No advertising cookies. No cross-site tracking. You can disable
              non-essential cookies in your browser settings.
            </p>
          </section>

          <section className="section section-7">
            <h2 className="text-xl font-medium mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about your privacy? Contact us at{' '}
              <a href="mailto:privacy@1hp.in" className="text-primary hover:underline">
                privacy@1hp.in
              </a>
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
