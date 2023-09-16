import { Logo } from "@/src/components/Logo";
import MobileMenu from "@/src/components/MobileMenu.component";
import { SideMenu } from "@/src/components/SideMenu.component";
import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { getFriendsByUserId } from "@/src/features/chat/utils/get-friends-by-user-id.util";
import { db } from "@/src/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  const unseenRequestCount = (
    await db.smembers(`user:${user.id}:incoming_friend_requests`)
  ).length;

  const friends = await getFriendsByUserId(user.id);
  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileMenu>
          <SideMenu
            friends={friends}
            user={user}
            unseenRequestCount={unseenRequestCount}
          />
        </MobileMenu>
      </div>
      <aside className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 item-center">
          <Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        <SideMenu
          friends={friends}
          user={user}
          unseenRequestCount={unseenRequestCount}
        />
      </aside>
      <div className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
