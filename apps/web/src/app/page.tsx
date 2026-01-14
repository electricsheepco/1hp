import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Bike, Footprints, Waves } from 'lucide-react'

const pillars = [
  {
    name: 'Participate',
    href: '/participate',
    description: 'Find where humans move together. Running, cycling, swimming, walking — events across India.',
    icon: Footprints,
    image: '/patterns/runners.png',
  },
  {
    name: 'Equip',
    href: '/equip',
    description: 'Gear that lasts. Apparel and accessories for human-powered movement.',
    icon: Bike,
    image: '/patterns/people-standing.png',
  },
  {
    name: 'Understand',
    href: '/runstate',
    description: 'Know where you are. Your body as one continuous system across all movement.',
    icon: Waves,
    image: '/patterns/mixed-sports.png',
  },
]

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero - clean and minimal */}
      <section className="relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight">
                1HP
              </h1>
              <p className="text-2xl sm:text-3xl font-light text-foreground/80">
                One Human Powered
              </p>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Movement, by humans. A home for those who run, walk, cycle, swim,
                and move themselves through space.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center">
                <Link
                  href="/participate"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                >
                  Find Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/runstate"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Check Runstate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Illustration strip */}
      <section className="border-y border-border overflow-hidden">
        <div className="relative h-24 sm:h-32">
          <Image
            src="/patterns/mixed-sports.png"
            alt=""
            fill
            className="object-cover object-center opacity-60"
          />
        </div>
      </section>

      {/* Pillars with images */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="group bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Image strip at top of card */}
                  <div className="relative h-20 overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt=""
                      fill
                      className="object-cover object-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                      <Icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-xl font-medium tracking-tight">
                      {pillar.name}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors pt-2">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Philosophy - text focused */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-sm font-medium tracking-widest text-muted-foreground/60 uppercase">
              sauntering with purpose
            </p>
            <h3 className="text-3xl font-light tracking-tight">
              Movement is not a competition by default
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              1HP believes consistency matters more than extremes.
              Walking counts. Rest counts. Aging counts. Returning counts.
              We treat your body as one continuous system — not separate sports,
              not isolated achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom illustration strip */}
      <section className="border-t border-border overflow-hidden">
        <div className="relative h-20">
          <Image
            src="/patterns/runners.png"
            alt=""
            fill
            className="object-cover object-center opacity-40"
          />
        </div>
      </section>
    </div>
  )
}
