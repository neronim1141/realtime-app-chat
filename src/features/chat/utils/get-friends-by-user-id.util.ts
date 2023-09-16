import { db } from "../../../lib/db";

export const getFriendsByUserId = async (userId: string) => {
  const friendIds = await db.smembers(`user:${userId}:friends`);
  const friends = await Promise.all(
    friendIds.map(async (id) => {
      const friend = (await db.get(`user:${id}`)) as User;
      return friend;
    })
  );

  return friends;
};
