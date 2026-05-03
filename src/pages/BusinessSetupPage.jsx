import React, { useState } from "react";
import { CheckCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSubmitEmBusinessSetup } from "../hooks/useEmBusinessSetupMutations";

const BusinessSetupPage = () => {
  const { mutate, isPending } = useSubmitEmBusinessSetup();
  const [status, setStatus] = useState("idle"); // idle, sending, sent, error
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    countryOfResidence: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("[Optimistic UI] User submitted business setup form. Setting status to: sending...");
    setStatus("sending");

    const startTime = Date.now();
    mutate(formData, {
      onSuccess: () => {
        const endTime = Date.now();
        // console.log(`[Optimistic UI] Business setup SUCCESS! (Time taken: ${endTime - startTime}ms)`);
        setFormData({ fullName: "", email: "", mobileNumber: "", countryOfResidence: "" });
        setStatus("sent");
        toast.success("Submitted! We'll contact you soon about your business setup.");
      },
      onError: (err) => {
        const endTime = Date.now();
        // console.error(`❌ [Optimistic UI] Business setup ERROR after ${endTime - startTime}ms:`, err.message);
        setStatus("error");
        toast.error(err?.message || "Failed to submit. Please try again.");
      },
    });
  };

  return (
    <div className="w-full bg-[#f7f7f7]">
      <section className="relative w-full overflow-hidden">

        {/* HERO SECTION */}
        <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
          <img
            src="/images/museum.jpg"
            alt="Dubai Urban City"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Build Smart. Launch Fast.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              From idea to operation in just 48 hours
            </p>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-20 z-20">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* LEFT SIDE */}
              <div className="bg-[#f7f7f7] p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                  Get Started with Confidence
                </h2>

                <div className="space-y-4">
                  <Feature text="Dubai-based Business Setup Experts" />
                  <Feature text="Real Estate Focused Licensing" />
                  <Feature text="Fast-track setup within 48 hours" />
                </div>
              </div>

              {/* RIGHT SIDE – FORM */}
              <div className="p-8 md:p-12 order-first lg:order-last">
                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                  Start Your Business Setup
                </h2>

                <form
                  className="space-y-5"
                  onSubmit={onSubmit}
                >
                  {status === "sent" ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#000000] mb-2">Submission Received!</h3>
                      <p className="text-gray-600 mb-6">Thank you. Our business setup experts will contact you shortly.</p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="px-6 py-2 bg-[#e83f25] text-white font-bold rounded-md hover:bg-[#c73519] transition-colors"
                      >
                        New Submission
                      </button>
                    </div>
                  ) : (
                    <>
                      <Input
                        label="Full Name"
                        id="fullName"
                        placeholder="Enter your full name"
                        required
                        value={formData.fullName}
                        onChange={onChange}
                        disabled={status === "sending"}
                      />

                      <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={formData.email}
                        onChange={onChange}
                        disabled={status === "sending"}
                      />

                      <Input
                        label="Mobile Number"
                        id="mobileNumber"
                        type="tel"
                        placeholder="+971 50 123 4567"
                        required
                        value={formData.mobileNumber}
                        onChange={onChange}
                        disabled={status === "sending"}
                      />

                      <Input
                        label="Country of Residence"
                        id="countryOfResidence"
                        placeholder="e.g. United Arab Emirates"
                        required
                        value={formData.countryOfResidence}
                        onChange={onChange}
                        disabled={status === "sending"}
                      />

                      {status === "error" && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg animate-fade-in">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">Something went wrong. Please try again.</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="w-full bg-[#e83f25] text-white font-bold py-4 px-6 rounded-md hover:bg-[#c73519] transition-colors duration-300 shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {status === "sending" ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Sending your message...</span>
                            </>
                          ) : (
                            "Start My Business Setup"
                          )}
                        </button>
                        
                        {status === "sending" && (
                          <p className="text-center text-xs text-gray-500 animate-fade-in">
                            This may take a few seconds on first message — hang tight.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </form>
              </div>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Feature = ({ text }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-6 h-6 text-[#e83f25] flex-shrink-0 mt-1" />
    <p className="text-[#000000] text-base md:text-lg">{text}</p>
  </div>
);

const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  disabled,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-[#000000] mb-2"
    >
      {label}
      {!required && (
        <span className="text-gray-400 ml-1">(optional)</span>
      )}
    </label>

    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
    />
  </div>
);

export default BusinessSetupPage;