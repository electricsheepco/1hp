'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Bike, Footprints, Waves } from 'lucide-react'
import { useEffect, useState } from 'react'

// All available illustrations
const illustrations = [
  '/illustrations/undraw_bike-ride_ba0o.svg',
  '/illustrations/undraw_fitness-stats_uk0g.svg',
  '/illustrations/undraw_morning-workout_73u9.svg',
  '/illustrations/undraw_runner-start_585j.svg',
]

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const pillars = [
  {
    name: 'Participate',
    href: '/participate',
    description: 'Find where humans move together. Running, cycling, swimming, walking — events across India.',
    icon: Footprints,
  },
  {
    name: 'Equip',
    href: '/equip',
    description: 'Gear that lasts. Apparel and accessories for human-powered movement.',
    icon: Bike,
  },
  {
    name: 'Measure',
    href: '/runstate',
    description: 'Know where you are. Your body as one continuous system across all movement.',
    icon: Waves,
  },
]

export default function Home() {
  const [pillarImages, setPillarImages] = useState<string[]>([])
  const [heroImage, setHeroImage] = useState<string>('')

  useEffect(() => {
    // Shuffle and assign illustrations on mount
    const shuffled = shuffleArray(illustrations)
    setPillarImages(shuffled.slice(0, 3))
    setHeroImage(shuffled[3] || shuffled[0])

    // Optional: rotate hero image every 10 seconds
    const interval = setInterval(() => {
      setHeroImage(illustrations[Math.floor(Math.random() * illustrations.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Funky animated styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          75% { transform: translateY(10px) rotate(-1deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
          50% { filter: brightness(1.1) drop-shadow(0 0 30px rgba(201, 100, 66, 0.3)); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3) translateY(100px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-10px); }
          70% { transform: scale(0.95) translateY(5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes slide-up-fade {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        @keyframes drift {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); }
          33% { transform: translateX(30px) translateY(-20px) scale(1.05); }
          66% { transform: translateX(-20px) translateY(10px) scale(0.95); }
        }

        @keyframes typewriter {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes rainbow-shift {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(30deg); }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        .bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .slide-up {
          animation: slide-up-fade 0.6s ease-out forwards;
        }

        .morph-blob {
          animation: morph 8s ease-in-out infinite;
        }

        .drift {
          animation: drift 20s ease-in-out infinite;
        }

        .hero-title {
          animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .hero-subtitle {
          animation: slide-up-fade 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .hero-desc {
          animation: slide-up-fade 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }

        .pillar-card {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }

        .pillar-card:hover {
          animation: none;
          transform: translateY(-8px) rotate(1deg);
        }

        .icon-bounce:hover {
          animation: wiggle 0.3s ease-in-out;
        }

        .arrow-funky:hover {
          animation: wiggle 0.2s ease-in-out infinite;
        }

        .bg-illustration {
          animation: drift 25s ease-in-out infinite;
        }

        .philosophy-text {
          animation: slide-up-fade 0.8s ease-out forwards;
        }
      `}</style>

      {/* Hero + Pillars unified */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {/* Brand identity */}
          <div className="text-center mb-16">
            <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight mb-6">
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 cursor-default">1</span>
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 cursor-default">H</span>
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 cursor-default">P</span>
            </h1>
            <p className="hero-subtitle text-2xl sm:text-3xl font-light text-foreground/80 mb-4">
              One Human Powered
            </p>
            <p className="hero-desc text-lg text-muted-foreground max-w-md mx-auto">
              Movement, by humans. A home for those who run, walk, cycle, swim,
              and move themselves through space.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="pillar-card group relative bg-background border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
                  style={{ animationDelay: `${0.7 + index * 0.15}s` }}
                >
                  {/* Transparent illustration as background */}
                  {pillarImages[index] && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] group-hover:opacity-[0.25] group-hover:scale-110 transition-all duration-700">
                      <Image
                        src={pillarImages[index]}
                        alt=""
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-8"
                      />
                    </div>
                  )}

                  <div className="relative p-8 space-y-4">
                    <div className="icon-bounce inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-medium tracking-tight group-hover:text-primary transition-colors duration-300">
                      {pillar.name}
                    </h2>

                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {pillar.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-primary pt-2">
                      <span className="group-hover:tracking-wider transition-all duration-300">Explore</span>
                      <ArrowRight className="arrow-funky w-4 h-4 ml-2 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Background illustration - animated drift */}
        {heroImage && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="bg-illustration absolute inset-0 flex items-center justify-center opacity-[0.08] transition-opacity duration-1000">
              <Image
                src={heroImage}
                alt=""
                width={800}
                height={800}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        )}

        {/* Floating decorative blobs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 morph-blob float-animation pointer-events-none" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary/5 morph-blob float-animation pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/10 morph-blob float-animation pointer-events-none" style={{ animationDelay: '4s' }} />
      </section>

      {/* Philosophy */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24">
          <div className="philosophy-text max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <p className="text-sm font-medium tracking-widest text-muted-foreground/60 uppercase hover:tracking-[0.3em] transition-all duration-500 cursor-default">
              sauntering with purpose
            </p>
            <h3 className="text-3xl font-light tracking-tight hover:text-primary transition-colors duration-500">
              Movement is not a competition by default
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              1HP believes consistency matters more than extremes.
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 mx-1">Walking counts.</span>
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 mx-1">Rest counts.</span>
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 mx-1">Aging counts.</span>
              <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300 mx-1">Returning counts.</span>
              We treat your body as one continuous system — not separate sports,
              not isolated achievements.
            </p>
          </div>
        </div>

        {/* Subtle background illustration with drift */}
        {pillarImages[0] && (
          <div className="bg-illustration absolute inset-0 pointer-events-none opacity-[0.06]" style={{ animationDelay: '5s' }}>
            <Image
              src={pillarImages[0]}
              alt=""
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* More floating blobs */}
        <div className="absolute top-10 right-1/4 w-20 h-20 bg-primary/5 morph-blob float-animation pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/4 w-28 h-28 bg-primary/5 morph-blob float-animation pointer-events-none" style={{ animationDelay: '3s' }} />
      </section>
    </div>
  )
}
