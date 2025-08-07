import { createNotification as createNotificationRepo } from "../repositories/notification.repository";

export const createAndSendNotification = async (
  prisma,
  fastify,
  notificationData
) => {
  try {
    // Use transaction for atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Create notification in database
      const notification = await createNotificationRepo(tx, notificationData);

      return notification;
    });

    // Send real-time notification after successful database operation
    if (fastify.sendToUser && result) {
      const websocketData = {
        type: "notification",
        data: {
          id: result.id,
          type: result.type,
          title: result.title,
          content: result.content,
          createdAt: result.createdAt,
          sender: result.sender,
          post: result.post,
          metadata: result.metadata,
        },
      };

      fastify.sendToUser(result.recipientId.toString(), websocketData);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

export const createBatchNotification = async (
  prisma,
  fastify,
  recipients,
  notificationData
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create notifications for all recipients
      const notifications = await Promise.all(
        recipients.map((recipientId) =>
          notificationRepository.createNotificationWithTransaction(tx, {
            ...notificationData,
            recipientId,
          })
        )
      );

      return notifications;
    });

    // Send real-time notifications to all recipients
    if (fastify.sendToUser && result.length > 0) {
      result.forEach((notification) => {
        const websocketData = {
          type: "notification",
          data: {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            content: notification.content,
            createdAt: notification.createdAt,
            sender: notification.sender,
            post: notification.post,
            metadata: notification.metadata,
          },
        };

        fastify.sendToUser(notification.recipientId.toString(), websocketData);
      });
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to create batch notifications: ${error.message}`);
  }
};

export const createSmartNotification = async (
  prisma,
  fastify,
  notificationData
) => {
  try {
    // Check for similar recent notifications to batch them
    const similarNotifications =
      await notificationRepository.findSimilarNotifications(
        prisma,
        notificationData.recipientId,
        notificationData.type,
        notificationData.postId,
        5 // 5 minute window
      );

    if (similarNotifications.length > 0 && notificationData.type === "LIKE") {
      // Update existing notification with batched message
      const totalCount = similarNotifications.length + 1;
      const senderNames = [
        ...similarNotifications.map(
          (n) => n.sender?.userInfo?.displayName || n.sender?.username
        ),
        notificationData.senderName || "Someone",
      ];

      const batchedContent =
        totalCount === 2
          ? `${senderNames[0]} and ${senderNames[1]} liked your post`
          : `${senderNames[0]} and ${totalCount - 1} others liked your post`;

      const result = await prisma.$transaction(async (tx) => {
        // Update the first notification
        const updatedNotification = await tx.notification.update({
          where: { id: similarNotifications[0].id },
          data: {
            content: batchedContent,
            metadata: {
              ...similarNotifications[0].metadata,
              batchCount: totalCount,
              latestSenders: senderNames.slice(0, 3), // Keep only first 3 names
            },
            updatedAt: new Date(),
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
          },
        });

        // Delete other similar notifications
        if (similarNotifications.length > 1) {
          await tx.notification.deleteMany({
            where: {
              id: { in: similarNotifications.slice(1).map((n) => n.id) },
            },
          });
        }

        return updatedNotification;
      });

      // Send updated notification
      if (fastify.sendToUser) {
        const websocketData = {
          type: "notification_update",
          data: {
            id: result.id,
            type: result.type,
            title: result.title,
            content: result.content,
            createdAt: result.createdAt,
            sender: result.sender,
            post: result.post,
            metadata: result.metadata,
          },
        };

        fastify.sendToUser(result.recipientId.toString(), websocketData);
      }

      return result;
    } else {
      // Create new notification
      return await createAndSendNotification(prisma, fastify, notificationData);
    }
  } catch (error) {
    throw new Error(`Failed to create smart notification: ${error.message}`);
  }
};

export const getUserNotifications = async (prisma, userId, options = {}) => {
  try {
    return await notificationRepository.getNotificationsByUserId(
      prisma,
      userId,
      options
    );
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

export const markAsRead = async (prisma, fastify, notificationId, userId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Mark as read
      const updated =
        await notificationRepository.markNotificationAsReadWithTransaction(
          tx,
          notificationId,
          userId
        );

      // Get updated notification
      const notification = await notificationRepository.getNotificationById(
        prisma,
        notificationId,
        userId
      );

      return { updated, notification };
    });

    // Send real-time update
    if (fastify.sendToUser && result.notification) {
      const websocketData = {
        type: "notification_read",
        data: {
          id: notificationId,
          status: "READ",
          readAt: new Date(),
        },
      };

      fastify.sendToUser(userId.toString(), websocketData);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

export const markAllAsRead = async (prisma, fastify, userId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      return await tx.notification.updateMany({
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
    });

    // Send real-time update
    if (fastify.sendToUser) {
      const websocketData = {
        type: "notifications_all_read",
        data: {
          readAt: new Date(),
          count: result.count,
        },
      };

      fastify.sendToUser(userId.toString(), websocketData);
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to mark all notifications as read: ${error.message}`
    );
  }
};

export const getUnreadCount = async (prisma, userId) => {
  try {
    return await notificationRepository.getUnreadNotificationCount(
      prisma,
      userId
    );
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};

export const deleteNotification = async (
  prisma,
  fastify,
  notificationId,
  userId
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      return await tx.notification.updateMany({
        where: {
          id: notificationId,
          recipientId: userId,
        },
        data: {
          isDeleted: true,
        },
      });
    });

    // Send real-time update
    if (fastify.sendToUser) {
      const websocketData = {
        type: "notification_deleted",
        data: {
          id: notificationId,
        },
      };

      fastify.sendToUser(userId.toString(), websocketData);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

export const archiveNotification = async (
  prisma,
  fastify,
  notificationId,
  userId
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      return await tx.notification.updateMany({
        where: {
          id: notificationId,
          recipientId: userId,
        },
        data: {
          status: "ARCHIVED",
          archivedAt: new Date(),
        },
      });
    });

    // Send real-time update
    if (fastify.sendToUser) {
      const websocketData = {
        type: "notification_archived",
        data: {
          id: notificationId,
          status: "ARCHIVED",
          archivedAt: new Date(),
        },
      };

      fastify.sendToUser(userId.toString(), websocketData);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to archive notification: ${error.message}`);
  }
};

// Utility functions
export const cleanupExpiredNotifications = async (prisma) => {
  try {
    return await notificationRepository.deleteExpiredNotifications(prisma);
  } catch (error) {
    throw new Error(
      `Failed to cleanup expired notifications: ${error.message}`
    );
  }
};

export const cleanupOldNotifications = async (prisma, daysOld = 30) => {
  try {
    return await notificationRepository.deleteOldReadNotifications(
      prisma,
      daysOld
    );
  } catch (error) {
    throw new Error(`Failed to cleanup old notifications: ${error.message}`);
  }
};
