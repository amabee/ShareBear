// controllers/notification.controller.js
import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, reply) => {
  const userId = req.user.userId;
  const {
    page = 1,
    limit = 20,
    status = null,
    type = null,
    includeExpired = false,
  } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await notificationService.getUserNotifications(
      req.server.prisma,
      userId,
      {
        limit: parseInt(limit),
        offset,
        status,
        type,
        includeExpired: includeExpired === "true",
      }
    );

    // Get total count for pagination
    const totalCount = await req.server.prisma.notification.count({
      where: {
        recipientId: userId,
        isDeleted: false,
        ...(status && { status }),
        ...(type && { type }),
        ...(!includeExpired && {
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        }),
      },
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    return reply.send({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to fetch notifications",
      message: error.message,
    });
  }
};

export const getNotificationById = async (req, reply) => {
  const userId = req.user.userId;
  const { notificationId } = req.params;

  try {
    const notification = await req.server.prisma.notification.findFirst({
      where: {
        id: parseInt(notificationId),
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

    if (!notification) {
      return reply.status(404).send({ error: "Notification not found" });
    }

    return reply.send({ notification });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to fetch notification",
      message: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, reply) => {
  const userId = req.user.userId;
  const { notificationId } = req.params;

  try {
    const result = await notificationService.markAsRead(
      req.server.prisma,
      req.server,
      parseInt(notificationId),
      userId
    );

    if (result.updated.count === 0) {
      return reply.status(404).send({
        error: "Notification not found or already read",
      });
    }

    return reply.send({
      message: "Notification marked as read",
      notification: result.notification,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to mark notification as read",
      message: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, reply) => {
  const userId = req.user.userId;

  try {
    const result = await notificationService.markAllAsRead(
      req.server.prisma,
      req.server,
      userId
    );

    return reply.send({
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to mark all notifications as read",
      message: error.message,
    });
  }
};

export const getUnreadCount = async (req, reply) => {
  const userId = req.user.userId;

  try {
    const count = await notificationService.getUnreadCount(
      req.server.prisma,
      userId
    );

    return reply.send({ unreadCount: count });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to get unread count",
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, reply) => {
  const userId = req.user.userId;
  const { notificationId } = req.params;

  try {
    const result = await notificationService.deleteNotification(
      req.server.prisma,
      req.server,
      parseInt(notificationId),
      userId
    );

    if (result.count === 0) {
      return reply.status(404).send({ error: "Notification not found" });
    }

    return reply.send({ message: "Notification deleted successfully" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to delete notification",
      message: error.message,
    });
  }
};

export const archiveNotification = async (req, reply) => {
  const userId = req.user.userId;
  const { notificationId } = req.params;

  try {
    const result = await notificationService.archiveNotification(
      req.server.prisma,
      req.server,
      parseInt(notificationId),
      userId
    );

    if (result.count === 0) {
      return reply.status(404).send({ error: "Notification not found" });
    }

    return reply.send({ message: "Notification archived successfully" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to archive notification",
      message: error.message,
    });
  }
};

export const bulkMarkAsRead = async (req, reply) => {
  const userId = req.user.userId;
  const { notificationIds } = req.body;

  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return reply.status(400).send({
      error: "notificationIds must be a non-empty array",
    });
  }

  try {
    const result = await req.server.prisma.$transaction(async (tx) => {
      return await tx.notification.updateMany({
        where: {
          id: { in: notificationIds.map((id) => parseInt(id)) },
          recipientId: userId,
          status: "UNREAD",
        },
        data: {
          status: "READ",
          readAt: new Date(),
        },
      });
    });

    // Send real-time updates
    if (req.server.sendToUser) {
      const websocketData = {
        type: "notifications_bulk_read",
        data: {
          notificationIds: notificationIds.map((id) => parseInt(id)),
          readAt: new Date(),
          count: result.count,
        },
      };

      req.server.sendToUser(userId.toString(), websocketData);
    }

    return reply.send({
      message: "Notifications marked as read",
      count: result.count,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to mark notifications as read",
      message: error.message,
    });
  }
};

// Admin/cleanup endpoints (you might want to protect these)
export const cleanupExpiredNotifications = async (req, reply) => {
  try {
    const result = await notificationService.cleanupExpiredNotifications(
      req.server.prisma
    );

    return reply.send({
      message: "Expired notifications cleaned up",
      deletedCount: result.count,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to cleanup expired notifications",
      message: error.message,
    });
  }
};

export const cleanupOldNotifications = async (req, reply) => {
  const { daysOld = 30 } = req.query;

  try {
    const result = await notificationService.cleanupOldNotifications(
      req.server.prisma,
      parseInt(daysOld)
    );

    return reply.send({
      message: `Notifications older than ${daysOld} days cleaned up`,
      deletedCount: result.count,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({
      error: "Failed to cleanup old notifications",
      message: error.message,
    });
  }
};
