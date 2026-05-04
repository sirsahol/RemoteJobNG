import React from "react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

const STATUS_VARIANTS = {
  VERIFIED: "success",
  REJECTED: "danger",
  PENDING: "warning",
};

export function VerificationRow({ request, onApprove, onReject }) {
  const { id, user, request_type, status, created_at } = request;

  return (
    <tr className="group hover:bg-glass-surface/40 transition-colors">
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 font-black text-[10px]">
            {user?.username?.charAt(0) || "U"}
          </div>
          <span className="text-sm font-bold text-text-main">
            {user?.username || "Unknown Node"}
          </span>
        </div>
      </td>
      <td className="px-8 py-6">
        <Badge variant="default">
          {request_type}
        </Badge>
      </td>
      <td className="px-8 py-6">
        <Badge variant={STATUS_VARIANTS[status] || "default"}>
          {status}
        </Badge>
      </td>
      <td className="px-8 py-6 text-[10px] font-medium text-text-muted/20 uppercase tracking-tighter">
        {new Date(created_at).toLocaleString()}
      </td>
      <td className="px-8 py-6 text-right">
        {status === "PENDING" && (
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => onReject(id)}
              variant="outline"
              size="sm"
              className="text-[9px] border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Reject
            </Button>
            <Button
              onClick={() => onApprove(id)}
              variant="primary"
              size="sm"
              className="text-[9px] shadow-signal"
            >
              Authorize
            </Button>
          </div>
        )}
        {status !== "PENDING" && (
          <span className="text-[9px] font-black text-text-muted/10 uppercase tracking-widest">
            Logged
          </span>
        )}
      </td>
    </tr>
  );
}

