"use client";
import Button from "@/src/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addFriendSchema } from "../../dto/add-friend.dto";

type FormData = z.infer<typeof addFriendSchema>;

export const AddFriendForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendSchema),
  });
  const { mutate } = useMutation({
    mutationFn: (email: string) =>
      axios.post("/api/friends/add", {
        email,
      }),
    onSuccess: () => setShowSuccess(true),
    onError: (error) => {
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      return setError("email", {
        message: "Something went wrong with adding friend",
      });
    },
  });

  const onSubmit = async ({ email }: FormData) => {
    mutate(email);
  };
  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by E-Mail
      </label>
      <div className="mt-2 flex gap-4">
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          {...register("email")}
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccess ? (
        <p className="mt-1 text-sm text-green-600">Friend request Sent!</p>
      ) : null}
    </form>
  );
};
