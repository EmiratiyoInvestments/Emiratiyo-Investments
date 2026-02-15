import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

const ROICalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    propertyPrice: '',
    monthlyRent: '',
    serviceCharges: '',
    maintenance: '',
    downPayment: '20',
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Calculations
  const propertyPrice = parseFloat(inputs.propertyPrice) || 0;
  const monthlyRent = parseFloat(inputs.monthlyRent) || 0;
  const serviceCharges = parseFloat(inputs.serviceCharges) || 0;
  const maintenance = parseFloat(inputs.maintenance) || 0;
  const downPaymentPct = parseFloat(inputs.downPayment) || 20;

  const annualRent = monthlyRent * 12;
  const annualExpenses = serviceCharges + maintenance;
  const netAnnualIncome = annualRent - annualExpenses;
  const downPaymentAmount = (propertyPrice * downPaymentPct) / 100;

  const grossROI = propertyPrice > 0 ? ((annualRent / propertyPrice) * 100).toFixed(2) : 0;
  const netROI = propertyPrice > 0 ? ((netAnnualIncome / propertyPrice) * 100).toFixed(2) : 0;
  const monthlyCashFlow = (netAnnualIncome / 12).toFixed(0);
  const breakEvenYears = netAnnualIncome > 0 ? (propertyPrice / netAnnualIncome).toFixed(1) : '∞';
  const fiveYearReturn = (netAnnualIncome * 5).toFixed(0);

  const hasResults = propertyPrice > 0 && monthlyRent > 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[999] bg-[#e83f25] text-white rounded-full shadow-2xl hover:bg-[#d63620] transition-all hover:scale-110 flex items-center gap-2 px-4 py-3"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <Calculator className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:block">ROI Calculator</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1000]"
            />

            {/* Calculator Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full z-[1001] bg-white shadow-2xl overflow-y-auto"
              style={{ width: '420px', maxWidth: '100vw' }}
            >
              {/* Header */}
              <div className="bg-[#e83f25] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6" />
                    <h2
                      className="text-xl font-bold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ROI Calculator
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p
                  className="text-white/80 text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Calculate your Dubai property return on investment
                </p>
              </div>

              <div className="p-6">
                {/* INPUTS */}
                <div className="space-y-4 mb-6">
                  <h3
                    className="text-sm font-bold text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Property Details
                  </h3>

                  {/* Property Price */}
                  <div>
                    <label
                      className="text-sm font-semibold text-black mb-1 block"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Property Price (AED)
                    </label>
                    <input
                      type="number"
                      name="propertyPrice"
                      value={inputs.propertyPrice}
                      onChange={handleChange}
                      placeholder="e.g. 1,500,000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e83f25] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  {/* Monthly Rent */}
                  <div>
                    <label
                      className="text-sm font-semibold text-black mb-1 block"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Expected Monthly Rent (AED)
                    </label>
                    <input
                      type="number"
                      name="monthlyRent"
                      value={inputs.monthlyRent}
                      onChange={handleChange}
                      placeholder="e.g. 8,000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e83f25] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label
                      className="text-sm font-semibold text-black mb-1 block"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Down Payment: <span className="text-[#e83f25]">{inputs.downPayment}%</span>
                      {downPaymentAmount > 0 && (
                        <span className="text-gray-400 font-normal ml-2">
                          = AED {downPaymentAmount.toLocaleString()}
                        </span>
                      )}
                    </label>
                    <input
                      type="range"
                      name="downPayment"
                      value={inputs.downPayment}
                      onChange={handleChange}
                      min="10"
                      max="100"
                      step="5"
                      className="w-full accent-[#e83f25]"
                    />
                    <div
                      className="flex justify-between text-xs text-gray-400 mt-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span>10%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <h3
                    className="text-sm font-bold text-gray-500 uppercase tracking-wider pt-2"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Annual Expenses
                  </h3>

                  {/* Service Charges */}
                  <div>
                    <label
                      className="text-sm font-semibold text-black mb-1 block"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Service Charges/year (AED)
                    </label>
                    <input
                      type="number"
                      name="serviceCharges"
                      value={inputs.serviceCharges}
                      onChange={handleChange}
                      placeholder="e.g. 10,000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e83f25] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  {/* Maintenance */}
                  <div>
                    <label
                      className="text-sm font-semibold text-black mb-1 block"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Maintenance/year (AED)
                    </label>
                    <input
                      type="number"
                      name="maintenance"
                      value={inputs.maintenance}
                      onChange={handleChange}
                      placeholder="e.g. 5,000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#e83f25] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>

                {/* RESULTS */}
                {hasResults ? (
                  <div className="space-y-3">
                    <h3
                      className="text-sm font-bold text-gray-500 uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Your Results
                    </h3>

                    {/* Gross ROI */}
                    <div className="bg-[#e83f25] rounded-xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-white/80 text-xs mb-1"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Gross ROI
                          </p>
                          <p
                            className="text-4xl font-bold"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {grossROI}%
                          </p>
                        </div>
                        <TrendingUp className="w-10 h-10 opacity-30" />
                      </div>
                    </div>

                    {/* Net ROI */}
                    <div className="bg-[#f7f7f7] rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-gray-500 text-xs mb-1"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Net ROI (after expenses)
                          </p>
                          <p
                            className="text-3xl font-bold text-black"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {netROI}%
                          </p>
                        </div>
                        <PieChart className="w-8 h-8 text-gray-300" />
                      </div>
                    </div>

                    {/* Grid Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#f7f7f7] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-[#e83f25]" />
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Monthly Cash Flow
                          </p>
                        </div>
                        <p
                          className="text-lg font-bold text-black"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          AED {parseInt(monthlyCashFlow).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-[#f7f7f7] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-[#e83f25]" />
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Break Even
                          </p>
                        </div>
                        <p
                          className="text-lg font-bold text-black"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {breakEvenYears} years
                        </p>
                      </div>

                      <div className="bg-[#f7f7f7] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-[#e83f25]" />
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Annual Income
                          </p>
                        </div>
                        <p
                          className="text-lg font-bold text-black"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          AED {annualRent.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-[#f7f7f7] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-[#e83f25]" />
                          <p
                            className="text-gray-500 text-xs"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            5 Year Return
                          </p>
                        </div>
                        <p
                          className="text-lg font-bold text-black"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          AED {parseInt(fiveYearReturn).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-black rounded-xl p-4 text-center mt-2">
                      <p
                        className="text-white text-sm mb-3"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Ready to invest? Book a free consultation!
                      </p>
                      <a
                        href="/contact"
                        className="block w-full bg-[#e83f25] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-[#d63620] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Book Free Consultation
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Enter property price and monthly rent to see your ROI
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ROICalculator;