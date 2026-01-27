
import React from 'react';

interface HowItWorksProps {
  onTryNow: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onTryNow }) => {
  const steps = [
    {
      number: '01',
      title: 'Select Your Keepsake',
      description: 'Choose from our curated catalog of premium items, from artisanal tote bags to executive stationery.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'AI Personalization',
      description: 'Input the recipient and occasion. Our Creative Engine generates heartfelt notes and styling advice.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Spatial Alignment',
      description: 'Gemini 3 vision identifies the optimal print area, ensuring your design is perfectly positioned.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Bespoke Delivery',
      description: 'Your design is rendered, verified, and shipped directly to your recipient in premium packaging.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-souvy-teal font-bold text-xs uppercase tracking-[0.3em] mb-4 block">The Souvy Experience</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">How it works.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-souvy-teal mb-8 group-hover:bg-souvy-teal group-hover:text-white transition-all duration-300">
                {step.icon}
              </div>
              <div className="text-souvy-teal/10 text-6xl font-bold absolute top-0 right-0 pointer-events-none group-hover:text-souvy-teal/5 transition-colors">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[48px] p-12 text-center text-white relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-souvy-teal opacity-20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <h3 className="text-3xl font-bold mb-6 relative z-10">Ready to design your first bespoke gift?</h3>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 relative z-10">
            Experience the precision of Gemini spatial vision and the heart of AI-driven creative writing in one seamless studio.
          </p>
          <button 
            onClick={onTryNow}
            className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:scale-105 transition-all relative z-10 shadow-xl"
          >
            Try it now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
