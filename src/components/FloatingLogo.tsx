import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FloatingLogo() {
  return (
    <Link href="/" className="hidden lg:flex fixed top-1/2 left-8 -translate-y-1/2 -translate-x-1/2 -rotate-90 origin-center z-40 items-center gap-4 mix-blend-difference hover:opacity-100 transition-opacity opacity-70 cursor-pointer">
      <div className="relative w-8 h-8 rotate-90">
        <Image src="/logo-white.png" alt="Roodh.ways Logo" fill className="object-contain" />
      </div>
      <span className="font-heading text-2xl font-black uppercase tracking-[0.4em] text-white drop-shadow-md">
        ROODH.WAYS
      </span>
    </Link>
  );
}
