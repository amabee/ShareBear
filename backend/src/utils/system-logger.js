// FOR CREATING LOGS
export const logEvent = async (
  prisma,
  level,
  source,
  message = null,
  options = {}
) => {
  const {
    userId = null,
    sessionId = null,
    requestId = null,
    ipAddress = null,
    userAgent = null,
    stackTrace = null,
    context = {},
  } = options;

  try {
    return await prisma.systemLogs.create({
      data: {
        level,
        source,
        message,
        userId,
        sessionId,
        requestId,
        ipAddress,
        userAgent,
        stackTrace,
        context,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to write to system logs:", error);
    console.log("Original log:", { level, source, message, options });
  }
};

// Specialized logging functions
export const logAuthEvent = async (prisma, message, req, options = {}) => {
  return logEvent(prisma, "INFO", "auth-service", message, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    requestId: req.id,
    ...options,
  });
};

export const logError = async (
  prisma,
  error,
  source,
  req = null,
  options = {}
) => {
  return logEvent(prisma, "ERROR", source, error.message, {
    ipAddress: req?.ip,
    userAgent: req?.headers["user-agent"],
    requestId: req?.id,
    stackTrace: error.stack,
    context: {
      errorName: error.name,
      ...options.context,
    },
    ...options,
  });
};

export const logUserAction = async (
  prisma,
  userId,
  action,
  req,
  details = {}
) => {
  return logEvent(prisma, "INFO", "user-action", `User performed: ${action}`, {
    userId,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    requestId: req.id,
    context: { action, ...details },
  });
};

// FOR SECURITY LOGGING
export const logSecurityEvent = async (
  prisma,
  message,
  req,
  severity = "WARN",
  details = {}
) => {
  return logEvent(prisma, severity, "security", message, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    requestId: req.id,
    context: {
      timestamp: new Date().toISOString(),
      ...details,
    },
  });
};

// FOR PERFORMANCE LOGGIN
export const logPerformance = async (
  prisma,
  operation,
  duration,
  req,
  metadata = {}
) => {
  const level = duration > 1000 ? "WARN" : "INFO"; // Warn if > 1 second
  return logEvent(
    prisma,
    level,
    "performance",
    `${operation} took ${duration}ms`,
    {
      ipAddress: req.ip,
      requestId: req.id,
      context: {
        operation,
        duration,
        ...metadata,
      },
    }
  );
};
