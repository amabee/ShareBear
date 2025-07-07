// USER RELATED SHTS
export const findUserByEmail = async (prisma, email) => {
  return prisma.user.findUnique({
    where: { email },
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
  numericString,
  hashedPassword,
  userInfo
) => {
  return prisma.user.create({
    data: {
      email,
      username: numericString,
      passwordHash: hashedPassword,
      userInfo: {
        create: {
          firstName: userInfo?.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo?.lastName,
          gender: userInfo?.gender,
          birthDate: userInfo?.birthDate,
          location: userInfo?.location,
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
  return prisma.userSession.findUnique({
    where: { refreshToken },
    include: { user: true },
  });
};

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

// FOR ROTATING / REFRESHING THE USER TOKEN -> GENERATE NEW TOKEN AND UPDATE SESSION

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
      refreshToken: newRefreshToken,
      expiresAt: newExpiry,
      deviceInfo: req.headers["user-agent"] || null,
      ipAddress: req.ip,
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
