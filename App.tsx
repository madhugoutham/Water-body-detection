/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroScene, SatelliteScene } from './components/QuantumScene';
import { DatasetMap, ArchitectureDiagram, PerformanceChart } from './components/Diagrams';
import { ChatBot } from './components/ChatBot';
import { ArrowDown, Menu, X, Map, Zap, Layers, Satellite, Moon, Sun } from 'lucide-react';

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AuthorCard = ({ name, role, university, index }: { name: string, role: string, university: string, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col group items-start p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)] hover:border-ocean"
    >
      <h3 className="font-serif text-xl text-slate-900 dark:text-slate-100 mb-2">{name}</h3>
      <p className="text-xs text-ocean font-bold uppercase tracking-widest mb-2">{role}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{university}</p>
    </motion.div>
  );
};

const Website: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-ocean selection:text-white transition-colors duration-300">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-ocean to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Satellite size={20} className="text-white" />
            </div>
            <span className={`font-serif font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              USS-WATER <span className="font-sans font-light text-slate-500 dark:text-slate-400 text-sm ml-1">2024</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
            <a href="#intro" onClick={scrollToSection('intro')} className="hover:text-ocean dark:hover:text-ocean transition-colors uppercase">Overview</a>
            <a href="#dataset" onClick={scrollToSection('dataset')} className="hover:text-ocean dark:hover:text-ocean transition-colors uppercase">Dataset</a>
            <a href="#model" onClick={scrollToSection('model')} className="hover:text-ocean dark:hover:text-ocean transition-colors uppercase">U-Net+ Model</a>
            <a href="#results" onClick={scrollToSection('results')} className="hover:text-ocean dark:hover:text-ocean transition-colors uppercase">Results</a>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a 
              href="https://github.com/NischalRam/USS--Water-Remote-Sensing-for-Water-Detection" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-ocean dark:hover:bg-slate-200 transition-colors shadow-sm font-bold"
            >
              Get Data
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-slate-900 dark:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-slate-900 dark:text-white">
            <a href="#intro" onClick={scrollToSection('intro')}>Overview</a>
            <a href="#dataset" onClick={scrollToSection('dataset')}>The Dataset</a>
            <a href="#model" onClick={scrollToSection('model')}>U-Net+</a>
            <a href="#results" onClick={scrollToSection('results')}>Results</a>
             <a 
              href="https://github.com/NischalRam/USS--Water-Remote-Sensing-for-Water-Detection" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 bg-ocean text-white rounded-full"
            >
              Access GitHub
            </a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        <HeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/90 dark:to-slate-950/90" />

        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 container mx-auto px-6 text-center text-white"
        >
          <div className="inline-block mb-6 px-4 py-1.5 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-[0.2em] uppercase text-cyan-200">
            Scientific Reports • 2024
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-8 drop-shadow-lg">
            High-Resolution <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Water Mapping</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-12">
            Introducing <strong>USS-Water</strong> and <strong>U-Net+</strong>: A 1.48 billion pixel dataset and optimized deep learning model for detecting U.S. surface water at 0.3m resolution.
          </p>
          
          <div className="flex justify-center">
             <a href="#intro" onClick={scrollToSection('intro')} className="group flex flex-col items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer">
                <span>EXPLORE RESEARCH</span>
                <span className="p-3 border border-slate-700 rounded-full group-hover:bg-white group-hover:text-slate-900 transition-all bg-slate-800/50 backdrop-blur">
                    <ArrowDown size={18} />
                </span>
             </a>
          </div>
        </motion.div>
      </header>

      <main>
        {/* Overview */}
        <section id="intro" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <Reveal className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-ocean uppercase">The Challenge</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-slate-900 dark:text-white">Why Map Water?</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-ocean to-cyan-300 mb-6 rounded-full"></div>
            </Reveal>
            <Reveal className="md:col-span-8 text-lg text-slate-600 dark:text-slate-300 leading-relaxed space-y-6" delay={0.2}>
              <p>
                <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-ocean">W</span>ater is essential for life, covering 71% of Earth. However, accurate detection of surface water is critical for ecological balance, flood mapping, and resource management.
              </p>
              <p>
                Traditional satellite methods often suffer from low resolution (10–30m), missing small streams and ponds. Deep learning offers a solution, but high-resolution processing is computationally expensive.
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 border-l-4 border-ocean rounded-r-xl transition-colors">
                <p className="font-medium text-slate-800 dark:text-slate-200 italic">
                  "USS-Water provides 0.3m resolution across 44 states, labeling 7 distinct water types for unprecedented detail."
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The Dataset */}
        <section id="dataset" className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <Reveal className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Map size={14}/> The Data
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-slate-900 dark:text-white">USS-Water Dataset</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Covering 1,483 locations across diverse U.S. landscapes.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Reveal className="order-2 lg:order-1" delay={0.2}>
                        <DatasetMap />
                    </Reveal>
                    <div className="order-1 lg:order-2 space-y-8">
                        <Reveal delay={0.1}>
                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">Unprecedented Scale</h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                1.48 billion labeled pixels derived from high-resolution Google Earth RGB imagery. Unlike binary water masks, we classify <strong>7 distinct types</strong>.
                            </p>
                        </Reveal>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Images', val: '1,483' },
                                { label: 'Resolution', val: '0.3m' },
                                { label: 'States', val: '44' },
                                { label: 'Classes', val: '7' },
                            ].map((stat, i) => (
                                <Reveal key={i} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700" delay={0.1 + (i * 0.1)}>
                                    <div className="text-3xl font-bold text-ocean mb-1">{stat.val}</div>
                                    <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">{stat.label}</div>
                                </Reveal>
                            ))}
                        </div>

                        <Reveal delay={0.3}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 mt-4">Water Classes</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Rivers', 'Lakes', 'Ponds', 'Reservoirs', 'Wetlands', 'Creeks', 'Coastal'].map((c) => (
                                    <span key={c} className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-sm font-medium border border-cyan-200 dark:border-cyan-800">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>

        {/* The Model: U-Net+ */}
        <section id="model" className="py-24 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.3),transparent_50%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <Reveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 dark:bg-slate-800 text-cyan-400 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-700">
                            <Layers size={14}/> The Innovation
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">U-Net+ Architecture</h2>
                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                            Standard U-Net models are heavy. <strong>U-Net+</strong> introduces <em>Patch Compression</em> and <em>Depth-wise Separable Convolutions</em> to slash computational load while maintaining high accuracy.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-emerald-500/20 rounded text-emerald-400"><Zap size={16}/></div>
                                <div>
                                    <strong className="text-white block">Fast Inference</strong>
                                    <span className="text-slate-400 text-sm">Achieves 6 FPS on consumer GPUs, suitable for near-real-time applications.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-blue-500/20 rounded text-blue-400"><Map size={16}/></div>
                                <div>
                                    <strong className="text-white block">Large Scene Tiling</strong>
                                    <span className="text-slate-400 text-sm">Efficiently processes massive mosaics (e.g., 21k x 12k pixels) via smart tiling and blending.</span>
                                </div>
                            </li>
                        </ul>
                     </Reveal>
                     <Reveal delay={0.2} className="bg-slate-800/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-700 shadow-2xl">
                        <ArchitectureDiagram />
                     </Reveal>
                </div>
            </div>
        </section>

        {/* Results */}
        <section id="results" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <Reveal className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 text-slate-900 dark:text-white">Performance Benchmarks</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        U-Net+ competes with heavyweights like DeepLabV3+ and MSResNet-34 in accuracy but wins decisively on speed and efficiency.
                    </p>
                </Reveal>
                
                <Reveal delay={0.2} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <PerformanceChart />
                </Reveal>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Reveal delay={0.3} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-4">Urban Case Study: Chicago</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            In dense urban environments like Jackson Park, Chicago, U-Net+ successfully distinguishes boats from water and handles complex harbor edges.
                        </p>
                        <div className="flex gap-4 items-center text-sm font-bold text-ocean">
                            <span>IoU: 82.1%</span>
                            <span>F1-Score: 92.7%</span>
                        </div>
                     </Reveal>
                     <Reveal delay={0.4} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-4">Industrial Case Study: Gary, IN</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                             Successfully identifies thin canals and polluted water in industrial zones where other models often fail due to low contrast and debris.
                        </p>
                        <div className="flex gap-4 items-center text-sm font-bold text-ocean">
                            <span>IoU: 80.9%</span>
                            <span>F1-Score: 92.1%</span>
                        </div>
                     </Reveal>
                </div>
            </div>
        </section>

        {/* Authors */}
        <section id="authors" className="py-24 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
           <div className="container mx-auto px-6">
                <Reveal className="text-center mb-12">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">THE TEAM</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-slate-900 dark:text-white">Research Authors</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Northern Illinois University</p>
                </Reveal>
                
                <div className="flex flex-wrap gap-6 justify-center">
                    <AuthorCard name="Madhu Goutham Reddy Ambati" role="Lead Author" university="Dept. of Computer Science, NIU" index={0} />
                    <AuthorCard name="Nischal Vooda" role="Co-Author" university="Dept. of Computer Science, NIU" index={1} />
                    <AuthorCard name="Mohammed Sohaib Uddin" role="Co-Author" university="College of Business, NIU" index={2} />
                    <AuthorCard name="Abdul Rahman Shaikh" role="Co-Author" university="Dept. of Computer Science, NIU" index={3} />
                    <AuthorCard name="Mani Sai Lakshmi Karasani" role="Co-Author" university="Dept. of Computer Science, NIU" index={4} />
                    <AuthorCard name="M. Courtney Hughes" role="Co-Author" university="College of Health & Human Sciences, NIU" index={5} />
                    <AuthorCard name="Mahdi Vaezi" role="Corresponding Author" university="College of Engineering, NIU" index={6} />
                </div>
           </div>
        </section>

      </main>

      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-16 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-2 justify-center md:justify-start">
                    <Satellite size={24} className="text-ocean" /> USS-Water
                </div>
                <p className="text-sm max-w-md">
                    "USS-Water Dataset and U-Net+: High-Resolution Satellite Mapping of U.S. Surface Water"
                </p>
            </div>
            <div className="text-center md:text-right text-xs">
                <p>Published in Scientific Reports</p>
                <p>Data available under MIT License</p>
            </div>
        </div>
      </footer>
      
      {/* AI Assistant */}
      <ChatBot />
    </div>
  );
};

export default Website;