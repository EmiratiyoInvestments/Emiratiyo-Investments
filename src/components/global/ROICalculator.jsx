import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, TrendingUp, DollarSign, Calendar, PieChart, Home, Percent } from 'lucide-react';

// ─── Core Formula ────────────────────────────────────────────────────────────
function calculateROI(inputs) {
  const propertyPrice        = Number(inputs.propertyPrice)        || 0;
  const monthlyRent          = Number(inputs.monthlyRent)          || 0;
  const vacancyPct           = Number(inputs.vacancyPct)           || 8;
  const annualRentGrowth     = Number(inputs.annualRentGrowth)     || 3;
  const appreciationPct      = Number(inputs.appreciationPct)      || 5;
  const serviceCharges       = Number(inputs.serviceCharges)       || 0;
  const maintenanceReservePct= Number(inputs.maintenanceReservePct)|| 8;
  const purchaseCostPct      = Number(inputs.purchaseCostPct)      || 8;
  const sellingCostPct       = Number(inputs.sellingCostPct)       || 2;
  const downPaymentPct       = Number(inputs.downPaymentPct)       || 20;
  const interestRate         = Number(inputs.interestRate)         || 6;
  const loanYears            = Number(inputs.loanYears)            || 20;

  if (propertyPrice <= 0 || monthlyRent <= 0) return null;

  // Financing
  const downPayment   = (propertyPrice * downPaymentPct) / 100;
  const loanAmount    = propertyPrice - downPayment;
  const monthlyRate   = interestRate / 100 / 12;
  const totalMonths   = loanYears * 12;
  const emi = loanAmount > 0
    ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
    : 0;
  const annualEMI = emi * 12;

  // Rent after vacancy
  const effectiveAnnualRent = monthlyRent * 12 * (1 - vacancyPct / 100);

  // Maintenance reserve
  const maintenanceReserve = (effectiveAnnualRent * maintenanceReservePct) / 100;

  // Total annual expenses
  const totalAnnualExpenses = serviceCharges + maintenanceReserve + annualEMI;

  // Net income
  const netAnnualCashFlow = effectiveAnnualRent - totalAnnualExpenses;
  const monthlyCashFlow   = netAnnualCashFlow / 12;

  // Initial investment
  const purchaseCosts      = (propertyPrice * purchaseCostPct) / 100;
  const totalCashInvested  = downPayment + purchaseCosts;

  // Cash-on-cash return
  const cashOnCashReturn = totalCashInvested > 0
    ? (netAnnualCashFlow / totalCashInvested) * 100
    : 0;

  // 5-year projection
  let rent          = effectiveAnnualRent;
  let propertyValue = propertyPrice;
  let totalCashFlow5Y = 0;

  for (let i = 1; i <= 5; i++) {
    rent          *= 1 + annualRentGrowth  / 100;
    propertyValue *= 1 + appreciationPct   / 100;
    const maintenance = (rent * maintenanceReservePct) / 100;
    totalCashFlow5Y  += rent - (serviceCharges + maintenance + annualEMI);
  }

  const sellingCosts         = (propertyValue * sellingCostPct) / 100;
  const remainingLoanBalance = loanAmount > 0
    ? loanAmount * Math.pow(1 + monthlyRate, totalMonths)
      - (emi * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / monthlyRate
    : 0;
  const netSaleProceeds = propertyValue - sellingCosts - Math.max(remainingLoanBalance, 0);
  const totalProfit5Y   = netSaleProceeds + totalCashFlow5Y - totalCashInvested;
  const roi5Y           = (totalProfit5Y / totalCashInvested) * 100;

  const r = (n, d = 0) => Number(n.toFixed(d));
  return {
    emi:              r(emi),
    annualRent:       r(effectiveAnnualRent),
    annualExpenses:   r(totalAnnualExpenses),
    netAnnualCashFlow:r(netAnnualCashFlow),
    monthlyCashFlow:  r(monthlyCashFlow),
    cashOnCashReturn: r(cashOnCashReturn, 2),
    propertyValue5Y:  r(propertyValue),
    totalCashFlow5Y:  r(totalCashFlow5Y),
    netSaleProceeds:  r(netSaleProceeds),
    totalProfit5Y:    r(totalProfit5Y),
    roi5Y:            r(roi5Y, 2),
    downPayment:      r(downPayment),
    totalCashInvested:r(totalCashInvested),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString();

function InputField({ label, name, value, onChange, placeholder, prefix = 'AED' }) {
  return (
    <div>
      <label className="text-sm font-semibold text-black mb-1 block" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg py-3 text-sm focus:outline-none focus:border-[#e83f25] transition-colors ${prefix ? 'pl-12 pr-4' : 'px-4'}`}
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>
    </div>
  );
}

function SliderField({ label, name, value, onChange, min, max, step, unit = '%', extra }) {
  return (
    <div>
      <label className="text-sm font-semibold text-black mb-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-body)' }}>
        {label}:
        <span className="text-[#e83f25]">{value}{unit}</span>
        {extra && <span className="text-gray-400 font-normal">{extra}</span>}
      </label>
      <input
        type="range"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full accent-[#e83f25]"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1" style={{ fontFamily: 'var(--font-body)' }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-[#e83f25] text-white' : 'bg-[#f7f7f7]'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${highlight ? 'text-white/70' : 'text-[#e83f25]'}`} />
        <p className={`text-xs ${highlight ? 'text-white/80' : 'text-gray-500'}`} style={{ fontFamily: 'var(--font-body)' }}>
          {label}
        </p>
      </div>
      <p className={`text-lg font-bold ${highlight ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ROICalculator = () => {
  const [isOpen, setIsOpen]   = useState(false);
  const [showAdv, setShowAdv] = useState(false);
  const [inputs, setInputs]   = useState({
    propertyPrice:        '',
    monthlyRent:          '',
    serviceCharges:       '',
    downPaymentPct:       '20',
    interestRate:         '6',
    loanYears:            '20',
    vacancyPct:           '8',
    annualRentGrowth:     '3',
    appreciationPct:      '5',
    maintenanceReservePct:'8',
    purchaseCostPct:      '8',
    sellingCostPct:       '2',
  });

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const results = calculateROI(inputs);

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1000]"
            />

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full z-[1001] bg-white shadow-2xl overflow-y-auto"
              style={{ width: '440px', maxWidth: '100vw' }}
            >
              {/* Header */}
              <div className="bg-[#e83f25] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6" />
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
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
                <p className="text-white/80 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Professional Dubai property investment analysis
                </p>
              </div>

              <div className="p-6 space-y-6">

                {/* ── Core Inputs ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                    Property Details
                  </h3>
                  <InputField label="Property Price (AED)" name="propertyPrice" value={inputs.propertyPrice} onChange={handleChange} placeholder="e.g. 1,500,000" />
                  <InputField label="Expected Monthly Rent (AED)" name="monthlyRent" value={inputs.monthlyRent} onChange={handleChange} placeholder="e.g. 8,000" />
                  <InputField label="Annual Service Charges (AED)" name="serviceCharges" value={inputs.serviceCharges} onChange={handleChange} placeholder="e.g. 10,000" />
                </section>

                {/* ── Financing ── */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                    Financing
                  </h3>
                  <SliderField
                    label="Down Payment"
                    name="downPaymentPct"
                    value={inputs.downPaymentPct}
                    onChange={handleChange}
                    min={10} max={100} step={5}
                    extra={results ? `= AED ${fmt(results.downPayment)}` : ''}
                  />
                  <SliderField
                    label="Interest Rate"
                    name="interestRate"
                    value={inputs.interestRate}
                    onChange={handleChange}
                    min={1} max={15} step={0.25}
                  />
                  <SliderField
                    label="Loan Term"
                    name="loanYears"
                    value={inputs.loanYears}
                    onChange={handleChange}
                    min={5} max={25} step={1}
                    unit=" yrs"
                    extra={results ? `EMI = AED ${fmt(results.emi)}/mo` : ''}
                  />
                </section>

                {/* ── Advanced Assumptions (collapsible) ── */}
                <section>
                  <button
                    onClick={() => setShowAdv(!showAdv)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-full"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    Advanced Assumptions
                    <span className="ml-auto">{showAdv ? '▲' : '▼'}</span>
                  </button>

                  {showAdv && (
                    <div className="mt-4 space-y-4 bg-gray-50 rounded-xl p-4">
                      <SliderField label="Vacancy Rate" name="vacancyPct" value={inputs.vacancyPct} onChange={handleChange} min={0} max={25} step={1} />
                      <SliderField label="Annual Rent Growth" name="annualRentGrowth" value={inputs.annualRentGrowth} onChange={handleChange} min={0} max={10} step={0.5} />
                      <SliderField label="Annual Appreciation" name="appreciationPct" value={inputs.appreciationPct} onChange={handleChange} min={0} max={15} step={0.5} />
                      <SliderField label="Maintenance Reserve" name="maintenanceReservePct" value={inputs.maintenanceReservePct} onChange={handleChange} min={0} max={20} step={1} extra="% of rent" />
                      <SliderField label="Purchase Costs (DLD etc.)" name="purchaseCostPct" value={inputs.purchaseCostPct} onChange={handleChange} min={0} max={15} step={0.5} />
                      <SliderField label="Selling Costs" name="sellingCostPct" value={inputs.sellingCostPct} onChange={handleChange} min={0} max={10} step={0.5} />
                    </div>
                  )}
                </section>

                {/* ── Results ── */}
                {results ? (
                  <section className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                      Your Results
                    </h3>

                    {/* Hero: Cash-on-Cash */}
                    <div className="bg-[#e83f25] rounded-xl p-5 text-white flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-xs mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                          Cash-on-Cash Return
                        </p>
                        <p className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                          {results.cashOnCashReturn}%
                        </p>
                        <p className="text-white/70 text-xs mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                          on AED {fmt(results.totalCashInvested)} invested
                        </p>
                      </div>
                      <TrendingUp className="w-12 h-12 opacity-25" />
                    </div>

                    {/* 5-Year ROI */}
                    <div className="bg-black rounded-xl p-5 text-white flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-xs mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                          5-Year Total ROI (incl. appreciation)
                        </p>
                        <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                          {results.roi5Y}%
                        </p>
                        <p className="text-white/50 text-xs mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                          Profit: AED {fmt(results.totalProfit5Y)}
                        </p>
                      </div>
                      <PieChart className="w-10 h-10 opacity-20" />
                    </div>

                    {/* Grid stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard icon={DollarSign} label="Monthly Cash Flow" value={`AED ${fmt(results.monthlyCashFlow)}`} />
                      <StatCard icon={Calendar}   label="EMI / month"        value={`AED ${fmt(results.emi)}`} />
                      <StatCard icon={TrendingUp} label="Effective Annual Rent" value={`AED ${fmt(results.annualRent)}`} />
                      <StatCard icon={DollarSign} label="Annual Expenses"    value={`AED ${fmt(results.annualExpenses)}`} />
                      <StatCard icon={Home}       label="Property Value (5Y)" value={`AED ${fmt(results.propertyValue5Y)}`} />
                      <StatCard icon={TrendingUp} label="Net Sale Proceeds (5Y)" value={`AED ${fmt(results.netSaleProceeds)}`} />
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-400 text-center" style={{ fontFamily: 'var(--font-body)' }}>
                      Projections are indicative. Consult a financial advisor before investing.
                    </p>

                    {/* CTA */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                      <p className="text-gray-700 text-sm mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                        Ready to invest? Book a free consultation!
                      </p>
                      <a
                        href="/contact"
                        className="block w-full bg-[#e83f25] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#d63620] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Book Free Consultation
                      </a>
                    </div>
                  </section>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
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