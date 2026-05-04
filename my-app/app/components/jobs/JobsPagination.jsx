import React from "react";
import { Button } from "../ui/Button";

export function JobsPagination({ page, setPage, nextPage, prevPage }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-16">
      <Button 
        onClick={() => setPage(p => p - 1)} 
        disabled={!prevPage}
        variant="secondary"
        className="px-6 py-3"
      >
        ← Previous
      </Button>
      <div className="h-8 w-[1px] bg-glass-border" />
      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
        Page {page}
      </span>
      <div className="h-8 w-[1px] bg-glass-border" />
      <Button 
        onClick={() => setPage(p => p + 1)} 
        disabled={!nextPage}
        variant="secondary"
        className="px-6 py-3"
      >
        Next →
      </Button>
    </div>
  );
}

