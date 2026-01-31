
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface CheckoutSimulationProps {
  totalAmount: number;
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'details' | 'payment-select' | 'bank-transfer' | 'verify' | 'success';

const CheckoutSimulation: React.FC<CheckoutSimulationProps> = ({ totalAmount, onComplete, onCancel }) => {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    createAccount: true
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; reason: string } | null>(null);

  const referenceCode = `SVY-${formData.name.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const bankDetails = {
    bank: "Souvy Global Bank",
    accountNumber: "0123456789",
    accountName: "Souvy Creative Studio"
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptBase64((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    }
  };

  const verifyPayment = async () => {
    if (!receiptBase64) return;
    setIsVerifying(true);
    setVerificationResult(null);

    const result = await geminiService.verifyReceipt(receiptBase64, {
      amount: totalAmount,
      reference: referenceCode,
      accountName: bankDetails.accountName
    });

    setIsVerifying(false);
    setVerificationResult(result);
    if (result.verified) {
      setTimeout(() => setStep('success'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress Bar */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-slate-900">Secure Checkout</h2>
          </div>
          <div className="text-sm font-bold text-souvy-teal">
            {step === 'details' && 'Step 1/4'}
            {step === 'payment-select' && 'Step 2/4'}
            {step === 'bank-transfer' && 'Step 3/4'}
            {step === 'verify' && 'Step 4/4'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 sm:p-12">
          {step === 'details' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Delivery Details</h3>
                <p className="text-slate-500 text-sm italic">Where should we send your bespoke keepsakes?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-souvy-teal/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-souvy-teal/10" 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Street, City, Postcode" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-souvy-teal/10 min-h-[100px]" 
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={formData.createAccount}
                    onChange={(e) => setFormData({...formData, createAccount: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded peer-checked:bg-souvy-teal peer-checked:border-souvy-teal transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Create a Souvy account for me with this email</span>
              </label>

              <button 
                onClick={() => setStep('payment-select')}
                disabled={!formData.name || !formData.email || !formData.address}
                className="w-full py-5 bg-souvy-teal text-white rounded-3xl font-bold shadow-xl shadow-teal-900/10 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 'payment-select' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Choose Payment Method</h3>
                <p className="text-slate-500 text-sm">Select how you'd like to complete your order of <span className="text-souvy-teal font-bold">${totalAmount}</span></p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-6 border-2 rounded-3xl flex items-center justify-between group transition-all ${paymentMethod === 'transfer' ? 'border-souvy-teal bg-teal-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-souvy-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">Bank Transfer</p>
                      <p className="text-xs text-slate-500">Pay directly into our studio account</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-souvy-teal' : 'border-slate-200'}`}>
                    {paymentMethod === 'transfer' && <div className="w-3 h-3 bg-souvy-teal rounded-full" />}
                  </div>
                </button>

                <div className="relative group opacity-60">
                  <div className="p-6 border-2 border-slate-100 rounded-3xl flex items-center justify-between cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-400">Credit / Debit Card</p>
                        <p className="text-xs text-slate-400">Instant online payment</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-souvy-teal bg-teal-50 px-2 py-1 rounded">COMING SOON</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep('bank-transfer')}
                disabled={paymentMethod !== 'transfer'}
                className="w-full py-5 bg-souvy-teal text-white rounded-3xl font-bold shadow-xl shadow-teal-900/10 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                Continue with Bank Transfer
              </button>
            </div>
          )}

          {step === 'bank-transfer' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Bank Transfer Details</h3>
                <p className="text-slate-500 text-sm">Please make a transfer of exactly <span className="text-souvy-teal font-bold">${totalAmount}</span> to the account below.</p>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bank</div>
                  <div className="font-bold">{bankDetails.bank}</div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Account Number</div>
                  <div className="font-bold">{bankDetails.accountNumber}</div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Account Name</div>
                  <div className="font-bold">{bankDetails.accountName}</div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-2">Required Transaction Remark / Reference</p>
                  <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between border border-white/10">
                    <span className="text-lg font-mono font-bold tracking-wider">{referenceCode}</span>
                    <button className="text-xs font-bold uppercase text-teal-300 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(referenceCode)}>Copy</button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 italic">⚠️ IMPORTANT: Use the exact reference code above in your transaction remarks for automated verification.</p>
                </div>
              </div>

              <button 
                onClick={() => setStep('verify')}
                className="w-full py-5 bg-souvy-teal text-white rounded-3xl font-bold shadow-xl shadow-teal-900/10 transition-all active:scale-[0.98]"
              >
                I have made the transfer
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">Verify Payment</h3>
                <p className="text-slate-500 text-sm italic">Upload your payment receipt. Our AI engine will confirm the details in real-time.</p>
              </div>

              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleReceiptUpload} 
                  className="hidden" 
                  id="receipt-upload" 
                  disabled={isVerifying}
                />
                <label 
                  htmlFor="receipt-upload"
                  className={`aspect-video w-full border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all ${receiptBase64 ? 'border-souvy-teal bg-teal-50' : 'border-slate-200 hover:border-souvy-teal'}`}
                >
                  {receiptBase64 ? (
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-souvy-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-bold text-souvy-teal uppercase tracking-widest">Receipt Uploaded</span>
                      <span className="text-[10px] text-slate-400">Click to change</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">Upload Receipt Image</span>
                    </>
                  )}
                </label>
              </div>

              {verificationResult && (
                <div className={`p-6 rounded-3xl border animate-in zoom-in-95 ${verificationResult.verified ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${verificationResult.verified ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {verificationResult.verified ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold uppercase tracking-widest ${verificationResult.verified ? 'text-emerald-700' : 'text-red-700'}`}>
                        {verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{verificationResult.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={verifyPayment}
                disabled={!receiptBase64 || isVerifying}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Analyzing Receipt with Gemini...
                  </>
                ) : 'Verify & Complete Order'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-souvy-teal rounded-full flex items-center justify-center shadow-2xl shadow-teal-900/20">
                <svg className="w-12 h-12 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Order Confirmed!</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed italic">
                  Thank you, {formData.name}. Your payment of <span className="text-souvy-teal font-bold">${totalAmount}</span> has been verified. 
                  We've sent a receipt to <span className="font-bold">{formData.email}</span>.
                </p>
                {formData.createAccount && (
                  <div className="text-xs font-bold text-souvy-teal bg-teal-50 px-4 py-2 rounded-full inline-block">
                    Souvy Account Created Successfully
                  </div>
                )}
              </div>
              <div className="w-full pt-8">
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-souvy-teal text-white rounded-3xl font-bold shadow-xl shadow-teal-900/10 transition-all active:scale-[0.98]"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSimulation;
