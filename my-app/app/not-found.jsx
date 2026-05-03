import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070a] text-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 space-y-8 animate-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Error 404: Protocol Breach</span>
        </div>
        
        <h1 className="text-9xl font-black text-white tracking-tighter leading-none opacity-10">404</h1>
        
        <div className="-mt-20">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">Route <span className="text-blue-400">Offline.</span></h2>
            <p className="text-white/40 max-w-md mx-auto font-medium text-lg mb-10 leading-relaxed">
              The requested data node is non-existent or has been decommissioned from the global network.
            </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Return to Command Center
        </Link>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
        RemoteJobNG System Diagnostic v2.06
      </div>
    </div>
  );
}
