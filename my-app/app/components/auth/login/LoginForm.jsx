// @dsp obj-l04
import React from "react";
import Link from "next/link";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

export function LoginForm({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  loading, 
  error, 
  onSubmit 
}) {
  return (
    <form className="space-y-8 relative z-10" onSubmit={onSubmit} aria-label="Login Form">
      <Input
        id="username"
        label="Neural ID"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      <div className="relative">
        <Input
          id="password"
          label="Access Key"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <div className="absolute top-0 right-0">
          <Link href="#" className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-text-main transition-colors">
            Reset Protocol
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full py-5"
      >
        Commit Session
      </Button>
    </form>
  );
}
