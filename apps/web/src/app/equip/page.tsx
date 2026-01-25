'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Shirt, Watch } from 'lucide-react'

type Category = 'all' | 'apparel' | 'accessories'

interface Product {
  id: string
  name: string
  variant: string
  price: number
  category: 'apparel' | 'accessories'
  image: string
  slug: string
}

// Sample products
const products: Product[] = [
  {
    id: '1',
    name: '1HP Tee',
    variant: 'Black',
    price: 1200,
    category: 'apparel',
    image: '/products/tee-black.jpg',
    slug: 'tee-black',
  },
  {
    id: '2',
    name: '1HP Tee',
    variant: 'White',
    price: 1200,
    category: 'apparel',
    image: '/products/tee-white.jpg',
    slug: 'tee-white',
  },
  {
    id: '3',
    name: 'Movement Cap',
    variant: 'Stone',
    price: 800,
    category: 'accessories',
    image: '/products/cap-stone.jpg',
    slug: 'cap-stone',
  },
  {
    id: '4',
    name: 'Run Socks',
    variant: '3-Pack',
    price: 600,
    category: 'accessories',
    image: '/products/socks.jpg',
    slug: 'run-socks',
  },
  {
    id: '5',
    name: 'Long Sleeve',
    variant: 'Navy',
    price: 1800,
    category: 'apparel',
    image: '/products/longsleeve-navy.jpg',
    slug: 'longsleeve-navy',
  },
  {
    id: '6',
    name: 'Buff',
    variant: 'Charcoal',
    price: 500,
    category: 'accessories',
    image: '/products/buff.jpg',
    slug: 'buff-charcoal',
  },
  {
    id: '7',
    name: 'Arm Sleeves',
    variant: 'White',
    price: 450,
    category: 'accessories',
    image: '/products/arm-sleeves.jpg',
    slug: 'arm-sleeves',
  },
  {
    id: '8',
    name: 'Running Shorts',
    variant: 'Black',
    price: 1400,
    category: 'apparel',
    image: '/products/shorts-black.jpg',
    slug: 'shorts-black',
  },
]

const categoryConfig: Record<Category, { label: string; icon?: typeof Shirt }> = {
  all: { label: 'All' },
  apparel: { label: 'Apparel', icon: Shirt },
  accessories: { label: 'Accessories', icon: Watch },
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function EquipPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filteredProducts = products.filter(
    product => activeCategory === 'all' || product.category === activeCategory
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Funky animated styles */}
      <style jsx>{`
        @keyframes slide-down {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3) translateY(50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-5px); }
          70% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .header-animate {
          animation: slide-down 0.6s ease-out forwards;
        }

        .header-subtitle {
          animation: slide-down 0.6s ease-out 0.1s forwards;
          opacity: 0;
        }

        .filter-animate {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .product-card {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }

        .product-card:hover .product-image {
          animation: float 2s ease-in-out infinite;
        }

        .filter-btn:hover {
          animation: wiggle 0.3s ease-in-out;
        }

        .price-tag {
          background: linear-gradient(90deg, transparent, rgba(201, 100, 66, 0.1), transparent);
          background-size: 200% 100%;
        }

        .price-tag:hover {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="header-animate text-4xl font-light tracking-tight mb-2">
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">E</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">q</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">u</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">i</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">p</span>
          </h1>
          <p className="header-subtitle text-lg text-muted-foreground">Gear that lasts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="filter-animate flex items-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <div className="flex gap-2">
            {(['all', 'apparel', 'accessories'] as Category[]).map(category => {
              const config = categoryConfig[category]
              const Icon = config.icon
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'filter-btn px-4 py-2 text-sm rounded border transition-all duration-300 flex items-center gap-1.5 hover:scale-105',
                    activeCategory === category
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/50 hover:bg-muted/50'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/equip/${product.slug}`}
              className="product-card group"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden relative hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                {/* Placeholder for product image */}
                <div className="product-image absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <svg
                    className="w-16 h-16 group-hover:scale-125 group-hover:text-primary/30 transition-all duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {/* Hover overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-primary/0 border-l-[40px] border-l-transparent group-hover:border-t-primary/20 transition-all duration-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium tracking-tight group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">{product.variant}</p>
                <p className="price-tag text-sm font-medium inline-block px-2 py-0.5 rounded group-hover:bg-primary/10 transition-all duration-300">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
