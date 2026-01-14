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
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">Equip</h1>
          <p className="text-lg text-muted-foreground">Gear that lasts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex items-center gap-4 mb-8">
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
                    'px-4 py-2 text-sm rounded border transition-all duration-200 flex items-center gap-1.5',
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
          {filteredProducts.map(product => (
            <Link
              key={product.id}
              href={`/equip/${product.slug}`}
              className="group"
            >
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden relative">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <svg
                    className="w-16 h-16 group-hover:scale-110 transition-transform duration-500"
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
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium tracking-tight group-hover:text-foreground/70 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.variant}</p>
                <p className="text-sm font-medium">{formatPrice(product.price)}</p>
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
