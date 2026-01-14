/**
 * @1hp/analytics — PostHog Integration
 *
 * GUARDRAILS (from ATOM):
 *
 * PostHog is allowed ONLY for:
 * - Feature usage
 * - UX friction detection
 * - Funnel understanding (Discover → Understand → Equip)
 *
 * PostHog is FORBIDDEN from:
 * - Tracking physiological values
 * - Tracking Runstate metric values
 * - Individual performance analysis
 * - Engagement optimisation
 * - Behaviour nudging
 * - Heatmaps on Runstate screens
 * - A/B testing Runstate meaning
 *
 * This module enforces these guardrails through its API design.
 */

import posthog from 'posthog-js'

let initialized = false

/**
 * Initialize PostHog. Call once at app startup.
 */
export function initAnalytics(apiKey: string, options?: { debug?: boolean }) {
  if (typeof window === 'undefined') {
    return
  }

  if (initialized) {
    return
  }

  posthog.init(apiKey, {
    api_host: 'https://app.posthog.com',
    capture_pageview: false, // We control this manually
    capture_pageleave: true,
    disable_session_recording: true, // No session recording
    disable_surveys: true,
    autocapture: false, // No autocapture — explicit events only
    ...options,
  })

  initialized = true
}

/**
 * Identify a user. Called after authentication.
 *
 * GUARDRAIL: Only accepts user ID. No performance or physiological traits.
 */
export function identifyUser(userId: string) {
  if (!initialized) return
  posthog.identify(userId)
}

/**
 * Reset identity on logout.
 */
export function resetIdentity() {
  if (!initialized) return
  posthog.reset()
}

// ============================================
// ALLOWED EVENTS
// ============================================

/**
 * Track page view. Call on route change.
 */
export function trackPageView(path: string) {
  if (!initialized) return
  posthog.capture('$pageview', { path })
}

// --- Participate (Events) ---

export function trackEventDiscovered(eventId: string, activityType: string) {
  if (!initialized) return
  posthog.capture('event_discovered', {
    event_id: eventId,
    activity_type: activityType,
  })
}

export function trackEventSaved(eventId: string) {
  if (!initialized) return
  posthog.capture('event_saved', { event_id: eventId })
}

export function trackEventUnsaved(eventId: string) {
  if (!initialized) return
  posthog.capture('event_unsaved', { event_id: eventId })
}

// --- Equip (Store) ---

export function trackProductViewed(productId: string) {
  if (!initialized) return
  posthog.capture('store_product_viewed', { product_id: productId })
}

export function trackCheckoutStarted() {
  if (!initialized) return
  posthog.capture('store_checkout_started')
}

export function trackCheckoutCompleted() {
  if (!initialized) return
  posthog.capture('store_checkout_completed')
}

// --- Runstate (Understand) ---

/**
 * Track that Runstate was viewed.
 *
 * GUARDRAIL: No load, trend, baseline, or any computed values.
 */
export function trackRunstateViewed() {
  if (!initialized) return
  posthog.capture('runstate_viewed')
}

/**
 * Track that the explanation panel was opened.
 *
 * GUARDRAIL: No content of the explanation is tracked.
 */
export function trackRunstateExplanationOpened() {
  if (!initialized) return
  posthog.capture('runstate_explanation_opened')
}

// --- Connection ---

export function trackDataSourceConnected(source: string) {
  if (!initialized) return
  posthog.capture('data_source_connected', { source })
}

export function trackDataSourceDisconnected(source: string) {
  if (!initialized) return
  posthog.capture('data_source_disconnected', { source })
}
