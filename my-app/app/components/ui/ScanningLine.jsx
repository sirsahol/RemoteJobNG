import React from 'react';

/**
 * Decorative ScanningLine component for RemoteJobNG.
 * Adds a vertical scanning effect to a container.
 */
const ScanningLine = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent absolute top-0 left-0 animate-[scan_3s_linear_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />
    </div>
  );
};

export default ScanningLine;
