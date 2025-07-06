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

export const createUser = async (prisma, userData) => {
  const { userInfo, ...rest } = userData;

  return prisma.user.create({
    data: {
      ...rest,
      userInfo: {
        create: userInfo,
      },
    },
    include: {
      userInfo: true,
    },
  });
};
