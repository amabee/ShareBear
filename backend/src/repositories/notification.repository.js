export const createNotification = async (prisma, notificationData) => {
  return await prisma.notification.create({
    data: notificationData,
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              profilePictureUrl: true,
              displayName: true,
            },
          },
        },
      },
      post: {
        select: {
          id: true,
          caption: true,
          thumbnailUrl: true,
        },
      },
    },
  });
};

export const getNotificationsByUserId = async (
  prisma,
  userId,
  options = {}
) => {
  const {
    limit = 20,
    offset = 0,
    status = null,
    type = null,
    includeExpired = false,
  } = options;

  const whereClause = {
    recipientId: userId,
    isDeleted: false,
  };

  if (status) {
    whereClause.status = status;
  }

  if (type) {
    whereClause.type = type;
  }

  if (!includeExpired) {
    whereClause.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
  }

  return await prisma.notification.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              profilePictureUrl: true,
              displayName: true,
            },
          },
        },
      },
      post: {
        select: {
          id: true,
          caption: true,
          thumbnailUrl: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
        },
      },
      follow: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
};

export const markNotificationAsRead = async (
  prisma,
  notificationId,
  userId
) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
      status: "UNREAD",
    },
    data: {
      status: "READ",
      readAt: new Date(),
    },
  });
};

export const markAllNotificationsAsRead = async (prisma, userId) => {
  return await prisma.notification.updateMany({
    where: {
      recipientId: userId,
      status: "UNREAD",
      isDeleted: false,
    },
    data: {
      status: "READ",
      readAt: new Date(),
    },
  });
};

export const getUnreadNotificationCount = async (prisma, userId) => {
  return await prisma.notification.count({
    where: {
      recipientId: userId,
      status: "UNREAD",
      isDeleted: false,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
};

export const deleteNotification = async (prisma, notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const archiveNotification = async (prisma, notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      recipientId: userId,
    },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  });
};

export const bulkMarkAsRead = async (prisma, notificationIds, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      recipientId: userId,
      status: "UNREAD",
    },
    data: {
      status: "READ",
      readAt: new Date(),
    },
  });
};

export const getNotificationById = async (prisma, notificationId, userId) => {
  return await prisma.notification.findFirst({
    where: {
      id: notificationId,
      recipientId: userId,
      isDeleted: false,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              profilePictureUrl: true,
              displayName: true,
            },
          },
        },
      },
      post: {
        select: {
          id: true,
          caption: true,
          thumbnailUrl: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });
};

// Cleanup functions for maintenance
export const deleteExpiredNotifications = async (prisma) => {
  return await prisma.notification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};

export const deleteOldReadNotifications = async (prisma, daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return await prisma.notification.deleteMany({
    where: {
      status: "READ",
      readAt: {
        lt: cutoffDate,
      },
    },
  });
};

// Batch operations
export const createNotificationBatch = async (prisma, batchData) => {
  return await prisma.notificationBatch.create({
    data: batchData,
  });
};

export const findSimilarNotifications = async (
  prisma,
  recipientId,
  type,
  postId,
  timeWindow = 5
) => {
  const cutoffTime = new Date();
  cutoffTime.setMinutes(cutoffTime.getMinutes() - timeWindow);

  return await prisma.notification.findMany({
    where: {
      recipientId,
      type,
      postId,
      createdAt: {
        gte: cutoffTime,
      },
      status: "UNREAD",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          userInfo: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });
};
