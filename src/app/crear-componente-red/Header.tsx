"use client";
import IconButton from "@/components/IconButton";
import { Avatar } from "@telefonica/mistica";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Header() {
  const router = useRouter();
  const onNavigate = useCallback(() => {
    router.push("/componente-red");
  }, [router]);
  return (
    <header className="px-14 h-[60px] items-center grid grid-cols-[auto_1fr_auto_auto] gap-6 overflow-hidden bg-white sticky top-0 z-[2] col-span-2">
      <IconButton icon="arrow_back_ios" onClick={onNavigate} />
      <img src="/logo.svg" alt="telefonica" className="w-6" />
      <IconButton icon="notifications_unread" />
      <Avatar
        initials="RM"
        size={40}
        backgroundColor="#0066FF"
        textColor="white"
      />
    </header>
  );
}
