import { FC } from "react";
import FriendRequests from "../components/FriendRequests.component";
import { AddFriendForm } from "../forms/AddFriend.form";

interface AddFriendProps {
  incomingFriendRequests: IncomingFriendRequest[];
}
export const AddFriend: FC<AddFriendProps> = ({ incomingFriendRequests }) => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendForm />
      <h2 className="font-bold text-4xl my-8">Friend requests</h2>
      <FriendRequests incomingFriendRequest={incomingFriendRequests} />
    </main>
  );
};
