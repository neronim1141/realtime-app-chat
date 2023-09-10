import { FC, ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon, Icons } from "@/src/components/icons";
import Image from "next/image";
import { SignOutButton } from "@/src/components/SignOutButton";
import { FriendRequestSidebarOptions } from "@/src/components/FriendRequestSidebarOptions";
import { db } from "@/src/lib/db";
import { getUser } from "@/src/lib/helpers/auth";
import { getFriendsByUserId } from "@/src/lib/helpers/get-friends-by-user-id";
import SidebarChatList from "@/src/components/SidebarChatList";
import { SidebarOption } from "@/src/types/typings";
import MobileChatLayout from "@/src/components/MobileChatLayout";

interface LayoutProps {
  children: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];
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
        <MobileChatLayout
          friends={friends}
          user={user}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>
      <aside className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 item-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your chats
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList friends={friends} userId={user.id} />
            </li>
            <li>
              <div className="text-xs font-smeibold leading-6 text-gray-400">
                Overwiew
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestSidebarOptions
                    userId={user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center border-t border-gray-200">
              <div className="flex flex-1 items-center gap-x-4 px-2 py-2  text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={user.image || ""}
                    alt="Your profile picture"
                  />
                </div>
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </aside>
      <div className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
