"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export function LoginButton() {
  const { user } = useUser();

  if (user) {
    return (<>
      <div>
        <span>{user.name}</span>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href={"/api/auth/logout?returnTo=" + window.location.origin + "/login"}>(Sign Out)</a>
      </div>
    </>)
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/login">Sign In</a>
    </div>
  )
}