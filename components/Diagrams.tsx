/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Server, Activity, BarChart2, Zap, Clock } from 'lucide-react';

// --- DATASET MAP DIAGRAM ---
export const DatasetMap: React.FC = () => {
  // A simplified abstract representation of the US map distribution
  // heavily weighted on FL, Great Lakes, East Coast, West Coast.
  
  const locations = [
      // West Coast
      { x: '10%', y: '20%', label: 'WA' }, { x: '10%', y: '30%', label: 'OR' }, { x: '12%', y: '50%', label: 'CA' },
      // Mountain
      { x: '30%', y: '35%', label: 'CO' },
      // Midwest / Lakes
      { x: '60%', y: '30%', label: 'IL' }, { x: '62%', y: '32%', label: 'IN' }, { x: '55%', y: '25%', label: 'WI' },
      // South
      { x: '45%', y: '70%', label: 'TX' }, { x: '55%', y: '65%', label: 'LA' },
      // East Coast
      { x: '85%', y: '30%', label: 'NY' }, { x: '82%', y: '40%', label: 'PA' }, { x: '80%', y: '50%', label: 'NC' }, { x: '80%', y: '80%', label: 'FL' },
      // New England
      { x: '90%', y: '20%', label: 'ME' }
  ];

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-slate-200 w-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Map size={120} />
      </div>
      
      <h3 className="font-serif text-2xl mb-2 text-slate-800 self-start z-10">Geographic Coverage</h3>
      <p className="text-sm text-slate-500 mb-8 self-start max-w-sm z-10">
        1,483 images collected from 147 unique locations across 44 states. Highlights include heavy sampling in coastal and lake regions.
      </p>

      <div className="relative w-full aspect-video bg-slate-100 rounded-lg border border-slate-300 p-4">
         {/* Abstract US Shape */}
         <svg viewBox="0 0 100 60" className="w-full h-full opacity-20 pointer-events-none">
            <path d="M 5 10 L 30 10 L 35 30 L 50 25 L 90 5 L 95 20 L 80 40 L 85 55 L 70 55 L 50 50 L 40 55 L 20 45 L 5 25 Z" fill="#94a3b8" />
         </svg>

         {/* Data Points */}
         {locations.map((loc, i) => (
             <motion.div
                key={i}
                className="absolute w-3 h-3 bg-ocean rounded-full shadow-md border border-white cursor-pointer group/point"
                style={{ left: loc.x, top: loc.y }}
                whileHover={{ scale: 1.5 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
             >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/point:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                     {loc.label} Sample
                 </div>
             </motion.div>
         ))}
      </div>
      
      <div className="mt-6 flex justify-between w-full text-xs text-slate-500 font-mono border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-ocean rounded-full"></div> Sample Location
          </div>
          <div>Total: 1.48B Pixels</div>
      </div>
    </div>
  );
};

// --- ARCHITECTURE DIAGRAM ---
export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-slate-900 rounded-xl border border-slate-700 w-full h-full text-slate-200">
      <div className="flex items-center gap-3 mb-6 self-start">
        <Server className="text-cyan-400" />
        <h3 className="font-serif text-xl text-white">U-Net+ Pipeline</h3>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md relative">
          {/* Step 1: Input */}
          <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center text-xs font-mono text-cyan-200">
                  1000px
              </div>
              <div className="flex-1 h-[2px] bg-slate-700 relative">
                  <div className="absolute right-0 -top-1 w-2 h-2 bg-slate-700 rotate-45"></div>
              </div>
              <div className="text-sm font-bold text-white w-32">Input Image</div>
          </div>

          {/* Step 2: Patch Compression */}
          <div className="flex items-center gap-4 pl-8">
              <div className="w-1 bg-cyan-500 h-12"></div>
              <div className="flex-1 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded text-sm text-cyan-100">
                  <strong>Patch Compression</strong> <br/>
                  <span className="text-xs text-cyan-300">Resizing & Tiling</span>
              </div>
          </div>

          {/* Step 3: Encoder-Decoder */}
          <div className="flex items-center gap-4">
              <div className="w-16 h-24 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-lg flex flex-col items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-cyan-900/50 z-10">
                  <span>Encoder</span>
                  <div className="w-8 h-[1px] bg-white/50 my-1"></div>
                  <span>Decoder</span>
              </div>
               <div className="flex-1">
                   <div className="text-sm font-bold text-white mb-1">Depth-wise Separable Conv</div>
                   <p className="text-xs text-slate-400 leading-tight">Replaces standard convolution to reduce parameters by 40%.</p>
               </div>
          </div>

          {/* Step 4: Output */}
          <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-lg border border-emerald-500/50 flex items-center justify-center text-xs font-mono text-emerald-300">
                  Mask
              </div>
              <div className="flex-1 h-[2px] bg-slate-700 relative">
                   <div className="absolute left-0 -top-1 w-2 h-2 bg-slate-700 rotate-45"></div>
              </div>
              <div className="text-sm font-bold text-white w-32">Binary Map</div>
          </div>
      </div>
      
      <div className="mt-8 flex gap-4 text-xs font-mono bg-slate-800 p-3 rounded-lg w-full justify-around">
          <div className="flex flex-col items-center">
             <Zap size={16} className="text-yellow-400 mb-1"/>
             <span>2.5x Speedup</span>
          </div>
          <div className="flex flex-col items-center">
             <Server size={16} className="text-blue-400 mb-1"/>
             <span>50% Less Mem</span>
          </div>
      </div>
    </div>
  );
};

// --- PERFORMANCE CHART ---
export const PerformanceChart: React.FC = () => {
    // Data from Table 3 and Abstract
    // Model: [F1 Score, FPS]
    const data = [
        { 
            name: 'DeepLabV3+', 
            f1: 92.0, 
            fps: 2.1, 
            color: 'bg-slate-400',
            details: "Standard CNN baseline. Moderate accuracy but slow inference." 
        },
        { 
            name: 'MSResNet-34', 
            f1: 95.4, 
            fps: 1.9, 
            color: 'bg-slate-400',
            details: "Highest pixel accuracy, but computationally heavy (10.7GB RAM)."
        },
        { 
            name: 'SegFormer-B0', 
            f1: 94.1, 
            fps: 4.5, 
            color: 'bg-slate-400',
            details: "Transformer-based. Good balance, but U-Net+ is faster."
        },
        { 
            name: 'U-Net+ (Ours)', 
            f1: 93.6, 
            fps: 6.0, 
            color: 'bg-ocean',
            details: "Optimized for speed (6 FPS). Only 4.2GB VRAM required."
        },
    ];

    const maxFps = 7;
    const [hoveredModel, setHoveredModel] = useState<string | null>(null);

    return (
        <div className="flex flex-col md:flex-row p-8 w-full gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-ocean" />
                    <h3 className="text-2xl font-serif text-slate-900">Efficiency vs Accuracy</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    While MSResNet offers slightly higher raw accuracy, it is significantly slower. U-Net+ provides the best balance, delivering high accuracy at <strong>3x the speed</strong> of complex models.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 inline-block">
                    <div className="text-3xl font-bold text-ocean">6 FPS</div>
                    <div className="text-xs uppercase font-bold text-slate-500">Inference Speed on RTX 3090</div>
                </div>
            </div>

            <div className="flex-[2] flex flex-col gap-6 justify-center">
                {data.map((model) => (
                    <div 
                        key={model.name} 
                        className="relative group"
                        onMouseEnter={() => setHoveredModel(model.name)}
                        onMouseLeave={() => setHoveredModel(null)}
                    >
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                            <span>{model.name}</span>
                            <span className="text-slate-500">{model.f1}% F1</span>
                        </div>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredModel === model.name && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                                    exit={{ opacity: 0, y: 5, x: '-50%' }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -top-20 z-30 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl w-56 pointer-events-none"
                                >
                                    <div className="font-bold mb-1 text-cyan-300">{model.name}</div>
                                    <div className="text-slate-300 leading-tight mb-1">{model.details}</div>
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bars Container */}
                        <div className="w-full h-8 bg-slate-100 rounded-full overflow-hidden flex relative cursor-pointer ring-offset-2 group-hover:ring-2 ring-ocean/50 transition-all">
                            {/* FPS Bar */}
                            <motion.div 
                                className={`h-full ${model.color} flex items-center justify-end px-2 text-[10px] text-white font-bold relative z-10`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(model.fps / maxFps) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <span className="mr-1">{model.fps} FPS</span>
                            </motion.div>
                        </div>
                    </div>
                ))}
                <div className="text-xs text-center text-slate-400 mt-2 font-mono flex items-center justify-center gap-2">
                    <Clock size={12}/> Speed (Frames Per Second) - Hover for details
                </div>
            </div>
        </div>
    )
}