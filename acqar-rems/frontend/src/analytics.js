// import ReactGA from "react-ga4";

// export const initGA = () => {
//   ReactGA.initialize("G-3ZRKF69290");
// };

// export const trackPage = (path) => {
//   ReactGA.send({ hitType: "pageview", page: path, title: document.title });
// };

// export const trackEvent = (eventName, params = {}) => {
//   ReactGA.event(eventName, params);
// };




import ReactGA from "react-ga4";
import posthog from "posthog-js";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
  capture_pageview: false,
})

export function trackPage(path) {
  posthog.capture('$pageview', { path })
}

export function trackEvent(eventName, params = {}) {
  posthog.capture(eventName, params)
}
