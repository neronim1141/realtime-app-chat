import { getUser } from "@/src/features/chat/server/utils/getUser.util";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = async ({ children }) => {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
};

export default AuthLayout;
