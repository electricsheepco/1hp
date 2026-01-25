'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const credits = [
  {
    category: 'Typography',
    items: [
      {
        name: 'Sora',
        description: 'Geometric sans-serif by Jonathan Barnbrook & Julián Moncada',
        url: 'https://fonts.google.com/specimen/Sora',
        licence: 'SIL Open Font Licence',
      },
    ],
  },
  {
    category: 'Illustrations',
    items: [
      {
        name: 'unDraw',
        description: 'Open-source illustrations by Katerina Limpitsouni',
        url: 'https://undraw.co',
        licence: 'unDraw Licence (free for commercial use)',
      },
    ],
  },
  {
    category: 'Icons',
    items: [
      {
        name: 'Lucide',
        description: 'Beautiful & consistent icon toolkit',
        url: 'https://lucide.dev',
        licence: 'ISC Licence',
      },
    ],
  },
  {
    category: 'Framework & Libraries',
    items: [
      {
        name: 'Next.js',
        description: 'React framework for production',
        url: 'https://nextjs.org',
        licence: 'MIT Licence',
      },
      {
        name: 'React',
        description: 'Library for building user interfaces',
        url: 'https://react.dev',
        licence: 'MIT Licence',
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework',
        url: 'https://tailwindcss.com',
        licence: 'MIT Licence',
      },
      {
        name: 'Radix UI',
        description: 'Accessible component primitives',
        url: 'https://www.radix-ui.com',
        licence: 'MIT Licence',
      },
      {
        name: 'shadcn/ui',
        description: 'Beautifully designed components built on Radix',
        url: 'https://ui.shadcn.com',
        licence: 'MIT Licence',
      },
    ],
  },
  {
    category: 'Hosting & Infrastructure',
    items: [
      {
        name: 'Vercel',
        description: 'Deployment and hosting platform',
        url: 'https://vercel.com',
        licence: null,
      },
    ],
  },
]

export default function CreditsPage() {
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

        @keyframes bounce-in {
          0% { transform: scale(0.3) translateY(50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-5px); }
          70% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
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

        .credit-category {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }

        .credit-item {
          animation: slide-right 0.4s ease-out forwards;
          opacity: 0;
        }

        .credit-item:hover {
          animation: none;
          transform: translateX(4px);
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="back-link text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-300 mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="page-title text-4xl font-light tracking-tight mb-4">
          Credits
        </h1>
        <p className="page-subtitle text-lg text-muted-foreground mb-12">
          1HP is built with open-source tools and resources. We believe in acknowledging
          the work that makes ours possible.
        </p>

        <div className="space-y-10">
          {credits.map((section, sectionIndex) => (
            <div
              key={section.category}
              className="credit-category"
              style={{ animationDelay: `${0.2 + sectionIndex * 0.1}s` }}
            >
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={item.name}
                    className="credit-item group hover:bg-muted/30 rounded-lg p-3 -mx-3 transition-all duration-300"
                    style={{ animationDelay: `${0.3 + sectionIndex * 0.1 + itemIndex * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="font-medium group-hover:text-primary transition-colors duration-300">
                          {item.name}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        {item.licence && (
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {item.licence}
                          </p>
                        )}
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300 ml-4 flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If we&apos;ve missed attributing your work, please let us know.
          </p>
        </footer>
      </div>
    </div>
  )
}
