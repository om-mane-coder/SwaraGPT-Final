import React from 'react';
import Link from 'next/link';
import { Music, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-amber-900/10 bg-[#FAF8F5] py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xs">
            <Music className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">SwaraGPT</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-xs">Indian Classical Music AI</span>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex items-center gap-5 text-xs font-medium text-slate-600 flex-wrap justify-center">
          <Link href="/analyze" className="hover:text-amber-800 transition-colors">Vocal Practice</Link>
          <Link href="/chat" className="hover:text-amber-800 transition-colors">Virtual Guru</Link>
          <Link href="/ragas" className="hover:text-amber-800 transition-colors">Ragas</Link>
          <Link href="/dashboard" className="hover:text-amber-800 transition-colors">Progress</Link>
          <a
            href="https://github.com/om-mane-coder/SwaraGPT-Final"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-800 text-amber-900 font-semibold transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        {/* Copyright & Tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>© 2026 SwaraGPT</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Sadhaks
          </span>
        </div>

      </div>
    </footer>
  );
}
