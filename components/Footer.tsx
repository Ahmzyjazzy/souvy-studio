
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-souvy-teal w-8 h-8 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-souvy-teal tracking-tighter">Souvy <span className="text-xs font-normal text-slate-400">by Omkits</span></span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Transforming gifting from a transaction into a lasting memory through thoughtful, AI-assisted personalization.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
          <ul className="space-y-4 text-slate-500">
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Catalog</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Personal Shop</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Corporate Kits</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Wishlists</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Company</h4>
          <ul className="space-y-4 text-slate-500">
            <li><a href="#" className="hover:text-souvy-teal transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">How it Works</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Engraving Guide</a></li>
            <li><a href="#" className="hover:text-souvy-teal transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Stay Connected</h4>
          <p className="text-slate-500 mb-4">Subscribe for the latest updates and gifting inspiration.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm grow focus:outline-none focus:ring-2 focus:ring-souvy-teal/10" />
            <button className="bg-souvy-teal text-white p-2 rounded-lg hover:bg-opacity-90">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium border-t border-slate-200 pt-10">
        <p>© 2024 Souvy by Omkits. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-souvy-teal">Instagram</a>
          <a href="#" className="hover:text-souvy-teal">LinkedIn</a>
          <a href="#" className="hover:text-souvy-teal">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
