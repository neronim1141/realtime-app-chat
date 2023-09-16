import { UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "../features/auth/client/components/SignOutButton";
import { NewFriendBadge } from "../features/chat/client/components/NewFriendBadge.component";
import SidebarChatList from "../features/chat/client/components/SidebarChatList.component";

interface SideMenuProps {
  friends: User[];
  user: User;
  unseenRequestCount: number;
}
export const SideMenu = ({
  friends,
  user,
  unseenRequestCount,
}: SideMenuProps) => {
  return (
    <>
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
              <li>
                <Link
                  href="/dashboard/add"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <p className="truncate">Add Friend</p>
                  <NewFriendBadge
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </Link>
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
    </>
  );
};
