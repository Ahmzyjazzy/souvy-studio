
import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'catalog' | 'cart', targetId?: string) => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartCount }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navItems = [
    { 
      label: 'Personal', 
      description: 'Find the perfect gift for your loved ones.',
      subItems: [
        { title: 'Create a Wishlist', desc: 'Curate your dream gifts.' },
        { title: 'Personalized Shop', desc: 'Bespoke items just for you.' },
        { title: 'Gift Finder', desc: 'Let AI find the ideal match.' },
        { title: "Find a Friend's List", desc: 'Gift with certainty.' }
      ],
      featured: {
        title: 'The Birthday Edit',
        image: 'https://plus.unsplash.com/premium_vector-1728827342988-1e2935854e9c?q=80&w=1509&auto=format&fit=crop',
        tag: 'New Collection'
      }
    },
    { 
      label: 'Corporate', 
      description: 'Elevate your brand with premium corporate souvenirs.',
      subItems: [
        { title: 'Employee Onboarding', desc: 'Welcome teams in style.' },
        { title: 'Client Appreciation', desc: 'Build lasting relationships.' },
        { title: 'Holiday/Seasonal', desc: 'Bulk orders for every season.' },
        { title: 'Customization Portal', desc: 'Manage your brand assets.' }
      ],
      featured: {
        title: 'Executive Gifting',
        image: 'https://plus.unsplash.com/premium_vector-1765363113016-8cc31243202d?q=80&w=1800&auto=format&fit=crop',
        tag: 'B2B Exclusive'
      }
    },
    { 
      label: 'Event', 
      description: 'Memorable favors for your special milestones.',
      subItems: [
        { title: 'Party Favors', desc: 'Small tokens, big impact.' },
        { title: 'The Merch Hub', desc: 'High-quality event swag.' },
        { title: 'Speaker Packages', desc: 'Gratitude for your guests.' },
        { title: 'Get a Custom Quote', desc: 'Tailored event solutions.' }
      ],
      featured: {
        title: 'Wedding Souvenirs',
        image: 'https://plus.unsplash.com/premium_vector-1729097103865-22f66a5cafb8?q=80&w=2340&auto=format&fit=crop',
        tag: 'Bridal'
      }
    },
    { label: 'How it works', targetId: 'how-it-works' },
    { label: 'The Souvy Edit' }
  ];

  const handleNavClick = (item: any) => {
    if (item.targetId) {
      onNavigate('landing', item.targetId);
    } else if (!item.subItems) {
      onNavigate('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-souvy-teal w-8 h-8 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-souvy-teal tracking-tighter">Souvy <span className="text-xs font-normal text-slate-400">by Omkits</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="py-2"
              onMouseEnter={() => setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button 
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeMenu === item.label ? 'text-souvy-teal' : 'text-slate-600 hover:text-souvy-teal'}`}
                onClick={() => handleNavClick(item)}
              >
                {item.label}
                {item.subItems && (
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeMenu === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {item.subItems && (
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] lg:w-[850px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-top ${activeMenu === item.label ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 -translate-y-2 pointer-events-none scale-95'}`}
                >
                  <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex">
                    <div className="flex-1 p-8">
                      <div className="mb-6">
                        <h4 className="text-souvy-teal font-bold text-lg mb-1">{item.label} Solutions</h4>
                        <p className="text-slate-400 text-xs">{item.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {item.subItems.map((sub, idx) => (
                          <div 
                            key={idx} 
                            className="group/sub p-3 -m-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => {
                              onNavigate('catalog');
                              setActiveMenu(null);
                            }}
                          >
                            <p className="text-sm font-bold text-slate-900 group-hover/sub:text-souvy-teal transition-colors">{sub.title}</p>
                            <p className="text-[11px] text-slate-400 leading-tight mt-1">{sub.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-6 border-t border-slate-50">
                        <button className="text-xs font-bold text-souvy-teal flex items-center gap-2 group/btn">
                          View Full Catalog
                          <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {item.featured && (
                      <div className="hidden sm:flex w-[250px] bg-slate-50 p-6 flex flex-col border-l border-slate-100">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 group/img">
                          <img src={item.featured.image} alt={item.featured.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-souvy-teal uppercase tracking-widest shadow-sm">
                            {item.featured.tag}
                          </div>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{item.featured.title}</h5>
                        <p className="text-[11px] text-slate-500 mb-4">Discover our hand-picked selection for this month.</p>
                        <button 
                          onClick={() => {
                            onNavigate('catalog');
                            setActiveMenu(null);
                          }}
                          className="mt-auto w-full py-2.5 bg-souvy-teal text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all"
                        >
                          Explore Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-souvy-teal px-4 py-2">Login</button>
          <button 
            onClick={() => onNavigate('cart')}
            className="relative p-2 text-slate-600 hover:text-souvy-teal transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => onNavigate('catalog')}
            className="bg-souvy-teal text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-900/10"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
