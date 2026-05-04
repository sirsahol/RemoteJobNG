import Link from "next/link";

export function EmployerHeader({ companyName, username }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div className="animate-in fade-in slide-in-from-left-4 duration-700">
        <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">Enterprise Command</span>
        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
          {companyName || username} <span className="text-text-muted/30">Terminal</span>
        </h1>
        <p className="text-text-muted mt-3 text-lg uppercase tracking-widest font-black text-xs">Acquire Elite Nigerian Technical Nodes</p>
      </div>
      
      <Link href="/jobs/post" className="bg-text-main text-bg-page hover:opacity-90 px-8 py-4 rounded-2xl font-black transition-all text-sm shadow-xl shadow-glass active:scale-95 animate-in fade-in slide-in-from-right-4 duration-700">
         BROADCAST NEW PROTOCOL
      </Link>
    </div>
  );
}
