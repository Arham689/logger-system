
const EnhancedLogTableShimmer: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-black text-white min-h-screen">
      
      <div className="flex justify-center gap-4 mb-8">
        <div className="relative h-10 w-24 bg-blue-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="relative h-10 w-32 bg-blue-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      </div>

      
      <div className="flex justify-center gap-4 mb-8">
        <div className="relative h-10 w-32 bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="relative h-10 w-36 bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        <div className="relative h-10 w-40 bg-gray-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      </div>

      
      <div className="bg-white rounded-lg overflow-hidden">
        
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative h-4 bg-gray-300 rounded overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>

        
        {[...Array(7)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* Event Type */}
              <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              
              <div className="relative h-4 bg-gray-200 rounded w-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              
              <div className="relative h-4 bg-gray-200 rounded w-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              
              <div className="relative h-4 bg-gray-200 rounded w-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              
              <div className="relative h-4 bg-gray-200 rounded w-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              
              <div className="flex gap-1">
                {[16, 12, 14].map((width, i) => (
                  <div key={i} className={`relative h-4 bg-gray-200 rounded w-${width} overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
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