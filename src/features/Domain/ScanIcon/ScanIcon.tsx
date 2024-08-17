import React from 'react';

export const ScanIcon: React.FC = ({}) => {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white" />
      <g>
        <rect x="10" y="20" width="2" height="60" rx="1" />
        <rect x="20" y="10" width="4" height="80" rx="2" />
        <rect x="32" y="30" width="3" height="40" rx="1.5" />
        <rect x="42" y="15" width="5" height="70" rx="2.5" />
        <rect x="55" y="25" width="2" height="50" rx="1" />
        <rect x="65" y="5" width="4" height="90" rx="2" />
        <rect x="77" y="35" width="3" height="30" rx="1.5" />
        <rect x="88" y="20" width="2" height="60" rx="1" />
      </g>
    </svg>
  );
};
