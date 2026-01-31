
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import SouvyEdit from './components/SouvyEdit';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import CheckoutSimulation from './components/CheckoutSimulation';
import { Product, CartItem, Customization } from './types';
import localforage from 'localforage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'catalog' | 'cart' | 'checkout'>('landing');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeEditingItem, setActiveEditingItem] = useState<CartItem | null>(null);

  // Initialize cart from localforage
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await localforage.getItem<CartItem[]>('souvy_cart');
      if (savedCart) setCartItems(savedCart);
    };
    loadCart();
  }, []);

  useEffect(() => {
    localforage.setItem('souvy_cart', cartItems);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      product,
      customization: null
    };
    setCartItems(prev => [...prev, newItem]);
    setCurrentView('cart');
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSaveCustomization = (customization: Customization) => {
    if (!activeEditingItem) return;
    setCartItems(prev => prev.map(item => 
      item.id === activeEditingItem.id ? { ...item, customization } : item
    ));
    setActiveEditingItem(null);
  };

  const navigateAndScroll = (view: 'landing' | 'catalog' | 'cart' | 'checkout', targetId?: string) => {
    setCurrentView(view);
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigate={(view) => {
          if (view === 'landing') navigateAndScroll('landing');
          else if (view === 'catalog') setCurrentView('catalog');
          else if (view === 'cart') setCurrentView('cart');
        }} 
        cartCount={cartItems.length} 
      />

      <main>
        {currentView === 'landing' && (
          <>
            <Hero onExplore={() => setCurrentView('catalog')} />
            
            <HowItWorks onTryNow={() => setCurrentView('catalog')} />

            <section className="bg-slate-50 py-24">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                   <div className="bg-white p-8 rounded-[40px] shadow-2xl relative z-10">
                      <h4 className="text-souvy-teal font-bold mb-4 uppercase text-xs tracking-widest">Single Source of Truth</h4>
                      <h3 className="text-3xl font-bold text-slate-900 mb-6">Souvy Edit Studio</h3>
                      <p className="text-slate-500 mb-8">Our AI engine uses Gemini 3 spatial vision to identify the perfect printable zone on any product, ensuring your bespoke gifts are always perfectly aligned.</p>
                      <button 
                        onClick={() => setCurrentView('catalog')}
                        className="bg-souvy-teal text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                      >
                        Launch Studio
                      </button>
                   </div>
                </div>
                <div>
                   <span className="text-souvy-teal font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Personalization at scale</span>
                   <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">Premium Gifting Reimagined</h2>
                   <div className="space-y-4">
                      <div className="bg-slate-900 text-white p-8 rounded-[32px] flex items-start gap-6 hover:translate-x-2 transition-transform cursor-pointer">
                         <div>
                            <h4 className="text-xl font-bold mb-2">Corporate Solutions</h4>
                            <p className="text-slate-400 text-sm">Automated gifting with manual bespoke quality. Upload your logo and let our spatial engine do the rest.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'catalog' && <Catalog onAddToCart={handleAddToCart} />}

        {(currentView === 'cart' || currentView === 'checkout') && (
          <Cart 
            items={cartItems} 
            onCustomize={setActiveEditingItem} 
            onRemove={handleRemoveFromCart}
            onCheckout={() => setCurrentView('checkout')}
          />
        )}
      </main>

      {currentView === 'checkout' && (
        <CheckoutSimulation 
          totalAmount={totalCartAmount}
          onComplete={() => {
            setCartItems([]);
            setCurrentView('landing');
          }}
          onCancel={() => setCurrentView('cart')}
        />
      )}

      {activeEditingItem && (
        <SouvyEdit 
          product={activeEditingItem.product}
          initialCustomization={activeEditingItem.customization}
          onSave={handleSaveCustomization}
          onClose={() => setActiveEditingItem(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
