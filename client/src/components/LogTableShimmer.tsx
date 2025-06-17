const EnhancedLogTableShimmer: React.FC = () => {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl bg-black p-4 text-white">
      <div className="mb-8 flex justify-center gap-4">
        <div className="relative h-10 w-24 overflow-hidden rounded-lg bg-blue-600">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="relative h-10 w-32 overflow-hidden rounded-lg bg-blue-600">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <div className="relative h-10 w-32 overflow-hidden rounded-lg bg-gray-800">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="relative h-10 w-36 overflow-hidden rounded-lg bg-gray-800">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="relative h-10 w-40 overflow-hidden rounded-lg bg-gray-800">
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative h-4 overflow-hidden rounded bg-gray-300">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>

        {[...Array(7)].map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-100 px-6 py-4 last:border-b-0">
            <div className="grid grid-cols-6 items-center gap-4">
              {/* Event Type */}
              <div className="relative h-4 overflow-hidden rounded bg-gray-200">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>

              <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>

              <div className="relative h-4 w-20 overflow-hidden rounded bg-gray-200">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>

              <div className="relative h-4 w-32 overflow-hidden rounded bg-gray-200">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>

              <div className="relative h-4 w-28 overflow-hidden rounded bg-gray-200">
                <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>

              <div className="flex gap-1">
                {[16, 12, 14].map((width, i) => (
                  <div key={i} className={`relative h-4 rounded bg-gray-200 w-${width} overflow-hidden`}>
                    <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default EnhancedLogTableShimmer;
