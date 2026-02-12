import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import { client, urlFor } from "../services/sanityClient";
import { SINGLE_PROPERTY_QUERY } from "../lib/propertyQueries";

const PropertyDetailPage = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => client.fetch(SINGLE_PROPERTY_QUERY, { slug }),
  });

  const allImages = property
    ? [property.mainImage, ...(property.gallery || [])].filter(Boolean)
    : [];

  const formatPrice = (price, label) => {
    if (label) return label;
    if (!price) return "Price on Request";
    return `AED ${price.toLocaleString()}`;
  };

  const formatArea = (area, unit) => {
    if (!area) return null;
    const unitLabel = unit === "sqm" ? "sq m" : "sq ft";
    return `${area.toLocaleString()} ${unitLabel}`;
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "for-sale":
        return "bg-green-500";
      case "for-rent":
        return "bg-blue-500";
      case "sold":
        return "bg-gray-500";
      case "rented":
        return "bg-gray-500";
      case "off-plan":
        return "bg-purple-500";
      default:
        return "bg-[#e83f25]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "for-sale":
        return "For Sale";
      case "for-rent":
        return "For Rent";
      case "sold":
        return "Sold";
      case "rented":
        return "Rented";
      case "off-plan":
        return "Off-Plan";
      default:
        return status;
    }
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      pool: "Swimming Pool",
      gym: "Gym/Fitness Center",
      parking: "Parking",
      security: "24/7 Security",
      balcony: "Balcony",
      garden: "Garden",
      "maids-room": "Maid's Room",
      study: "Study Room",
      ac: "Central AC",
      wardrobes: "Built-in Wardrobes",
      "kitchen-appliances": "Kitchen Appliances",
      "pets-allowed": "Pets Allowed",
      concierge: "Concierge Service",
      "kids-play-area": "Kids Play Area",
      bbq: "BBQ Area",
      sauna: "Sauna",
      jacuzzi: "Jacuzzi",
      "beach-access": "Private Beach Access",
    };
    return labels[amenity] || amenity;
  };

  const formatPhoneForCall = (phone) => {
    return phone.replace(/\s+/g, "");
  };

  const formatWhatsAppLink = (whatsapp, propertyTitle) => {
    const message = encodeURIComponent(
      `Hi, I'm interested in the property: ${propertyTitle}`,
    );
    return `https://wa.me/${whatsapp}?text=${message}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  // PortableText components for rendering rich text
  const portableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1
          className="text-3xl font-bold mb-4 text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className="text-2xl font-bold mb-3 text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className="text-xl font-bold mb-3 text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p
          className="mb-4 text-gray-600 leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[#e83f25] pl-4 italic my-4 text-gray-600">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-black">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => (
        <a
          href={value.href}
          className="text-[#e83f25] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className="list-disc list-inside mb-4 space-y-2 text-gray-600"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className="list-decimal list-inside mb-4 space-y-2 text-gray-600"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="ml-4">{children}</li>,
      number: ({ children }) => <li className="ml-4">{children}</li>,
    },
    types: {
      image: ({ value }) => (
        <div className="my-6">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Property image"}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <p
              className="text-sm text-gray-500 text-center mt-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {value.caption}
            </p>
          )}
        </div>
      ),
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-gray-500"
          >
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-black mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Property Not Found
          </h2>
          <Link
            to="/properties"
            className="text-[#e83f25] hover:underline"
            style={{ fontFamily: "var(--font-body)" }}
          >
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* BACK BUTTON */}
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e83f25] mb-8 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Properties</span>
          </Link>

          {/* IMAGE GALLERY */}
          {allImages.length > 0 && (
            <div className="mb-12">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={urlFor(allImages[currentImageIndex]).width(1200).url()}
                  alt={allImages[currentImageIndex].alt || property.title}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                {property.status && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getStatusBadgeColor(property.status)} text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div
                    className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-black" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-black" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-6 gap-3 mt-4">
                  {allImages.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden ${index === currentImageIndex
                          ? "ring-2 ring-[#e83f25]"
                          : "opacity-60 hover:opacity-100"
                        } transition-all`}
                    >
                      <img
                        src={urlFor(image).width(200).url()}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              {/* Property Header */}
              <div className="mb-8">
                {property.propertyType && (
                  <p
                    className="text-sm font-semibold text-[#e83f25] uppercase tracking-wide mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {property.propertyType.replace("-", " ")}
                  </p>
                )}
                <h1
                  className="text-4xl lg:text-5xl font-bold text-black mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {property.title}
                </h1>
                {property.location?.area && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-lg"
                    >
                      {property.location.area}
                      {property.location.city && `, ${property.location.city}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-[#f7f7f7] rounded-xl">
                {property.bedrooms && (
                  <div className="text-center">
                    <Bed className="w-8 h-8 text-[#e83f25] mx-auto mb-2" />
                    <p
                      className="text-2xl font-bold text-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {property.bedrooms}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Bedrooms
                    </p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <Bath className="w-8 h-8 text-[#e83f25] mx-auto mb-2" />
                    <p
                      className="text-2xl font-bold text-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {property.bathrooms}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Bathrooms
                    </p>
                  </div>
                )}
                {property.area && (
                  <div className="text-center">
                    <Maximize className="w-8 h-8 text-[#e83f25] mx-auto mb-2" />
                    <p
                      className="text-2xl font-bold text-black"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {property.area.toLocaleString()}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {property.areaUnit === "sqm" ? "sq m" : "sq ft"}
                    </p>
                  </div>
                )}
                {property.completionStatus && (
                  <div className="text-center">
                    <Building2 className="w-8 h-8 text-[#e83f25] mx-auto mb-2" />
                    <p
                      className="text-lg font-bold text-black capitalize"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {property.completionStatus.replace("-", " ")}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Status
                    </p>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {property.excerpt && (
                <div className="mb-8">
                  <p
                    className="text-xl text-gray-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {property.excerpt}
                  </p>
                </div>
              )}

              {/* Full Description */}
              {property.description && (
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-black mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Description
                  </h2>
                  <div className="prose max-w-none">
                    <PortableText
                      value={property.description}
                      components={portableTextComponents}
                    />
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold text-black mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span
                          className="text-gray-700"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {getAmenityLabel(amenity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Virtual Tour */}
              {property.virtualTourUrl && (
                <div className="mb-8">
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#e83f25] text-white px-6 py-3 rounded-lg hover:bg-[#d63620] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View Virtual Tour</span>
                  </a>
                </div>
              )}

              {/* Tags */}
              {property.tags && property.tags.length > 0 && (
                <div className="mb-8">
                  <h3
                    className="text-lg font-bold text-black mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#f7f7f7] text-gray-700 px-4 py-2 rounded-full text-sm"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-[#f7f7f7] p-6 rounded-xl">
                  <p
                    className="text-sm text-gray-500 mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Price
                  </p>
                  <p
                    className="text-3xl font-bold text-[#e83f25] mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {formatPrice(property.price, property.priceLabel)}
                  </p>
                </div>

                {/* Agent Preview Card */}
                {property.agent && (
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <p
                      className="text-sm text-gray-500 mb-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Your Agent
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      {property.agent.image ? (
                        <img
                          src={urlFor(property.agent.image)
                            .width(60)
                            .height(60)
                            .url()}
                          alt={property.agent.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-lg">
                          {property.agent.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p
                          className="font-bold text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.agent.name}
                        </p>
                        <p
                          className="text-sm text-gray-500 capitalize"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.agent.role?.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAgentModal(true)}
                      className="w-full text-[#e83f25] border border-[#e83f25] py-2 rounded-lg font-semibold hover:bg-[#e83f25] hover:text-white transition-colors text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      View Contact Details
                    </button>
                  </div>
                )}

                {/* Property Details */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3
                    className="text-lg font-bold text-black mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Property Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    {property.propertyId && (
                      <div className="flex justify-between">
                        <span
                          className="text-gray-500"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Property ID
                        </span>
                        <span
                          className="font-medium text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.propertyId}
                        </span>
                      </div>
                    )}
                    {property.developer && (
                      <div className="flex justify-between">
                        <span
                          className="text-gray-500"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Developer
                        </span>
                        <span
                          className="font-medium text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.developer}
                        </span>
                      </div>
                    )}
                    {property.handoverDate && (
                      <div className="flex justify-between">
                        <span
                          className="text-gray-500"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Handover Date
                        </span>
                        <span
                          className="font-medium text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {formatDate(property.handoverDate)}
                        </span>
                      </div>
                    )}
                    {property.publishedAt && (
                      <div className="flex justify-between">
                        <span
                          className="text-gray-500"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Listed On
                        </span>
                        <span
                          className="font-medium text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {formatDate(property.publishedAt)}
                        </span>
                      </div>
                    )}
                    {property.location?.fullAddress && (
                      <div className="pt-3 border-t border-gray-200">
                        <p
                          className="text-gray-500 mb-1"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Address
                        </p>
                        <p
                          className="text-black"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.location.fullAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AGENT CONTACT MODAL */}
      {showAgentModal && property.agent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAgentModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAgentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              {property.agent.image ? (
                <img
                  src={urlFor(property.agent.image)
                    .width(100)
                    .height(100)
                    .url()}
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                  {property.agent.name?.charAt(0)}
                </div>
              )}
              <h3
                className="text-2xl font-bold text-black mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {property.agent.name}
              </h3>
              <p
                className="text-gray-500 capitalize mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {property.agent.role?.replace("-", " ")}
              </p>
              {property.agent.bio && (
                <p
                  className="text-sm text-gray-600 mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {property.agent.bio}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {property.agent.phone && (
                <a
                  href={`tel:${formatPhoneForCall(property.agent.phone)}`}
                  className="flex items-center gap-3 w-full bg-[#e83f25] text-white py-3 px-4 rounded-lg hover:bg-[#d63620] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">
                    Call: {property.agent.phone}
                  </span>
                </a>
              )}

              {property.agent.whatsapp && (
                <a
                  href={formatWhatsAppLink(
                    property.agent.whatsapp,
                    property.title,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">WhatsApp</span>
                </a>
              )}

              {property.agent.email && (
                <a
                  href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}`}
                  className="flex items-center gap-3 w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">
                    Email: {property.agent.email}
                  </span>
                </a>
              )}
            </div>

            {(property.agent.languages || property.agent.specialization) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                {property.agent.languages &&
                  property.agent.languages.length > 0 && (
                    <div className="mb-3">
                      <p
                        className="text-xs text-gray-500 mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Languages
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {property.agent.languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {property.agent.specialization &&
                  property.agent.specialization.length > 0 && (
                    <div>
                      <p
                        className="text-xs text-gray-500 mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Specialization
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {property.agent.specialization.map((spec) => (
                          <span
                            key={spec}
                            className="text-xs bg-[#e83f25]/10 text-[#e83f25] px-2 py-1 rounded capitalize"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
