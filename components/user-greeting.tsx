"use client";

import { useSession } from "next-auth/react";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function UserGreeting() {
  const { data: session } = useSession();

  return (
    <h1>
      Hi!{" "}
      {session?.user?.username
        ? capitalizeFirstLetter(session.user.username)
        : "Guest"}{" "}
      👋
    </h1>
  );
}
