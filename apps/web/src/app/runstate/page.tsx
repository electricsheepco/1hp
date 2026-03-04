'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ChevronDown, ChevronUp, Link as LinkIcon, RefreshCw, Loader2, Footprints, Bike, Waves, PersonStanding } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewState = 'loading' | 'empty' | 'insufficient' | 'active' | 'error'

interface DailyLoad {
  date: string
  load: number
}

interface RunstateData {
  load: number
  baseline: number
  trend: 'rising' | 'stable' | 'falling'
  balance: number
  inputCount: number
  inputWindow: number
  computedAt: string
}

interface RunstateExplanation {
  summary: string
  loadContext: string
  trendContext: string
  balanceContext: string
}

interface RecentActivity {
  id: string
  name: string | null
  date: string
  duration: string
  distance: string | null
  pace: string | null
  speed: string | null
  heartRate: number | null
}

interface ActivityMetric {
  type: string
  label: string
  count: number
  totalDuration: number
  totalDurationFormatted: string
  totalDistance: number | null
  avgPace: string | null
  avgPaceRaw: number | null
  bestPace: string | null
  bestPaceRaw: number | null
  avgSpeed: number | null
  avgHeartRate: number | null
  recentActivities: RecentActivity[]
}

// Orange to brick red colour scale for training load
const loadColourScale = [
  'bg-orange-50',
  'bg-orange-200',
  'bg-orange-400',
  'bg-orange-600',
  'bg-red-700',
]

function getLoadColourClass(load: number): string {
  if (load === 0) return 'bg-muted'
  if (load < 15) return loadColourScale[1]
  if (load < 30) return loadColourScale[2]
  if (load < 50) return loadColourScale[3]
  return loadColourScale[4]
}

function generateYearDates(year: number): Date[] {
  const dates: Date[] = []
  const startDate = new Date(year, 0, 1)
  const startDay = startDate.getDay()

  for (let i = -startDay; i < 53 * 7 - startDay; i++) {
    const date = new Date(year, 0, 1 + i)
    dates.push(date)
  }
  return dates
}

function getLoadForDate(dateStr: string, loadHistory: DailyLoad[]): number {
  const found = loadHistory.find(d => d.date === dateStr)
  return found?.load || 0
}

function getTrendLabel(trend: 'rising' | 'stable' | 'falling'): string {
  switch (trend) {
    case 'rising': return 'Rising'
    case 'stable': return 'Stable'
    case 'falling': return 'Falling'
  }
}

function getBalanceLabel(balance: number): string {
  if (balance < -0.3) return 'Run-focused'
  if (balance > 0.3) return 'Cycle-focused'
  return 'Balanced'
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function RunstatePage() {
  const { data: session, status: sessionStatus } = useSession()
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [runstateData, setRunstateData] = useState<RunstateData | null>(null)
  const [explanation, setExplanation] = useState<RunstateExplanation | null>(null)
  const [loadHistory, setLoadHistory] = useState<DailyLoad[]>([])
  const [explanationOpen, setExplanationOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [activityCount, setActivityCount] = useState(0)
  const [minimumRequired, setMinimumRequired] = useState(3)
  const [activityMetrics, setActivityMetrics] = useState<Record<string, ActivityMetric>>({})
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())

  const year = new Date().getFullYear()
  const yearDates = generateYearDates(year)

  const fetchRunstate = useCallback(async () => {
    try {
      const response = await fetch('/api/runstate')
      const data = await response.json()

      if (data.error) {
        if (response.status === 401) {
          setViewState('empty')
        } else {
          setViewState('error')
        }
        return
      }

      if (data.state === 'insufficient') {
        setActivityCount(data.activityCount)
        setMinimumRequired(data.minimumRequired)
        setViewState('insufficient')
        return
      }

      if (data.state === 'active') {
        setRunstateData(data.result)
        setExplanation(data.explanation)
        setLoadHistory(data.loadHistory || [])
        setActivityMetrics(data.activityMetrics || {})
        setViewState('active')
      }
    } catch (error) {
      console.error('Failed to fetch runstate:', error)
      setViewState('error')
    }
  }, [])

  const syncStrava = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/strava/sync', { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        // Refetch runstate after sync
        await fetchRunstate()
      }
    } catch (error) {
      console.error('Strava sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (sessionStatus === 'loading') {
      setViewState('loading')
      return
    }

    if (sessionStatus === 'unauthenticated' || !session) {
      setViewState('empty')
      return
    }

    fetchRunstate()
  }, [sessionStatus, session, fetchRunstate])

  const activeDays = loadHistory.filter(d => d.load > 0).length

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Animations */}
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
          <p className="header-subtitle text-lg text-muted-foreground">Know where you are</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading state */}
        {viewState === 'loading' && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty state - not connected */}
        {viewState === 'empty' && (
          <div className="text-center py-16 space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <p className="text-lg">Runstate needs activity data to understand your current state.</p>
              <p className="text-muted-foreground">Connect Strava to begin.</p>
            </div>
            <button
              onClick={() => signIn('strava')}
              className="connect-btn inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded font-medium hover:bg-foreground/90 hover:scale-105 transition-all duration-300"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Strava
            </button>
          </div>
        )}

        {/* Insufficient data state */}
        {viewState === 'insufficient' && (
          <div className="space-y-8">
            {/* Connection status */}
            <div className="connection-status flex items-center justify-between mb-8 pb-8 border-b border-border max-w-3xl">
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse group-hover:scale-150 transition-transform" />
                <span className="text-sm group-hover:text-primary transition-colors">Connected: Strava</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={syncStrava}
                  disabled={syncing}
                  className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300 flex items-center gap-1"
                >
                  <RefreshCw className={cn('w-3 h-3', syncing && 'animate-spin')} />
                  {syncing ? 'Syncing...' : 'Sync'}
                </button>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="text-center py-16 space-y-4 max-w-3xl mx-auto">
              <p className="text-lg">Runstate needs {minimumRequired - activityCount} more {minimumRequired - activityCount === 1 ? 'activity' : 'activities'} to provide meaningful insight.</p>
              <p className="text-muted-foreground">
                {activityCount} of {minimumRequired} minimum activities recorded in the last 28 days.
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {viewState === 'error' && (
          <div className="text-center py-16 space-y-4 max-w-3xl mx-auto">
            <p className="text-lg">Something went wrong.</p>
            <button
              onClick={fetchRunstate}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Active state */}
        {viewState === 'active' && runstateData && explanation && (
          <div className="space-y-6">
            {/* Connection status - full width */}
            <div className="connection-status flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse group-hover:scale-150 transition-transform" />
                <span className="text-sm group-hover:text-primary transition-colors">Connected: Strava</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={syncStrava}
                  disabled={syncing}
                  className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300 flex items-center gap-1"
                >
                  <RefreshCw className={cn('w-3 h-3', syncing && 'animate-spin')} />
                  {syncing ? 'Syncing...' : 'Sync'}
                </button>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Main dashboard grid - two columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Load and state (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Load Heatmap - full width of left column */}
                <div className="heatmap-animate p-6 border border-border rounded-lg bg-card hover:border-primary/30 transition-colours duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {activeDays} active days in {year}
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    {loadColourScale.slice(1).map((cls, i) => (
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
                    const dateStr = date.toISOString().split('T')[0]
                    const load = getLoadForDate(dateStr, loadHistory)
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
                          isCurrentYear && !isFuture ? getLoadColourClass(load) : 'bg-transparent',
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
                      {getLoadForDate(selectedDate.toISOString().split('T')[0], loadHistory)} <span className="text-sm text-muted-foreground">load</span>
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

            {/* Load card */}
                <div className="load-card bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">LOAD</p>
                      <p className="load-value text-4xl font-light tracking-tight hover:text-primary transition-colours duration-300">{runstateData.load}</p>
                    </div>

                    {/* Load bar */}
                    <div className="space-y-2">
                      <div className="relative h-2 bg-muted rounded overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50"
                          style={{ left: `${Math.min((runstateData.baseline / 200) * 100, 100)}%` }}
                        />
                        <div
                          className="load-indicator absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full transition-all duration-500 hover:scale-150"
                          style={{ left: `${Math.min((runstateData.load / 200) * 100, 100)}%`, marginLeft: '-6px' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span className="hover:text-foreground transition-colours">baseline ({runstateData.baseline})</span>
                        <span>200</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {explanation.loadContext}
                    </p>
                  </div>
                </div>

                {/* Trend and Balance cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="stat-card bg-card border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">TREND</p>
                    <p className="text-xl font-medium mb-2 hover:text-primary transition-colours duration-300">{getTrendLabel(runstateData.trend)}</p>
                    <p className="text-xs text-muted-foreground">
                      {explanation.trendContext}
                    </p>
                  </div>

                  <div
                    className="stat-card bg-card border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
                    style={{ animationDelay: '0.6s' }}
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">BALANCE</p>
                    <p className="text-xl font-medium mb-2 hover:text-primary transition-colours duration-300">{getBalanceLabel(runstateData.balance)}</p>
                    <p className="text-xs text-muted-foreground">
                      {explanation.balanceContext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column - Activity cards (1/3 width) */}
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground">Last 4 weeks</h2>

              {/* Activity metrics by type - stacked vertically in right column */}
              {Object.keys(activityMetrics).length > 0 && (
                <div className="space-y-3">
                    {Object.values(activityMetrics).map((metric, idx) => {
                      const isExpanded = expandedActivities.has(metric.type)
                      const toggleExpand = () => {
                        setExpandedActivities(prev => {
                          const next = new Set(prev)
                          if (next.has(metric.type)) {
                            next.delete(metric.type)
                          } else {
                            next.add(metric.type)
                          }
                          return next
                        })
                      }

                      return (
                        <button
                          key={metric.type}
                          onClick={toggleExpand}
                          className={cn(
                            "stat-card bg-card border border-border rounded-lg p-4 text-left hover:border-primary/30 transition-all duration-300",
                            isExpanded && "ring-2 ring-primary/50"
                          )}
                          style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
                        >
                          {/* Icon and expand indicator */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {metric.type === 'run' && <Footprints className="w-5 h-5" />}
                              {metric.type === 'cycle' && <Bike className="w-5 h-5" />}
                              {metric.type === 'swim' && <Waves className="w-5 h-5" />}
                              {metric.type === 'walk' && <PersonStanding className="w-5 h-5" />}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>

                          {/* Activity type and count */}
                          <p className="font-medium mb-3">{metric.label}</p>

                          {/* Stats grid */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Activities</span>
                              <span className="font-medium">{metric.count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time</span>
                              <span className="font-medium">{metric.totalDurationFormatted}</span>
                            </div>
                            {metric.totalDistance && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Distance</span>
                                <span className="font-medium">{metric.totalDistance} km</span>
                              </div>
                            )}
                            {(metric.type === 'run' || metric.type === 'walk') && metric.avgPace && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Pace</span>
                                <span className="font-medium">{metric.avgPace}/km</span>
                              </div>
                            )}
                            {metric.type === 'cycle' && metric.avgSpeed && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Speed</span>
                                <span className="font-medium">{metric.avgSpeed} km/h</span>
                              </div>
                            )}
                            {metric.avgHeartRate && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg HR</span>
                                <span className="font-medium">{metric.avgHeartRate} bpm</span>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  )}
              </div>
            </div>

            {/* Expanded activity rows - shown below the grid, full width */}
            {Object.values(activityMetrics).map((metric) => {
              const isExpanded = expandedActivities.has(metric.type)
              if (!isExpanded) return null

              return (
                <div key={`${metric.type}-expanded`} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        {metric.type === 'run' && <Footprints className="w-3 h-3" />}
                        {metric.type === 'cycle' && <Bike className="w-3 h-3" />}
                        {metric.type === 'swim' && <Waves className="w-3 h-3" />}
                        {metric.type === 'walk' && <PersonStanding className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{metric.label}</span>
                      <span className="text-sm text-muted-foreground">· {metric.count} activities</span>
                    </div>
                    <button
                      onClick={() => setExpandedActivities(prev => {
                        const next = new Set(prev)
                        next.delete(metric.type)
                        return next
                      })}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>

                  {/* Header row */}
                  <div className="px-4 py-2 grid grid-cols-5 gap-4 text-xs text-muted-foreground font-medium border-b border-border">
                    <span>Date</span>
                    <span>Distance</span>
                    <span>Duration</span>
                    <span>{metric.type === 'cycle' ? 'Speed' : 'Pace'}</span>
                    <span>HR</span>
                  </div>

                  {/* Activity rows */}
                  {metric.recentActivities.map((activity, actIdx) => (
                    <div
                      key={activity.id}
                      className={cn(
                        'px-4 py-3 grid grid-cols-5 gap-4 text-sm',
                        actIdx % 2 === 1 && 'bg-muted/10'
                      )}
                    >
                      <span className="font-medium">{activity.date}</span>
                      <span>{activity.distance || '-'}</span>
                      <span>{activity.duration}</span>
                      <span>
                        {activity.pace && `${activity.pace}/km`}
                        {activity.speed && `${activity.speed} km/h`}
                        {!activity.pace && !activity.speed && '-'}
                      </span>
                      <span>{activity.heartRate || '-'}</span>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* About this data - full width at bottom */}
            <div className="border-t border-border pt-6">
              <button
                onClick={() => setExplanationOpen(!explanationOpen)}
                className="expand-btn flex items-center justify-between w-full text-left group"
              >
                <span className="font-medium group-hover:text-primary transition-colours">About this data</span>
                {explanationOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colours" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colours" />
                )}
              </button>

              <p className="text-sm text-muted-foreground mt-2">
                Based on {runstateData.inputCount} activities over the past {runstateData.inputWindow} days.
              </p>

              {explanationOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <h5 className="font-medium mb-1">Load</h5>
                    <p className="text-muted-foreground text-xs">
                      Cumulative measure of recent physical stress. Recent activities contribute more.
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <h5 className="font-medium mb-1">Baseline</h5>
                    <p className="text-muted-foreground text-xs">
                      Personal reference point from the past 90 days of activity.
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <h5 className="font-medium mb-1">Trend</h5>
                    <p className="text-muted-foreground text-xs">
                      Whether load is rising, falling, or stable compared to previous two weeks.
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <h5 className="font-medium mb-1">Balance</h5>
                    <p className="text-muted-foreground text-xs">
                      How activity is distributed across different types.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
