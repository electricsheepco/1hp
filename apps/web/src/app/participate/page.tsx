'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, ArrowUpRight, Bike, Footprints, Waves, Trophy, PersonStanding, Calendar } from 'lucide-react'
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

const activityConfig: Record<ActivityType, { label: string; icon: typeof Footprints; color: string }> = {
  run: { label: 'Run', icon: Footprints, color: 'text-primary' },
  cycle: { label: 'Cycle', icon: Bike, color: 'text-amber-600' },
  swim: { label: 'Swim', icon: Waves, color: 'text-blue-500' },
  tri: { label: 'Triathlon', icon: Trophy, color: 'text-purple-500' },
  walk: { label: 'Walk', icon: PersonStanding, color: 'text-green-600' },
}

const activityTypes: ActivityType[] = ['run', 'cycle', 'swim', 'tri', 'walk']

// Terracotta color scale for events (matching our theme)
const terracottaScale = [
  'bg-primary/10',
  'bg-primary/30',
  'bg-primary/50',
  'bg-primary/70',
  'bg-primary',
]

function getEventCountForDate(date: Date, events: Event[]): number {
  return events.filter(e =>
    e.date.getFullYear() === date.getFullYear() &&
    e.date.getMonth() === date.getMonth() &&
    e.date.getDate() === date.getDate()
  ).length
}

function getHeatmapClass(count: number): string {
  if (count === 0) return 'bg-muted/50'
  if (count === 1) return terracottaScale[1]
  if (count === 2) return terracottaScale[2]
  if (count === 3) return terracottaScale[3]
  return terracottaScale[4]
}

function generateYearDates(year: number): Date[] {
  const dates: Date[] = []
  const startDate = new Date(year, 0, 1)
  const startDay = startDate.getDay()

  // Create dates using local time to avoid timezone issues
  for (let i = -startDay; i < 53 * 7 - startDay; i++) {
    const date = new Date(year, 0, 1 + i)
    dates.push(date)
  }
  return dates
}

// Helper to create a date key without timezone issues
function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Parse date key back to local date (avoids UTC parsing issues)
function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function ParticipatePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const filteredEvents = sampleEvents.filter(event => {
    return activeFilter === 'all' || event.activityType === activeFilter
  })

  const eventsForSelectedMonth = filteredEvents.filter(event => {
    return event.date.getMonth() === month && event.date.getFullYear() === year
  })

  const yearDates = generateYearDates(year)

  const eventsByDate = (selectedDate ?
    filteredEvents.filter(e =>
      e.date.getFullYear() === selectedDate.getFullYear() &&
      e.date.getMonth() === selectedDate.getMonth() &&
      e.date.getDate() === selectedDate.getDate()
    ) : eventsForSelectedMonth
  ).reduce((acc, event) => {
    const dateKey = getDateKey(event.date)
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
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      <style jsx>{`
        @keyframes slide-down {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .header-animate { animation: slide-down 0.6s ease-out forwards; }
        .header-subtitle { animation: slide-down 0.6s ease-out 0.1s forwards; opacity: 0; }
        .heatmap-animate { animation: scale-in 0.5s ease-out 0.2s forwards; opacity: 0; }
        .filter-animate { animation: slide-up 0.4s ease-out 0.3s forwards; opacity: 0; }
        .list-animate { animation: fade-in 0.5s ease-out 0.4s forwards; opacity: 0; }
        .event-row { animation: slide-up 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <h1 className="header-animate text-4xl font-light tracking-tight mb-2">Participate</h1>
          <p className="header-subtitle text-lg text-muted-foreground">Find human-powered events across India</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Heatmap Calendar */}
        <div className="heatmap-animate mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              {filteredEvents.length} events in {year}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-0.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-muted/50" />
                {terracottaScale.slice(1).map((cls, i) => (
                  <div key={i} className={cn('w-2.5 h-2.5 rounded-sm', cls)} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="p-4 bg-muted/20 rounded-xl border border-border/50 relative">
            {/* Month labels - clickable */}
            <div className="flex mb-1">
              <div className="w-6" />
              {monthNames.map((m, monthIndex) => (
                <button
                  key={m}
                  onClick={() => {
                    setCurrentDate(new Date(year, monthIndex, 1))
                    setSelectedDate(null)
                  }}
                  className={cn(
                    'flex-1 text-center text-[10px] py-1 rounded transition-all duration-200',
                    month === monthIndex
                      ? 'text-primary font-medium bg-primary/10'
                      : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Heatmap grid with month highlight */}
            <div className="flex relative">
              <div className="flex flex-col justify-around w-6 text-[10px] text-muted-foreground/70 pr-1">
                <span>M</span>
                <span>W</span>
                <span>F</span>
              </div>

              <div className="flex-1 relative">
                {/* Month highlight overlay */}
                <div
                  className="absolute top-0 bottom-0 border-2 border-primary/40 rounded-md pointer-events-none transition-all duration-300 bg-primary/5"
                  style={{
                    left: `${(month / 12) * 100}%`,
                    width: `${100 / 12}%`,
                  }}
                />

                <div className="grid grid-rows-7 grid-flow-col gap-[2px]">
                  {yearDates.map((date, i) => {
                    const count = getEventCountForDate(date, filteredEvents)
                    const isCurrentYear = date.getFullYear() === year
                    const isInSelectedMonth = isCurrentYear && date.getMonth() === month
                    const isSelectedDate = selectedDate &&
                      date.getFullYear() === selectedDate.getFullYear() &&
                      date.getMonth() === selectedDate.getMonth() &&
                      date.getDate() === selectedDate.getDate()

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isCurrentYear) {
                            setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1))
                            if (count > 0) {
                              setSelectedDate(date)
                            } else {
                              setSelectedDate(null)
                            }
                          }
                        }}
                        className={cn(
                          'w-2.5 h-2.5 rounded-sm transition-all duration-200',
                          isCurrentYear ? getHeatmapClass(count) : 'bg-transparent',
                          isCurrentYear && 'cursor-pointer',
                          count > 0 && isCurrentYear && 'hover:scale-150 hover:ring-1 hover:ring-primary',
                          isSelectedDate && 'ring-2 ring-foreground scale-150',
                          isInSelectedMonth && count === 0 && 'bg-primary/5'
                        )}
                        title={isCurrentYear ? `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: ${count} event${count !== 1 ? 's' : ''}` : ''}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Month Nav */}
        <div className="filter-animate flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full transition-all duration-200',
                activeFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              All Events
            </button>
            {activityTypes.map(type => {
              const config = activityConfig[type]
              const Icon = config.icon
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1.5',
                    activeFilter === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {config.label}
                </button>
              )
            })}
          </div>

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {fullMonthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Events List */}
        <div className="list-animate space-y-6">
          {Object.entries(eventsByDate)
            .sort(([a], [b]) => parseDateKey(a).getTime() - parseDateKey(b).getTime())
            .map(([dateKey, events], groupIndex) => {
              const date = parseDateKey(dateKey)
              return (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                      <div className="text-center">
                        <div className="text-lg font-semibold leading-none">{date.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wide">{monthNames[date.getMonth()]}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{date.toLocaleDateString('en-IN', { weekday: 'long' })}</p>
                      <p className="text-xs text-muted-foreground">{events.length} event{events.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Event cards */}
                  <div className="space-y-2 pl-0 sm:pl-[60px]">
                    {events.map((event, eventIndex) => {
                      const config = activityConfig[event.activityType]
                      const Icon = config.icon
                      return (
                        <a
                          key={event.id}
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event-row group flex items-center gap-4 p-4 rounded-xl bg-card border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                          style={{ animationDelay: `${0.5 + (groupIndex * 0.1) + (eventIndex * 0.05)}s` }}
                        >
                          {/* Icon */}
                          <div className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors',
                            config.color
                          )}>
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                              {event.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            </div>
                          </div>

                          {/* Distances */}
                          <div className="hidden sm:flex items-center gap-1.5">
                            {event.distances.slice(0, 3).map((distance) => (
                              <span
                                key={distance}
                                className="px-2 py-0.5 text-xs bg-muted/50 rounded-md group-hover:bg-primary/10 transition-colors"
                              >
                                {distance}
                              </span>
                            ))}
                            {event.distances.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{event.distances.length - 3}</span>
                            )}
                          </div>

                          {/* Arrow */}
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          {Object.keys(eventsByDate).length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No events found for {fullMonthNames[month]}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try selecting a different month or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
