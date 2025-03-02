import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Layers } from '@craftjs/layers';

export const LayerComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('./style.css');
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`text-white bg-slate-900 border-gray-900 transition-all duration-300 h-full flex flex-col shadow-md border-r ${
        isSidebarOpen ? "w-72" : "w-12"
      } max-w-72`}
      style={{ minWidth: "0" }}
    >
      <div className="flex items-center justify-between px-4 py-1 border-b border-gray-700 h-12">
        {isSidebarOpen && (
          <span className="text-sm font-medium">Layers</span>
        )}
        <button
          className="p-2 rounded-full transition-colors duration-200 flex items-center justify-center w-12 h-12"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
      </div>
      <div
        className={`flex-1 ${isSidebarOpen ? "p-2" : "p-1"} overflow-hidden`}
        style={{ maxHeight: "calc(100vh - 64px)" }}
      >
        {isSidebarOpen ? (
          <Layers />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};