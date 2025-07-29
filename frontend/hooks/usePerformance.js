"use client";

import { useEffect, useCallback } from "react";

export const usePerformance = () => {
  const reportMetric = useCallback((name, value, id) => {
    // Send to analytics service in production
    // if (process.env.NODE_ENV === "development") {
    //   console.log(`Performance Metric - ${name}:`, value);
    // }
    
    // Report to web vitals
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, {
        event_category: "Web Vitals",
        event_label: id,
        value: Math.round(name === "CLS" ? value * 1000 : value),
        non_interaction: true,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Report LCP
    const reportLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportMetric("LCP", lastEntry.startTime, lastEntry.id);
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    };

    // Report FID
    const reportFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          reportMetric("FID", entry.processingStart - entry.startTime, entry.id);
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
    };

    // Report CLS
    const reportCLS = () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        reportMetric("CLS", clsValue, "cls-observer");
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    };

    // Report TTFB
    const reportTTFB = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "navigation") {
            reportMetric("TTFB", entry.responseStart - entry.requestStart, entry.id);
          }
        });
      });
      observer.observe({ entryTypes: ["navigation"] });
    };

    // Initialize observers
    reportLCP();
    reportFID();
    reportCLS();
    reportTTFB();

    return () => {
      // Cleanup observers if needed
    };
  }, [reportMetric]);

  return { reportMetric };
}; 
