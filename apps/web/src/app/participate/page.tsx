'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, ExternalLink, Bike, Footprints, Waves, Trophy, PersonStanding } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActivityType = 'run' | 'cycle' | 'swim' | 'tri' | 'walk'

interface Event {
  id: string
  name: string
  date: Date
  location: string
  activityType: ActivityType
  distances: string[]
  url: string
}

// Sample events data - spread across the year for heatmap demo
const sampleEvents: Event[] = [
  { id: '1', name: 'Mumbai Marathon', date: new Date(2025, 0, 19), location: 'Mumbai, Maharashtra', activityType: 'run', distances: ['Full', 'Half', '10K', '5K'], url: '#' },
  { id: '2', name: 'Tour of Nilgiris', date: new Date(2025, 0, 25), location: 'Ooty, Tamil Nadu', activityType: 'cycle', distances: ['200K', '100K'], url: '#' },
  { id: '3', name: 'Goa Triathlon', date: new Date(2025, 0, 25), location: 'Panjim, Goa', activityType: 'tri', distances: ['Olympic', 'Sprint'], url: '#' },
  { id: '4', name: 'Delhi Half Marathon', date: new Date(2025, 0, 25), location: 'New Delhi', activityType: 'run', distances: ['Half', '10K'], url: '#' },
  { id: '5', name: 'Bengaluru Ultra', date: new Date(2025, 1, 8), location: 'Bengaluru, Karnataka', activityType: 'run', distances: ['50K', '25K'], url: '#' },
  { id: '6', name: 'Chennai Heritage Walk', date: new Date(2025, 1, 15), location: 'Chennai, Tamil Nadu', activityType: 'walk', distances: ['10K', '5K'], url: '#' },
  { id: '7', name: 'Open Water Swim Goa', date: new Date(2025, 1, 22), location: 'Goa', activityType: 'swim', distances: ['3K', '1K'], url: '#' },
  { id: '8', name: 'Hyderabad 10K', date: new Date(2025, 2, 2), location: 'Hyderabad, Telangana', activityType: 'run', distances: ['10K', '5K'], url: '#' },
  { id: '9', name: 'Kerala Cycle Challenge', date: new Date(2025, 2, 15), location: 'Kochi, Kerala', activityType: 'cycle', distances: ['100K', '50K'], url: '#' },
  { id: '10', name: 'Pune Marathon', date: new Date(2025, 2, 15), location: 'Pune, Maharashtra', activityType: 'run', distances: ['Full', 'Half'], url: '#' },
  { id: '11', name: 'Kolkata Run', date: new Date(2025, 3, 6), location: 'Kolkata, West Bengal', activityType: 'run', distances: ['Half', '10K'], url: '#' },
  { id: '12', name: 'Ahmedabad Triathlon', date: new Date(2025, 3, 20), location: 'Ahmedabad, Gujarat', activityType: 'tri', distances: ['Sprint'], url: '#' },
  { id: '13', name: 'Jaipur Pink City Run', date: new Date(2025, 4, 4), location: 'Jaipur, Rajasthan', activityType: 'run', distances: ['Half', '10K', '5K'], url: '#' },
  { id: '14', name: 'Leh Ladakh Cycling', date: new Date(2025, 5, 15), location: 'Leh, Ladakh', activityType: 'cycle', distances: ['300K'], url: '#' },
  { id: '15', name: 'Manali Ultra', date: new Date(2025, 6, 12), location: 'Manali, Himachal Pradesh', activityType: 'run', distances: ['50K', '25K'], url: '#' },
  { id: '16', name: 'Coorg Trail Run', date: new Date(2025, 7, 23), location: 'Coorg, Karnataka', activityType: 'run', distances: ['30K', '15K'], url: '#' },
  { id: '17', name: 'Mumbai Monsoon Run', date: new Date(2025, 7, 23), location: 'Mumbai, Maharashtra', activityType: 'run', distances: ['10K', '5K'], url: '#' },
  { id: '18', name: 'Pondicherry Swim', date: new Date(2025, 8, 14), location: 'Pondicherry', activityType: 'swim', distances: ['2K', '1K'], url: '#' },
  { id: '19', name: 'Nashik Wine Run', date: new Date(2025, 9, 5), location: 'Nashik, Maharashtra', activityType: 'run', distances: ['21K', '10K'], url: '#' },
  { id: '20', name: 'Ironman Goa', date: new Date(2025, 10, 16), location: 'Goa', activityType: 'tri', distances: ['Full', '70.3'], url: '#' },
  { id: '21', name: 'Ironman Goa Relay', date: new Date(2025, 10, 16), location: 'Goa', activityType: 'tri', distances: ['Relay'], url: '#' },
  { id: '22', name: 'Chennai Marathon', date: new Date(2025, 11, 7), location: 'Chennai, Tamil Nadu', activityType: 'run', distances: ['Full', 'Half', '10K'], url: '#' },
  { id: '23', name: 'Year End Walk', date: new Date(2025, 11, 31), location: 'Multiple Cities', activityType: 'walk', distances: ['5K'], url: '#' },
]

const activityConfig: Record<ActivityType, { label: string; icon: typeof Footprints }> = {
  run: { label: 'Run', icon: Footprints },
  cycle: { label: 'Cycle', icon: Bike },
  swim: { label: 'Swim', icon: Waves },
  tri: { label: 'Triathlon', icon: Trophy },
  walk: { label: 'Walk', icon: PersonStanding },
}

const activityTypes: ActivityType[] = ['run', 'cycle', 'swim', 'tri', 'walk']

// Cyan color scale for events (light to dark)
const cyanScale = [
  'bg-cyan-50',
  'bg-cyan-200',
  'bg-cyan-400',
  'bg-cyan-600',
  'bg-cyan-800',
]

function getEventCountForDate(date: Date, events: Event[]): number {
  return events.filter(e =>
    e.date.getFullYear() === date.getFullYear() &&
    e.date.getMonth() === date.getMonth() &&
    e.date.getDate() === date.getDate()
  ).length
}

function getCyanClass(count: number): string {
  if (count === 0) return 'bg-muted'
  if (count === 1) return cyanScale[1]
  if (count === 2) return cyanScale[2]
  if (count === 3) return cyanScale[3]
  return cyanScale[4]
}

function generateYearDates(year: number): Date[] {
  const dates: Date[] = []
  const startDate = new Date(year, 0, 1)
  // Adjust to start from Sunday
  const startDay = startDate.getDay()
  const adjustedStart = new Date(startDate)
  adjustedStart.setDate(adjustedStart.getDate() - startDay)

  // Generate 53 weeks worth of dates
  for (let i = 0; i < 53 * 7; i++) {
    const date = new Date(adjustedStart)
    date.setDate(adjustedStart.getDate() + i)
    dates.push(date)
  }
  return dates
}

export default function ParticipatePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const filteredEvents = sampleEvents.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.activityType === activeFilter
    return matchesFilter
  })

  const eventsForSelectedMonth = filteredEvents.filter(event => {
    const eventMonth = event.date.getMonth()
    const eventYear = event.date.getFullYear()
    return eventMonth === month && eventYear === year
  })

  const yearDates = generateYearDates(year)

  // Group events by date for the list
  const eventsByDate = (selectedDate ?
    filteredEvents.filter(e =>
      e.date.getFullYear() === selectedDate.getFullYear() &&
      e.date.getMonth() === selectedDate.getMonth() &&
      e.date.getDate() === selectedDate.getDate()
    ) : eventsForSelectedMonth
  ).reduce((acc, event) => {
    const dateKey = event.date.toISOString().split('T')[0]
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">Participate</h1>
          <p className="text-lg text-muted-foreground">Find human-powered events across India</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Heatmap */}
        <div className="mb-8 p-6 border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              {filteredEvents.length} events in {year}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-muted" />
                {cyanScale.slice(1).map((cls, i) => (
                  <div key={i} className={cn('w-3 h-3 rounded-sm', cls)} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Month labels */}
          <div className="flex mb-1 text-xs text-muted-foreground">
            <div className="w-8" /> {/* Spacer for day labels */}
            {monthNames.map((m, i) => (
              <div key={m} className="flex-1 text-center">
                {m}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-around w-8 text-xs text-muted-foreground pr-2">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-rows-7 grid-flow-col gap-0.5">
              {yearDates.map((date, i) => {
                const count = getEventCountForDate(date, filteredEvents)
                const isCurrentYear = date.getFullYear() === year
                const isSelected = selectedDate &&
                  date.getFullYear() === selectedDate.getFullYear() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getDate() === selectedDate.getDate()

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (count > 0 && isCurrentYear) {
                        setSelectedDate(date)
                        setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1))
                      }
                    }}
                    className={cn(
                      'w-3 h-3 rounded-sm transition-all',
                      isCurrentYear ? getCyanClass(count) : 'bg-transparent',
                      count > 0 && isCurrentYear && 'cursor-pointer hover:ring-2 hover:ring-foreground/20 hover:scale-125',
                      isSelected && 'ring-2 ring-foreground scale-125'
                    )}
                    title={isCurrentYear ? `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: ${count} event${count !== 1 ? 's' : ''}` : ''}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-3 py-1.5 text-sm rounded border transition-all duration-200',
                activeFilter === 'all'
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:border-foreground/50 hover:bg-muted/50'
              )}
            >
              All
            </button>
            {activityTypes.map(type => {
              const config = activityConfig[type]
              const Icon = config.icon
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded border transition-all duration-200 flex items-center gap-1.5',
                    activeFilter === type
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/50 hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Month navigation and events */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-muted rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-medium min-w-[180px] text-center">
              {fullMonthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-muted rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Events list */}
        <div className="space-y-8">
          {Object.entries(eventsByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([dateKey, events]) => {
              const date = new Date(dateKey)
              return (
                <div key={dateKey}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    {date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map(event => {
                      const config = activityConfig[event.activityType]
                      const Icon = config.icon
                      return (
                        <a
                          key={event.id}
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-card border border-border rounded-lg p-5 hover:border-foreground/20 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center justify-center w-7 h-7 rounded bg-muted group-hover:bg-muted/80 transition-colors">
                                  <Icon className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  {config.label}
                                </span>
                              </div>

                              <h4 className="text-lg font-medium tracking-tight group-hover:text-foreground/80 transition-colors">
                                {event.name}
                              </h4>

                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                                <span className="text-sm">{event.location}</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {event.distances.map(distance => (
                                  <span
                                    key={distance}
                                    className="px-2 py-0.5 text-xs font-medium bg-muted rounded"
                                  >
                                    {distance}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          {Object.keys(eventsByDate).length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No events found for this month.</p>
              <p className="text-sm text-muted-foreground mt-2">Try selecting a different month or filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
