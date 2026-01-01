/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';
// Context to feed the AI about the paper
const SYSTEM_INSTRUCTION = `You are the AI research assistant for the "USS-Water" website. 
Your goal is to answer questions about the paper "USS-Water: High-Resolution Satellite Mapping of U.S. Surface Water" (Scientific Reports, 2024).

KEY FACTS:
- Authors: Madhu Goutham Reddy Ambati (Lead), Nischal Vooda, Mohammed Sohaib Uddin, Abdul Rahman Shaikh, Mani Sai Lakshmi Karasani, M. Courtney Hughes, Mahdi Vaezi (NIU).
- Problem: Traditional satellite water detection (Landsat/Sentinel) has low resolution (10-30m), missing small water bodies like narrow streams and ponds.
- Dataset ("USS-Water"): 
  - Source: High-resolution RGB imagery from Google Earth Pro.
  - Size: 1,483 images, 1.48 billion labeled pixels.
  - Resolution: 0.3 meters/pixel.
  - Coverage: 147 locations across 44 U.S. states.
  - Classes (7): Rivers, Lakes, Ponds, Reservoirs, Wetlands, Creeks, Coastal.
  - Preprocessing: 
    - Images cropped to remove map legends and UI artifacts.
    - Sliced into smaller patches for training to fit GPU memory constraints.
    - Data Augmentation: Techniques like rotation, flipping, and brightness adjustments were used to improve generalization.
- Model ("U-Net+"):
  - Architecture: Customized U-Net with efficient encoder-decoder blocks.
  - Key Innovation 1: Patch Compression - Handles large input images by resizing and intelligent tiling, significantly reducing memory overhead.
  - Key Innovation 2: Depth-wise Separable Convolutions - Replaces standard convolutions to reduce parameter count by ~40% and drastically speed up inference.
- Performance:
  - F1 Score: 93.6% (Competitive with state-of-the-art).
  - Inference Speed: 6.0 FPS on RTX 3090 (3x faster than MSResNet-34).
  - VRAM Usage: Highly efficient (4.2GB), allowing deployment on standard consumer hardware.
- Comparison:
  - MSResNet-34: Slightly higher accuracy (95.4% F1) but computationally expensive (10.7GB VRAM, 1.9 FPS).
  - DeepLabV3+: Lower accuracy (92.0% F1) and slower (2.1 FPS).
  - SegFormer-B0: Good balance (94.1% F1), but U-Net+ is optimized specifically for speed/accuracy trade-off in this domain.

LIMITATIONS & ASSUMPTIONS:
- Reliance on RGB: The model uses only Red, Green, Blue channels. It lacks Near-Infrared (NIR) bands (common in Landsat/Sentinel), yet achieves high accuracy through deep learning feature extraction.
- Environmental Challenges: 
  - Heavy cloud cover or thick atmospheric haze can obstruct detection.
  - Extreme shadows in dense urban canyons (skyscrapers) may occasionally result in false negatives.
  - Frozen water bodies or snow cover in winter are not the primary target and may be misclassified.
- Seasonality: The dataset captures specific temporal snapshots; highly ephemeral streams (dry season) might be underrepresented.

BEHAVIOR:
- Keep answers concise, professional, and scientific.
- If asked about code or data availability, refer to the GitHub link provided in the interface.
- If asked unrelated questions, politely steer the conversation back to the paper's findings.
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm the USS-Water AI assistant. Ask me anything about the dataset, the U-Net+ model, or our results." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  // We use useMemo to keep the chat instance stable, but we need to handle the case where env might not be ready immediately in some setups.
  // However, for this environment, process.env.API_KEY is assumed ready.
  const chatSession = useMemo(() => {
    try {
      const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
      return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    } catch (error) {
      console.error("Failed to initialize Gemini AI", error);
      return null;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMessage });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText || "I couldn't generate a response." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl text-white transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'bg-gradient-to-r from-ocean to-blue-600'}`}
      >
        <MessageSquare size={24} fill="white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                    <Sparkles size={18} className="text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Ask USS-Water AI</h3>
                  <p className="text-[10px] text-slate-400">Powered by Gemini 3</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-ocean/10'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-slate-600 dark:text-slate-300" /> : <Bot size={16} className="text-ocean" />}
                  </div>
                  <div className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 dark:bg-ocean text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-ocean" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <Loader2 size={16} className="animate-spin text-ocean" />
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0 transition-colors">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about accuracy, model..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm border-transparent focus:border-ocean focus:bg-white dark:focus:bg-slate-800 focus:ring-0 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400 text-slate-800 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-ocean text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
