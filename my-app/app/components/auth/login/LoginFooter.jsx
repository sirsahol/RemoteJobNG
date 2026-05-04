// @dsp obj-l03
import React from "react";
import Link from "next/link";

export function LoginFooter() {
  return (
    <div className="mt-10 pt-10 border-t border-glass-border text-center relative z-10">
      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
        Unregistered?{" "}
        <Link
          href="/signup"
          className="text-blue-400 font-black hover:text-text-main transition-colors ml-2"
        >
          Create Node
        </Link>
      </p>
    </div>
  );
}
