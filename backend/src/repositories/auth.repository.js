// USER RELATED SHTS
export const findUserByEmail = async (prisma, email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByUsername = async (prisma, username) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const findUserByEmailOrUsername = async (prisma, creds) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        {
          email: creds,
        },
        {
          username: creds,
        },
      ],
    },
  });
};

export const createUser = async (
  prisma,
  email,
  username,
  hashedPassword,
  userInfo
) => {
  return prisma.user.create({
    data: {
      email,
      username,
      passwordHash: hashedPassword,
      userInfo: {
        create: {
          firstName: userInfo.firstName,
          middleName: userInfo?.middleName,
          lastName: userInfo.lastName,
          gender: userInfo.gender,
          birthDate: userInfo.birthDate,
          location: userInfo.location,
        },
      },
    },
    include: {
      userInfo: true,
    },
  });
};

// TOKEN RELATED SHTS

// FOR FIND THE SESSION BY TOKEN
export const findSessionByToken = async (prisma, refreshToken) => {
  // First try to find by current refresh token
  let session = await prisma.userSession.findUnique({
    where: { refreshToken },
    include: { user: true },
  });

  // If not found, try to find by previous refresh token (within grace period)
  if (!session) {
    // Since previousRefreshToken is no longer unique, use findFirst
    session = await prisma.userSession.findFirst({
      where: {
        previousRefreshToken: refreshToken,
        // Only consider sessions that have rotatedAt timestamp
        rotatedAt: {
          not: null,
        },
      },
      include: { user: true },
    });

    // Check if the previous token is within grace period (30 seconds)
    if (session && session.rotatedAt) {
      const gracePeriodMs = 30 * 1000; // 30 seconds
      const timeSinceRotation = Date.now() - session.rotatedAt.getTime();

      if (timeSinceRotation > gracePeriodMs) {
        // Previous token is outside grace period, treat as not found
        return null;
      }
    } else if (session && !session.rotatedAt) {
      // No rotation timestamp, treat as invalid
      return null;
    }
  }

  return session;
};

// STORE THE REFRESHED TOKEN
export const storeRefreshToken = async (
  prisma,
  userId,
  req,
  refreshToken,
  refreshTokenExpiry
) => {
  return prisma.userSession.create({
    data: {
      userId: userId,
      refreshToken,
      deviceInfo: req.headers["user-agent"] || null,
      ipAddress: req.ip || null,
      expiresAt: refreshTokenExpiry,
    },
  });
};

// FOR ROTATING / REFRESHING THE USER TOKEN WITH GRACE PERIOD -> GENERATE NEW TOKEN AND UPDATE SESSION

export const rotateRefreshToken = async (
  prisma,
  session,
  newRefreshToken,
  newExpiry,
  req
) => {
  return prisma.userSession.update({
    where: { id: session.id },
    data: {
      previousRefreshToken: session.refreshToken, // Store current as previous
      refreshToken: newRefreshToken, // Set new as current
      rotatedAt: new Date(), // Mark rotation time
      expiresAt: newExpiry,
      deviceInfo: req.headers["user-agent"] || null,
      ipAddress: req.ip,
    },
  });
};

// CLEANUP THE OLD PREVIOUS TOKENS BIATCH!
export const cleanupExpiredPreviousTokens = async (prisma) => {
  const gracePeriodMs = 60 * 1000; // 1 minute cleanup
  const cutoffTime = new Date(Date.now() - gracePeriodMs);

  return prisma.userSession.updateMany({
    where: {
      rotatedAt: {
        lt: cutoffTime,
      },
      previousRefreshToken: {
        not: null,
      },
    },
    data: {
      previousRefreshToken: null,
      rotatedAt: null,
    },
  });
};

// FOR DELETING THE SESSION WITH THE GIVEN REFRESH TOKEN

export const deleteUserSession = async (prisma, sessionId) => {
  return prisma.userSession.delete({ where: { id: sessionId } });
};

// Update Last Active Timestamp

export const updateLastUpdatedTimeStamp = async (prisma, userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
};

// FOR DELETING THE USER SESSION WITH THE GIVEN REFRESH TOKEN -> LOGOUT ACTION

export const logoutDeleteSession = async (prisma, refreshToken) => {
  return prisma.userSession.deleteMany({
    where: { refreshToken },
  });
};
