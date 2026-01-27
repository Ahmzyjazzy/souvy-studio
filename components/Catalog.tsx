
import React from 'react';
import { CATALOG_PRODUCTS } from '../constants';
import { Product } from '../types';

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onAddToCart }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Collection</h2>
          <p className="text-slate-500">Premium items ready for your personal touch.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All Items', 'Home', 'Stationery', 'Lifestyle', 'Corporate'].map((tag) => (
            <button key={tag} className="px-5 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-souvy-teal transition-colors whitespace-nowrap">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATALOG_PRODUCTS.map((product) => (
          <div key={product.id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="aspect-square overflow-hidden bg-slate-100 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={() => onAddToCart(product)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-souvy-teal hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                <span className="font-semibold text-souvy-teal">${product.price}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 grow">{product.description}</p>
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full py-3 rounded-xl border-2 border-slate-100 font-semibold text-slate-700 hover:border-souvy-teal hover:text-souvy-teal transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Catalog;
