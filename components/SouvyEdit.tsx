
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product, ToneTier, Customization, CanvasElement, ElementType } from '../types';
import { geminiService } from '../services/geminiService';
import localforage from 'localforage';

interface SouvyEditProps {
  product: Product;
  onSave: (customization: Customization) => void;
  onClose: () => void;
  initialCustomization?: Customization | null;
}

const SouvyEdit: React.FC<SouvyEditProps> = ({ product, onSave, onClose, initialCustomization }) => {
  // UI State
  const [activeTab, setActiveTab] = useState<'design' | 'layers' | 'branding'>('design');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>(initialCustomization?.elements || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [bound, setBound] = useState<{ ymin: number; xmin: number; ymax: number; xmax: number } | null>(null);

  // AI & Context State
  const [recipient, setRecipient] = useState(initialCustomization?.recipientName || 'Alexandra');
  const [occasion, setOccasion] = useState(initialCustomization?.occasion || 'Special Day');
  const [tone, setTone] = useState<ToneTier>(initialCustomization?.tone || ToneTier.MINIMALIST);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState({ 
    note: initialCustomization?.generatedNote || '', 
    advice: initialCustomization?.designAdvice || '' 
  });

  // Interaction State (Offsets prevent the "jump" bug)
  const [dragState, setDragState] = useState<{ id: string; type: 'move' | 'resize'; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedElement = useMemo(() => elements.find(e => e.id === selectedId), [elements, selectedId]);

  // Analyze Product Surface
  useEffect(() => {
    const analyze = async () => {
      setAnalyzing(true);
      const zone = await geminiService.identifyCustomZone(product.image);
      if (zone) setBound(zone);
      setAnalyzing(false);
    };
    analyze();
  }, [product.image]);

  const addElement = (type: ElementType, content: string = '') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newElement: CanvasElement = {
      id,
      type,
      content: content || (type === 'text' ? 'New Message' : ''),
      x: 50,
      y: 50,
      width: type === 'text' ? 30 : 20,
      height: type === 'text' ? 8 : 20,
      zIndex: elements.length,
      fontSize: type === 'text' ? 24 : undefined,
      fontFamily: type === 'text' ? 'Playfair Display' : undefined,
      color: type === 'text' ? '#004D4D' : undefined,
    };
    setElements([...elements, newElement]);
    setSelectedId(id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(e => e.id === id);
    if (idx === -1) return;

    if (direction === 'top') {
      const maxZ = Math.max(...elements.map(e => e.zIndex), 0);
      updateElement(id, { zIndex: maxZ + 1 });
    } else if (direction === 'bottom') {
      const minZ = Math.min(...elements.map(e => e.zIndex), 0);
      updateElement(id, { zIndex: minZ - 1 });
    } else if (direction === 'up' && idx < sorted.length - 1) {
      const other = sorted[idx + 1];
      const currentZ = sorted[idx].zIndex;
      updateElement(id, { zIndex: other.zIndex });
      updateElement(other.id, { zIndex: currentZ });
    } else if (direction === 'down' && idx > 0) {
      const other = sorted[idx - 1];
      const currentZ = sorted[idx].zIndex;
      updateElement(id, { zIndex: other.zIndex });
      updateElement(other.id, { zIndex: currentZ });
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, id: string, type: 'move' | 'resize') => {
    e.stopPropagation();
    setSelectedId(id);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const el = elements.find(item => item.id === id);
    if (!el) return;

    const clickXPerc = ((clientX - rect.left) / rect.width) * 100;
    const clickYPerc = ((clientY - rect.top) / rect.height) * 100;

    // Use offsets to prevent jumping
    setDragState({ 
      id, 
      type, 
      offsetX: type === 'move' ? clickXPerc - el.x : 0, 
      offsetY: type === 'move' ? clickYPerc - el.y : 0 
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const xPerc = ((clientX - rect.left) / rect.width) * 100;
    const yPerc = ((clientY - rect.top) / rect.height) * 100;

    const el = elements.find(e => e.id === dragState.id);
    if (!el) return;

    if (dragState.type === 'move') {
      updateElement(el.id, { 
        x: xPerc - dragState.offsetX, 
        y: yPerc - dragState.offsetY 
      });
    } else {
      const newWidth = Math.max(5, Math.abs(xPerc - el.x) * 2);
      const newHeight = Math.max(2, Math.abs(yPerc - el.y) * 2);
      updateElement(el.id, { width: newWidth, height: newHeight });
    }
  };

  const checkBound = (el: CanvasElement) => {
    if (!bound) return false;
    const bMinX = bound.xmin / 10;
    const bMaxX = bound.xmax / 10;
    const bMinY = bound.ymin / 10;
    const bMaxY = bound.ymax / 10;
    return (
      (el.y - el.height / 2) < bMinY || 
      (el.y + el.height / 2) > bMaxY || 
      (el.x - el.width / 2) < bMinX || 
      (el.x + el.width / 2) > bMaxX
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => addElement('image', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSyncAI = async () => {
    setLoadingAI(true);
    try {
      const data = await geminiService.generateCreativeContent({
        productName: product.name,
        recipientName: recipient,
        occasion: occasion,
        tone: tone,
        logoDescription: elements.filter(e => e.type === 'image').length > 0 ? "Includes custom logo branding" : "Text only engraving"
      });
      if (data) setAiResult({ note: data.note, advice: data.designAdvice });
    } finally {
      setLoadingAI(false);
    }
  };

  const generatePreview = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const productImg = new Image();
      productImg.crossOrigin = "anonymous";
      // Using corsproxy to ensure we can read pixels for the final export
      productImg.src = `https://corsproxy.io/?${encodeURIComponent(product.image)}`;

      productImg.onload = async () => {
        canvas.width = productImg.width;
        canvas.height = productImg.height;
        ctx.drawImage(productImg, 0, 0);

        const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

        for (const el of sorted) {
          const centerX = (el.x / 100) * canvas.width;
          const centerY = (el.y / 100) * canvas.height;
          const width = (el.width / 100) * canvas.width;
          const height = (el.height / 100) * canvas.height;

          if (el.type === 'image') {
            const assetImg = new Image();
            assetImg.src = el.content;
            await new Promise((r) => { assetImg.onload = r; assetImg.onerror = r; });
            ctx.drawImage(assetImg, centerX - width / 2, centerY - height / 2, width, height);
          } else {
            ctx.fillStyle = el.color || '#000000';
            const fontSize = (el.fontSize || 20) * (canvas.width / 600); // Scaled
            ctx.font = `bold italic ${fontSize}px "${el.fontFamily || 'serif'}"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.content, centerX, centerY);
          }
        }
        resolve(canvas.toDataURL('image/png'));
      };
      productImg.onerror = () => resolve('');
    });
  };

  const exportFinalDesign = async () => {
    setLoadingAI(true);
    const previewImage = await generatePreview();
    setLoadingAI(false);

    onSave({
      elements,
      generatedNote: aiResult.note,
      designAdvice: aiResult.advice,
      recipientName: recipient,
      occasion: occasion,
      tone: tone,
      previewImage
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F1F3F5] flex flex-col h-screen overflow-hidden select-none font-sans">
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-[60] shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">Souvy Creative Studio</span>
            <span className="text-[10px] text-slate-400 font-medium">Editing: {product.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
             <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
             <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest">Spatial Engine Online</span>
          </div>
          <button 
            onClick={exportFinalDesign}
            disabled={loadingAI}
            className="px-6 py-2 bg-souvy-teal text-white rounded-full text-xs font-bold shadow-lg shadow-teal-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {loadingAI && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
            Finalize Specification
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 z-50">
          <button onClick={() => setActiveTab('design')} className={`p-4 rounded-2xl transition-all ${activeTab === 'design' ? 'bg-souvy-teal text-white shadow-xl shadow-teal-900/20 scale-110' : 'text-slate-400 hover:bg-slate-50'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span className="text-[8px] font-bold uppercase mt-1 block">Design</span>
          </button>
          <button onClick={() => setActiveTab('branding')} className={`p-4 rounded-2xl transition-all ${activeTab === 'branding' ? 'bg-souvy-teal text-white shadow-xl shadow-teal-900/20 scale-110' : 'text-slate-400 hover:bg-slate-50'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[8px] font-bold uppercase mt-1 block">Assets</span>
          </button>
          <button onClick={() => setActiveTab('layers')} className={`p-4 rounded-2xl transition-all ${activeTab === 'layers' ? 'bg-souvy-teal text-white shadow-xl shadow-teal-900/20 scale-110' : 'text-slate-400 hover:bg-slate-50'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            <span className="text-[8px] font-bold uppercase mt-1 block">Layers</span>
          </button>
        </aside>

        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto z-40 animate-in slide-in-from-left duration-200">
          <div className="p-6 space-y-8">
            {activeTab === 'design' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Canvas Elements</h3>
                <button 
                  onClick={() => addElement('text')}
                  className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-souvy-teal hover:bg-teal-50 transition-all group"
                >
                  <span className="text-lg font-serif font-bold text-slate-300 group-hover:text-souvy-teal">T+</span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase group-hover:text-souvy-teal">Add New Text Box</span>
                </button>
                {selectedElement && selectedElement.type === 'text' && (
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-souvy-teal uppercase tracking-widest">Text Editor</span>
                       <button onClick={() => deleteElement(selectedElement.id)} className="text-red-500 hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                    <div>
                      <textarea 
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={selectedElement.fontFamily}
                        onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option>Playfair Display</option>
                        <option>Inter</option>
                        <option>Outfit</option>
                      </select>
                      <input 
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <input type="file" className="hidden" id="logo-upload" accept="image/*" onChange={handleLogoUpload} />
                <label htmlFor="logo-upload" className="aspect-square w-full border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-souvy-teal hover:bg-teal-50 transition-all group">
                  <svg className="w-10 h-10 text-slate-300 group-hover:text-souvy-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Upload Asset</span>
                </label>
              </div>
            )}
            {activeTab === 'layers' && (
              <div className="space-y-4">
                {[...elements].sort((a,b) => b.zIndex - a.zIndex).map(el => (
                  <div key={el.id} onClick={() => setSelectedId(el.id)} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${selectedId === el.id ? 'border-souvy-teal bg-teal-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold">{el.type === 'text' ? 'T' : 'IMG'}</div>
                    <span className="text-xs truncate flex-1">{el.content.slice(0, 15)}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main 
          className="flex-1 relative flex items-center justify-center overflow-hidden"
          onMouseMove={handlePointerMove}
          onMouseUp={() => setDragState(null)}
          onTouchMove={handlePointerMove}
          onTouchEnd={() => setDragState(null)}
          onClick={() => setSelectedId(null)}
        >
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="relative group max-w-2xl w-full p-12 transition-all" onClick={e => e.stopPropagation()}>
            <div ref={canvasRef} className="relative aspect-square bg-white rounded-[64px] shadow-2xl overflow-hidden border-[16px] border-white ring-1 ring-slate-100">
              <img src={product.image} className="w-full h-full object-cover pointer-events-none" style={{ opacity: analyzing ? 0.3 : 1 }} alt="Product" />
              {bound && (analyzing || selectedId) && (
                <div className="absolute border-2 border-teal-500/20 bg-teal-500/5 rounded-3xl pointer-events-none" style={{ top: `${bound.ymin / 10}%`, left: `${bound.xmin / 10}%`, width: `${(bound.xmax - bound.xmin) / 10}%`, height: `${(bound.ymax - bound.ymin) / 10}%` }} />
              )}
              {[...elements].sort((a,b) => a.zIndex - b.zIndex).map(el => {
                const isSelected = selectedId === el.id;
                const outOfBound = checkBound(el);
                return (
                  <div 
                    key={el.id}
                    onMouseDown={(e) => handlePointerDown(e, el.id, 'move')}
                    className={`absolute p-2 transform -translate-x-1/2 -translate-y-1/2 ${isSelected ? 'ring-2 ring-souvy-teal z-50 cursor-move' : 'cursor-pointer'} ${outOfBound && isSelected ? 'ring-red-500' : ''}`}
                    style={{ top: `${el.y}%`, left: `${el.x}%`, width: `${el.width}%`, height: `${el.height}%`, zIndex: el.zIndex }}
                  >
                    <div className="w-full h-full flex items-center justify-center pointer-events-none">
                       {el.type === 'text' ? <div className="text-center w-full font-bold italic" style={{ fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily, color: el.color }}>{el.content}</div> : <img src={el.content} className="max-w-full max-h-full object-contain" />}
                    </div>
                    {isSelected && <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-souvy-teal rounded-full cursor-nwse-resize" onMouseDown={(e) => handlePointerDown(e, el.id, 'resize')} />}
                  </div>
                );
              })}
              {analyzing && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-[200]"><div className="w-12 h-12 border-4 border-t-souvy-teal rounded-full animate-spin" /></div>}
            </div>
          </div>
        </main>

        <aside className={`transition-all duration-300 bg-white border-l border-slate-200 flex flex-col z-50 ${isPanelCollapsed ? 'w-12' : 'w-[400px]'}`}>
          <div className="relative h-full flex flex-col">
             <button onClick={() => setIsPanelCollapsed(!isPanelCollapsed)} className="absolute -left-4 top-10 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center z-50"><svg className={`w-4 h-4 transition-transform ${isPanelCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
             {!isPanelCollapsed && (
               <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-souvy-teal rounded-2xl flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                     <div><h3 className="text-xl font-bold">AI Director</h3><span className="text-[10px] text-emerald-600 font-bold uppercase">Ready</span></div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 text-sm italic">{aiResult.advice || "Design advice will appear here after sync."}</div>
                  <div className="space-y-6">
                    <input value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-slate-50 rounded-2xl p-4 text-sm" placeholder="Recipient Name" />
                    <input value={occasion} onChange={e => setOccasion(e.target.value)} className="w-full bg-slate-50 rounded-2xl p-4 text-sm" placeholder="Occasion" />
                    <button onClick={handleSyncAI} disabled={loadingAI} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">{loadingAI ? 'Syncing...' : 'Sync AI Engine'}</button>
                  </div>
                  {aiResult.note && <div className="p-6 bg-white border border-slate-100 rounded-2xl text-sm italic">"{aiResult.note}"</div>}
               </div>
             )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SouvyEdit;
