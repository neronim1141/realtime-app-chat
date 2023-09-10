import { FC, ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/src/lib/helpers/auth";

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
