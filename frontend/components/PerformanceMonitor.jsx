"use client";

import { usePerformance } from "@/hooks/usePerformance";

const PerformanceMonitor = () => {
  usePerformance();
  
  // This component doesn't render anything, it just initializes performance monitoring
  return null;
};

export default PerformanceMonitor; 
