import { z } from "zod";
import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";

export const POST = async (req: Request) => {
  try {
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    await db.srem(`user:${user.id}:incoming_friend_requests`, idToDeny);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
};
