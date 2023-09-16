"use client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC } from "react";
import toast from "react-hot-toast";
import Button from "../../../../components/ui/Button";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton: FC<SignOutButtonProps> = (props) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: () => signOut(),
    onError: () => {
      toast.error("There was a problem signing out");
    },
  });
  return (
    <Button {...props} variant="ghost" onClick={() => mutate()}>
      {isLoading ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};
