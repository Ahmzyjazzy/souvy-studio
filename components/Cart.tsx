
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onCustomize: (item: CartItem) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onCustomize, onRemove, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Your Cart</h2>
        <span className="text-slate-500 font-medium">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
          <p className="text-slate-500 mb-8">Start exploring our catalog to find the perfect gift.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all">
              <div className="w-full sm:w-44 aspect-square rounded-[24px] overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                {/* Use previewImage if personalized, otherwise fallback to default product image */}
                <img 
                  src={item.customization?.previewImage || item.product.image} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover animate-in fade-in duration-500" 
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{item.product.name}</h3>
                    <span className="font-bold text-souvy-teal text-lg">${item.product.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{item.product.category}</p>
                  
                  {item.customization ? (
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Personalized</span>
                        <span className="text-xs text-slate-400 italic">to: {item.customization.recipientName}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 italic">"{item.customization.generatedNote}"</p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-100 flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-amber-800">Not personalized yet</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onCustomize(item)}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {item.customization ? 'Edit Specs' : 'The Souvy Edit'}
                  </button>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 bg-souvy-teal rounded-[40px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-teal-200 font-medium mb-1">Subtotal Estimate</p>
              <h3 className="text-4xl sm:text-5xl font-bold">${total.toFixed(2)}</h3>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full md:w-auto bg-white text-souvy-teal px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-black/20"
            >
              Confirm Custom Orders
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
