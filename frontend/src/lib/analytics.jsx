import ReactGA from "react-ga4";
import api from "./api";
import { v4 as uuidv4 } from "uuid";

/**
 * Ensures anonymous tracking bridges consistently if the user isn't logged in.
 */
const getAnonymousId = () => {
  let aId = localStorage.getItem("quad_anonymous_id");
  if (!aId) {
    aId = uuidv4();
    localStorage.setItem("quad_anonymous_id", aId);
  return aId;
};

// Replace with your actual GA4 Measurement ID in .env
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || "G-XXXXXXXXXX";

let isInitialized = false;

export const initAnalytics = (consentGranted) => {
  if (consentGranted && !isInitialized) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    isInitialized = true;
};

export const setAnalyticsUser = (userId) => {
  if (isInitialized) {
    ReactGA.set({ userId });
  localStorage.setItem("quad_user_id", userId);
};

export const trackPageView = (path) => {
  // 1. Google Analytics
  if (isInitialized) {
    ReactGA.send({ hitType: "pageview", page });
  // 2. Custom Mongoose Backend Aggregation
  const userId = localStorage.getItem("quad_user_id");
  const anonymousId = getAnonymousId();

  // Async fire-and-forget
  api
    .post("/analytics/track", {
      path,
      action: "page_view",
      category: "navigation",
      anonymousId,
      metadata,
    })
    .catch(() => {}); // Suppress errors to not pollute console
};

export const trackEvent = (category, action, label, value) => {
  if (isInitialized) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  const userId = localStorage.getItem("quad_user_id");
  const anonymousId = getAnonymousId();
  const path = window.location.pathname;

  api
    .post("/analytics/track", {
      path,
      category,
      action,
      label,
      value,
      anonymousId,
      metadata,
    })
    .catch(() => {});
};
