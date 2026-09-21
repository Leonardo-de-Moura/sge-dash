import React from "react";

export const IfceBadge: React.FC<{ campusName?: string }> = ({
  campusName = "Campus Cedro",
}) => {
  return (
    <div
      className="flex items-center gap-2.5 p-2 rounded-lg group text-left"
      title="IFCE"
    >
      {/* 9-dot IFCE stylized grid mark */}
      <div
        className="grid grid-cols-3 gap-0.5 w-6 h-7 flex-shrink-0"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 flex-shrink-0">
            <svg
              viewBox="0 0 40 40"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Círculo vermelho */}
              <circle cx="7" cy="7" r="5" fill="#C8102E" />

              {/* Blocos verdes */}
              <rect x="15" y="2" width="8" height="8" rx="1" fill="#006A38" />
              <rect x="26" y="2" width="8" height="8" rx="1" fill="#006A38" />

              <rect x="4" y="13" width="8" height="8" rx="1" fill="#006A38" />
              <rect x="15" y="13" width="8" height="8" rx="1" fill="#006A38" />

              <rect x="4" y="24" width="8" height="8" rx="1" fill="#006A38" />
              <rect x="15" y="24" width="8" height="8" rx="1" fill="#006A38" />
              <rect x="26" y="24" width="8" height="8" rx="1" fill="#006A38" />

              <rect x="4" y="35" width="8" height="8" rx="1" fill="#006A38" />
              <rect x="15" y="35" width="8" height="8" rx="1" fill="#006A38" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-bold text-gray-800 tracking-tight">
          INSTITUTO FEDERAL
        </span>
        <span className="text-[10px] text-[#006A38] font-semibold">Ceará</span>
        <span className="text-[9px] text-gray-500 font-medium">
          {campusName}
        </span>
      </div>
    </div>
  );
};
