'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'

const fonts = [
  {
    name: 'Sora',
    category: 'Geometric/Bold',
    description: 'Modern geometric with personality. Strong brand presence.',
    url: 'https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&display=swap',
    className: 'font-sora',
  },
  {
    name: 'DM Sans',
    category: 'Humanist/Organic',
    description: 'Soft and human. Feels approachable and warm.',
    url: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap',
    className: 'font-dm-sans',
  },
  {
    name: 'Space Grotesk',
    category: 'Modern/Tech',
    description: 'Techy but warm. Contemporary and distinctive.',
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    className: 'font-space-grotesk',
  },
]

function FontPreview({ font, isSelected, onSelect }: { font: typeof fonts[0], isSelected: boolean, onSelect: () => void }) {
  return (
    <div
      className={`border rounded-lg p-6 cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-foreground/30'}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{font.category}</span>
          <h3 className={`text-2xl font-medium mt-1 ${font.className}`}>{font.name}</h3>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6">{font.description}</p>

      {/* Sample content */}
      <div className={`space-y-4 ${font.className}`}>
        <h1 className="text-5xl font-extralight tracking-tight">1HP</h1>
        <p className="text-2xl font-light">One Human Powered</p>
        <p className="text-base text-muted-foreground">
          Movement, by humans. A home for those who run, walk, cycle, swim, and move themselves through space.
        </p>
        <div className="flex gap-3 pt-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Find Events <ArrowRight className="w-3 h-3" />
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium">
            Check Runstate
          </span>
        </div>
      </div>
    </div>
  )
}

export default function FontsPage() {
  const [selectedFont, setSelectedFont] = useState<string>('Sora')

  return (
    <>
      {/* Load all fonts */}
      {fonts.map(font => (
        <link key={font.name} rel="stylesheet" href={font.url} />
      ))}
      <style jsx global>{`
        .font-sora { font-family: 'Sora', system-ui, sans-serif; }
        .font-dm-sans { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-space-grotesk { font-family: 'Space Grotesk', system-ui, sans-serif; }
      `}</style>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              &larr; Back to home
            </Link>
            <h1 className="text-4xl font-light tracking-tight mb-2">Font Preview</h1>
            <p className="text-muted-foreground">Compare hero font options for 1HP. Click to select.</p>
          </div>

          <div className="grid gap-8">
            {fonts.map(font => (
              <FontPreview
                key={font.name}
                font={font}
                isSelected={selectedFont === font.name}
                onSelect={() => setSelectedFont(font.name)}
              />
            ))}
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="font-medium mb-2">Selected: {selectedFont}</h2>
            <p className="text-sm text-muted-foreground">
              Once you decide, I'll integrate the chosen font into the site globally.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
