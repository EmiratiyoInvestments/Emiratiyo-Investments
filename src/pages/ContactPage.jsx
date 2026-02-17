import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useSubmitEmContact } from "../services/useEmContactMutations";
import { toast } from "sonner";

const ContactPage = () => {
  const { mutate, isPending } = useSubmitEmContact();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        setFormData({ name: "", phone: "", email: "", message: "" });
        toast.success("Message sent! We'll get back to you soon.");
      },
      onError: (err) => {
        console.error("EM contact submit failed:", err);
        toast.error(err?.message || "Failed to send message. Please try again.");
      },
    });
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative w-full h-[45vh] lg:h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: 'url("/images/emaar.jpg")',
            }}
          ></div>

          {/* Exact Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>

          {/* Hero Content */}
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-white text-5xl lg:text-7xl font-bold mb-6 tracking-tight"
            >
              Contact Us
            </h1>
            <p
              style={{ fontFamily: 'var(--font-body)' }}
              className="text-white/90 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
            >
              We are ready to provide the right solution according to your needs.
            </p>
          </div>
        </section>

        {/* Contact Card Section */}
        <section className="relative z-30 px-4 -mt-20 lg:-mt-28 mb-20">
          <div className="max-w-[1100px] mx-auto bg-white rounded-[16px] shadow-[0_10px_50px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Left Column: Get in touch */}
              <div className="p-10 lg:p-14 bg-white">
                <h2
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-3xl lg:text-4xl font-bold text-black mb-10"
                >
                  Get in touch
                </h2>

                <div className="space-y-8">
                  {/* Item: Head Office */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-body)' }} className="font-bold text-black text-lg">Head Office</h3>
                      <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-600 mt-1">Business Bay, Dubai, UAE</p>
                    </div>
                  </div>

                  {/* Item: Email Us */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-body)' }} className="font-bold text-black text-lg">Email Us</h3>
                      <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-600 mt-1">info@emiratiyo.ae</p>
                    </div>
                  </div>

                  {/* Item: Call Us */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Phone className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-body)' }} className="font-bold text-black text-lg">Call Us</h3>
                      <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-600 mt-1">+971 4 XXX XXXX</p>
                    </div>
                  </div>
                </div>

                <div className="mt-14 pt-10 border-t border-gray-100 font-body">
                  <p style={{ fontFamily: 'var(--font-body)' }} className="text-black font-bold mb-6">Follow our social media</p>
                  <div className="flex gap-4">
                    {[
                      { Icon: Instagram, href: "https://www.instagram.com/emiratiyo/" },
                      { Icon: Linkedin, href: "https://www.linkedin.com/company/emiratiyo/" }
                    ].map((platform, idx) => (
                      <a
                        key={idx}
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                      >
                        <platform.Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Send us a message */}
              <div className="p-10 lg:p-14 bg-gray-50/50">
                <h2
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-3xl lg:text-4xl font-bold text-black mb-10"
                >
                  Send us a message
                </h2>

                <form className="space-y-6" onSubmit={onSubmit}>
                  {/* Name */}
                  <div className="space-y-2">
                    <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-gray-700">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      className="w-full h-12 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                      value={formData.name}
                      onChange={onChange}
                      disabled={isPending}
                      required
                    />
                  </div>


                  {/* Phone | Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your phone number"
                        className="w-full h-12 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                        value={formData.phone}
                        onChange={onChange}
                        disabled={isPending}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        className="w-full h-12 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                        value={formData.email}
                        onChange={onChange}
                        disabled={isPending}
                        required
                      />
                    </div>
                  </div>


                  {/* Message */}
                  <div className="space-y-2">
                    <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-gray-700">Message</label>
                    <textarea
                      rows="4"
                      name="message"
                      placeholder="Your message here..."
                      className="w-full p-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-body"
                      value={formData.message}
                      onChange={onChange}
                      disabled={isPending}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{ fontFamily: 'var(--font-body)' }}
                    disabled={isPending}
                    className="w-full h-[48px] bg-primary hover:bg-[#c73519] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-[0.98]"
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full pt-10">
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.645489298853!2d78.4425049!3d17.428792699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91a76a44a11b%3A0xe411aea88a34aab0!2sSU%20KNOWLEDGE%20HUB%20FOUNDATION!5e0!3m2!1sen!2sin!4v1770923330668!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.2] contrast-[1.1]"
            ></iframe>
          </div>
        </section>

      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
