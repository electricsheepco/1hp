'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewState = 'empty' | 'insufficient' | 'active'

interface DailyLoad {
  date: Date
  load: number
}

interface RunstateData {
  load: number
  baseline: number
  trend: 'rising' | 'stable' | 'falling'
  balance: number
  inputCount: number
  inputWindow: number
  computedAt: Date
}

// Generate sample daily load data for the past year
function generateSampleLoadData(): DailyLoad[] {
  const data: DailyLoad[] = []
  const today = new Date()
  const startDate = new Date(today.getFullYear(), 0, 1)

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    // Simulate varied training load
    const dayOfWeek = d.getDay()
    const weekOfYear = Math.floor((d.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))

    // Base pattern: higher on weekends, rest days mid-week
    let baseLoad = 0
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseLoad = 30 + Math.random() * 40 // Weekend long sessions
    } else if (dayOfWeek === 1 || dayOfWeek === 4) {
      baseLoad = 15 + Math.random() * 25 // Easy days
    } else if (dayOfWeek === 2 || dayOfWeek === 5) {
      baseLoad = 20 + Math.random() * 35 // Quality sessions
    } else {
      baseLoad = Math.random() * 10 // Rest or very easy
    }

    // Add some periodization (higher load every 4th week, lower every 8th)
    if (weekOfYear % 8 === 7) {
      baseLoad *= 0.5 // Recovery week
    } else if (weekOfYear % 4 === 3) {
      baseLoad *= 1.2 // Build week
    }

    // Some random rest days
    if (Math.random() < 0.15) {
      baseLoad = 0
    }

    data.push({
      date: new Date(d),
      load: Math.round(baseLoad * 10) / 10,
    })
  }

  return data
}

const sampleLoadHistory = generateSampleLoadData()

const sampleData: RunstateData = {
  load: 42.3,
  baseline: 38.5,
  trend: 'stable',
  balance: 0.1,
  inputCount: 12,
  inputWindow: 28,
  computedAt: new Date(),
}

// Orange to brick red color scale for training load
const loadColorScale = [
  'bg-orange-50',
  'bg-orange-200',
  'bg-orange-400',
  'bg-orange-600',
  'bg-red-700',
]

function getLoadColorClass(load: number): string {
  if (load === 0) return 'bg-muted'
  if (load < 15) return loadColorScale[1]
  if (load < 30) return loadColorScale[2]
  if (load < 50) return loadColorScale[3]
  return loadColorScale[4]
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

function getLoadForDate(date: Date, loadHistory: DailyLoad[]): number {
  const found = loadHistory.find(d =>
    d.date.getFullYear() === date.getFullYear() &&
    d.date.getMonth() === date.getMonth() &&
    d.date.getDate() === date.getDate()
  )
  return found?.load || 0
}

function getTrendLabel(trend: 'rising' | 'stable' | 'falling'): string {
  switch (trend) {
    case 'rising': return 'Rising'
    case 'stable': return 'Stable'
    case 'falling': return 'Falling'
  }
}

function getTrendDescription(trend: 'rising' | 'stable' | 'falling'): string {
  switch (trend) {
    case 'rising': return 'Your load has been increasing over the past two weeks.'
    case 'stable': return 'Your load has been consistent over the past two weeks.'
    case 'falling': return 'Your load has been decreasing over the past two weeks.'
  }
}

function getBalanceLabel(balance: number): string {
  if (balance < -0.3) return 'Run-focused'
  if (balance > 0.3) return 'Cycle-focused'
  return 'Balanced'
}

function getBalanceDescription(balance: number): string {
  if (balance < -0.5) return 'Your recent activity has been primarily running.'
  if (balance < -0.2) return 'Your recent activity leans toward running.'
  if (balance <= 0.2) return 'Your recent activity is balanced across types.'
  if (balance <= 0.5) return 'Your recent activity leans toward cycling.'
  return 'Your recent activity has been primarily cycling.'
}

function getLoadDescription(load: number, baseline: number): string {
  const ratio = baseline > 0 ? load / baseline : 1
  if (ratio < 0.5) return 'Your current load is well below your typical level.'
  if (ratio < 0.8) return 'Your current load is below your typical level.'
  if (ratio <= 1.2) return 'Your current load is around your typical level.'
  if (ratio <= 1.5) return 'Your current load is above your typical level.'
  return 'Your current load is well above your typical level.'
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function RunstatePage() {
  const [viewState, setViewState] = useState<ViewState>('active')
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [connected, setConnected] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = new Date().getFullYear()
  const yearDates = generateYearDates(year)

  const activeDays = sampleLoadHistory.filter(d => d.load > 0).length

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

        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3) translateY(50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(-5px); }
          70% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(201, 100, 66, 0.2); }
          50% { box-shadow: 0 0 20px rgba(201, 100, 66, 0.4); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes count-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-expand {
          0% { width: 0; }
          100% { width: var(--target-width); }
        }

        .header-animate {
          animation: slide-down 0.6s ease-out forwards;
        }

        .header-subtitle {
          animation: slide-down 0.6s ease-out 0.1s forwards;
          opacity: 0;
        }

        .connection-status {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }

        .heatmap-animate {
          animation: scale-in 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }

        .load-card {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.4s forwards;
          opacity: 0;
        }

        .stat-card {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }

        .load-value {
          animation: count-up 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .load-indicator {
          animation: glow 2s ease-in-out infinite;
        }

        .connect-btn:hover {
          animation: pulse 0.5s ease-in-out infinite;
        }

        .demo-btn:hover {
          animation: wiggle 0.3s ease-in-out;
        }

        .heatmap-cell:hover {
          animation: pulse 0.3s ease-in-out;
        }

        .expand-btn:hover svg {
          animation: wiggle 0.3s ease-in-out;
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="header-animate text-4xl font-light tracking-tight mb-2">
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">R</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">u</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">n</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">s</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">t</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">a</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">t</span>
            <span className="inline-block hover:scale-110 hover:text-primary transition-all duration-300">e</span>
          </h1>
          <p className="header-subtitle text-lg text-muted-foreground">Understanding your body</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Demo state toggle */}
        <div className="connection-status mb-8 p-4 bg-muted/50 rounded-lg max-w-3xl hover:bg-muted/70 transition-colors duration-300">
          <p className="text-xs text-muted-foreground mb-2">Demo: View different states</p>
          <div className="flex gap-2">
            {(['empty', 'insufficient', 'active'] as ViewState[]).map(state => (
              <button
                key={state}
                onClick={() => {
                  setViewState(state)
                  setConnected(state !== 'empty')
                }}
                className={cn(
                  'demo-btn px-3 py-1.5 text-xs rounded border transition-all duration-300 capitalize hover:scale-105',
                  viewState === state
                    ? 'bg-foreground text-background'
                    : 'border-border hover:border-foreground/50 hover:bg-muted/50'
                )}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Connection status */}
        {connected && (
          <div className="connection-status flex items-center justify-between mb-8 pb-8 border-b border-border max-w-3xl">
            <div className="flex items-center gap-2 group">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse group-hover:scale-150 transition-transform" />
              <span className="text-sm group-hover:text-primary transition-colors">Connected: Strava</span>
            </div>
            <button
              onClick={() => {
                setConnected(false)
                setViewState('empty')
              }}
              className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Empty state */}
        {viewState === 'empty' && (
          <div className="text-center py-16 space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <p className="text-lg">Runstate needs activity data to understand your current state.</p>
              <p className="text-muted-foreground">Connect a data source to begin.</p>
            </div>
            <button
              onClick={() => {
                setConnected(true)
                setViewState('insufficient')
              }}
              className="connect-btn inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded font-medium hover:bg-foreground/90 hover:scale-105 transition-all duration-300"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Strava
            </button>
          </div>
        )}

        {/* Insufficient data state */}
        {viewState === 'insufficient' && (
          <div className="text-center py-16 space-y-4 max-w-3xl mx-auto">
            <p className="text-lg">Runstate needs 2 more activities to provide meaningful insight.</p>
            <p className="text-muted-foreground">
              1 of 3 minimum activities recorded in the last 28 days.
            </p>
          </div>
        )}

        {/* Active state */}
        {viewState === 'active' && (
          <div className="space-y-8">
            {/* Load Heatmap */}
            <div className="heatmap-animate p-6 border border-border rounded-lg bg-card hover:border-primary/30 transition-colors duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {activeDays} active days in {year}
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    {loadColorScale.slice(1).map((cls, i) => (
                      <div key={i} className={cn('w-3 h-3 rounded-sm transition-transform hover:scale-150', cls)} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Month labels */}
              <div className="flex mb-1 text-xs text-muted-foreground">
                <div className="w-8" />
                {monthNames.map((m) => (
                  <div key={m} className="flex-1 text-center">
                    {m}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex">
                <div className="flex flex-col justify-around w-8 text-xs text-muted-foreground pr-2">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div className="flex-1 grid grid-rows-7 grid-flow-col gap-0.5">
                  {yearDates.map((date, i) => {
                    const load = getLoadForDate(date, sampleLoadHistory)
                    const isCurrentYear = date.getFullYear() === year
                    const isFuture = date > new Date()
                    const isSelected = selectedDate &&
                      date.getFullYear() === selectedDate.getFullYear() &&
                      date.getMonth() === selectedDate.getMonth() &&
                      date.getDate() === selectedDate.getDate()

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isCurrentYear && !isFuture && load > 0) {
                            setSelectedDate(isSelected ? null : date)
                          }
                        }}
                        className={cn(
                          'heatmap-cell w-3 h-3 rounded-sm transition-all duration-200',
                          isCurrentYear && !isFuture ? getLoadColorClass(load) : 'bg-transparent',
                          isCurrentYear && !isFuture && load > 0 && 'cursor-pointer hover:ring-2 hover:ring-orange-400/50 hover:scale-150',
                          isSelected && 'ring-2 ring-foreground scale-150'
                        )}
                        title={isCurrentYear && !isFuture ? `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: ${load} load` : ''}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Selected date info */}
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-2xl font-light mt-1">
                      {getLoadForDate(selectedDate, sampleLoadHistory)} <span className="text-sm text-muted-foreground">load</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Current state */}
            <div className="max-w-3xl">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Your current state</h2>

              {/* Load card */}
              <div className="load-card bg-card border border-border rounded-lg p-8 mb-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">LOAD</p>
                    <p className="load-value text-5xl font-light tracking-tight hover:text-primary transition-colors duration-300">{sampleData.load}</p>
                  </div>

                  {/* Load bar */}
                  <div className="space-y-2">
                    <div className="relative h-2 bg-muted rounded overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
                        style={{ left: `${(sampleData.baseline / 100) * 100}%` }}
                      />
                      <div
                        className="load-indicator absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full transition-all duration-500 hover:scale-150"
                        style={{ left: `${(sampleData.load / 100) * 100}%`, marginLeft: '-6px' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span className="hover:text-foreground transition-colors">baseline ({sampleData.baseline})</span>
                      <span>100</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    {getLoadDescription(sampleData.load, sampleData.baseline)}
                  </p>
                </div>
              </div>

              {/* Trend and Balance cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                  className="stat-card bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500"
                  style={{ animationDelay: '0.5s' }}
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">TREND</p>
                  <p className="text-2xl font-medium mb-3 hover:text-primary transition-colors duration-300">{getTrendLabel(sampleData.trend)}</p>
                  <p className="text-sm text-muted-foreground">
                    {getTrendDescription(sampleData.trend)}
                  </p>
                </div>

                <div
                  className="stat-card bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500"
                  style={{ animationDelay: '0.6s' }}
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">BALANCE</p>
                  <p className="text-2xl font-medium mb-3 hover:text-primary transition-colors duration-300">{getBalanceLabel(sampleData.balance)}</p>
                  <p className="text-sm text-muted-foreground">
                    {getBalanceDescription(sampleData.balance)}
                  </p>
                </div>
              </div>

              {/* About this data */}
              <div className="border-t border-border pt-8">
                <button
                  onClick={() => setExplanationOpen(!explanationOpen)}
                  className="expand-btn flex items-center justify-between w-full text-left group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">About this data</span>
                  {explanationOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                <p className="text-sm text-muted-foreground mt-2">
                  Based on {sampleData.inputCount} activities over the past {sampleData.inputWindow} days.
                  Last updated: {sampleData.computedAt.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })} at {sampleData.computedAt.toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>

                {explanationOpen && (
                  <div className="mt-6 space-y-6 text-sm">
                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium mb-3 hover:text-primary transition-colors">What Runstate measures</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Runstate combines your recent activities into a unified view of your body's
                        current state. It treats all human-powered movement — running, cycling,
                        swimming, walking — as one continuous system.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="group">
                        <h5 className="font-medium mb-1 group-hover:text-primary transition-colors">Load</h5>
                        <p className="text-muted-foreground">
                          A cumulative measure of recent physical stress. Recent activities
                          contribute more than older ones.
                        </p>
                      </div>
                      <div className="group">
                        <h5 className="font-medium mb-1 group-hover:text-primary transition-colors">Baseline</h5>
                        <p className="text-muted-foreground">
                          Your personal reference point, calculated from the past 90 days of activity.
                        </p>
                      </div>
                      <div className="group">
                        <h5 className="font-medium mb-1 group-hover:text-primary transition-colors">Trend</h5>
                        <p className="text-muted-foreground">
                          Whether your load is rising, falling, or stable compared to the previous two weeks.
                        </p>
                      </div>
                      <div className="group">
                        <h5 className="font-medium mb-1 group-hover:text-primary transition-colors">Balance</h5>
                        <p className="text-muted-foreground">
                          How your activity is distributed across different types.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium mb-3 hover:text-primary transition-colors">What Runstate does not do</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Runstate does not tell you to do more or less. It does not set goals or
                        track streaks. It observes and explains. What you do with this information
                        is yours to decide.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
