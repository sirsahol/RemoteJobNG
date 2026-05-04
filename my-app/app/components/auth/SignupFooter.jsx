import Link from "next/link";

export function SignupFooter() {
  return (
    <p className="text-center text-text-muted text-sm mt-8">
      Already a member?{" "}
      <Link href="/login" className="text-blue-400 font-black hover:text-text-main transition-colors">
        Synchronize
      </Link>
    </p>
  );
}
