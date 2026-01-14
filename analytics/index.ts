/**
 * @1hp/analytics
 *
 * Product analytics for 1HP.
 *
 * IMPORTANT: This module tracks INTERACTION, not the BODY.
 * User performance data is never used for engagement analytics.
 */

export {
  initAnalytics,
  identifyUser,
  resetIdentity,
  trackPageView,
  // Participate
  trackEventDiscovered,
  trackEventSaved,
  trackEventUnsaved,
  // Equip
  trackProductViewed,
  trackCheckoutStarted,
  trackCheckoutCompleted,
  // Runstate
  trackRunstateViewed,
  trackRunstateExplanationOpened,
  // Connection
  trackDataSourceConnected,
  trackDataSourceDisconnected,
} from './posthog'
