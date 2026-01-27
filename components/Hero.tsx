
import React from 'react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const images = [
    'https://souvy.omkits.com/images/hero-fan/image4.png',
    'https://souvy.omkits.com/images/hero-fan/image1.png',
    'https://souvy.omkits.com/images/hero-fan/image7.png',
    'https://souvy.omkits.com/images/hero-fan/image3.png',
    'https://souvy.omkits.com/images/hero-fan/image2.png'
  ];

  return (
    <section className="pt-20 pb-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
          Curated souvenirs for <br /> life's biggest moments.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your destination for thoughtful, AI personalized gifting. Share your wishlist or design custom souvenirs—we'll handle the engraving and the delivery.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-souvy-teal text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-xl shadow-teal-900/20">
            Curate Your Gift Wishlist
          </button>
          <button 
            onClick={onExplore}
            className="w-full sm:w-auto border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition-all"
          >
            Explore the Catalog
          </button>
        </div>
      </div>

      <div className="relative flex justify-center items-end mt-12 mb-20">
        <div className="flex -space-x-12 sm:-space-x-24">
          {images.map((src, i) => {
            const rotation = (i - 2) * 8;
            const yOffset = Math.abs(i - 2) * 12;
            return (
              <div 
                key={i}
                className="relative w-48 sm:w-64 h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-transform hover:scale-110 hover:z-50 cursor-pointer"
                style={{
                  transform: `rotate(${rotation}deg) translateY(${yOffset}px)`,
                  zIndex: 10 + (2 - Math.abs(i - 2))
                }}
              >
                <img src={src} alt={`Souvenir ${i}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg">
                    @ahmzy sent you a new gift
                  </div>
                )}
                {i === images.length - 1 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg">
                    @lade fulfilled your wish
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
