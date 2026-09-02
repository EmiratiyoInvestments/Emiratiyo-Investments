import { createClient } from "@sanity/client";
import { config } from "dotenv";
import fetch from "node-fetch";
config();
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.VITE_SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false
});
const AGENT_ID = "fc0df61a-45df-4335-bdc5-a7585adb7c55";
const PROPERTIES = [{
  "title": "Elegant 1BHK | Brand New Building | Family Living | Prime Location | Near RTA Bus Stop",
  "price": 50000,
  "priceLabel": "Yearly",
  "status": "for-rent",
  "propertyType": "apartment",
  "bedrooms": 1,
  "bathrooms": 2,
  "area": 850,
  "furnishing": "unfurnished",
  "floorNumber": null,
  "viewType": null,
  "buildingName": "Al Murjan Tower",
  "areaUnit": "sqft",
  "excerpt": "Experience comfortable and modern living in this elegant 1-bedroom apartment located in the highly sought-after area of Al Nahda 2. Designed with families in mind, this brand new apartment offers a perfect combination of style, space, and convenience.",
  "description": "Experience comfortable and modern living in this elegant 1-bedroom apartment located in the highly sought-after area of Al Nahda 2. Designed with families in mind, this brand new apartment offers a perfect combination of style, space, and convenience.\n\n**Property Highlights**\n\nThe apartment features a spacious and well-planned layout with a bright living area, a generously sized bedroom, and large windows that allow plenty of natural light to fill the space. The modern kitchen is equipped with high-quality fittings and ample storage, making it ideal for everyday living. The finishing throughout the apartment reflects quality and contemporary design.\n\n**Prime Location & Connectivity**\n\nSituated in a prime location, the building provides easy access to an RTA bus stop just a short walk away, ensuring hassle-free daily commuting. It is also conveniently close to Zulekha Hospital, making it an excellent choice for families seeking nearby healthcare facilities. Supermarkets, restaurants, schools, and other essential services are all within close proximity.\n\nWith its peaceful environment and family-friendly atmosphere, this apartment is perfect for those looking for a comfortable home in a well-connected and vibrant community.",
  "completionStatus": "ready",
  "developer": null,
  "location": {
    "area": "Al Nahda 2",
    "city": "Dubai",
    "fullAddress": "Al Murjan Tower, Al Nahda 2, Al Nahda (Dubai), Dubai"
  },
  "amenities": ["pool", "gym", "parking", "security", "ac", "concierge"],
  "tags": [],
  "imageUrls": ["https://images.bayut.com/thumbnails/831350672-800x600.jpeg", "https://images.bayut.com/thumbnails/831350673-800x600.jpeg", "https://images.bayut.com/thumbnails/831350674-800x600.jpeg", "https://images.bayut.com/thumbnails/831350675-800x600.jpeg", "https://images.bayut.com/thumbnails/831350676-800x600.jpeg", "https://images.bayut.com/thumbnails/831350677-800x600.jpeg", "https://images.bayut.com/thumbnails/831350678-800x600.jpeg", "https://images.bayut.com/thumbnails/831350679-800x600.jpeg", "https://images.bayut.com/thumbnails/831350680-800x600.jpeg", "https://images.bayut.com/thumbnails/831350681-800x600.jpeg", "https://images.bayut.com/thumbnails/831350682-800x600.jpeg", "https://images.bayut.com/thumbnails/831350683-800x600.jpeg", "https://images.bayut.com/thumbnails/831350684-800x600.jpeg", "https://images.bayut.com/thumbnails/831350685-800x600.jpeg", "https://images.bayut.com/thumbnails/831350686-800x600.jpeg", "https://images.bayut.com/thumbnails/831350687-800x600.jpeg", "https://images.bayut.com/thumbnails/831350688-800x600.jpeg", "https://images.bayut.com/thumbnails/831350689-800x600.jpeg"],
  "featured": false,
  "handoverDate": null
}];
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96);
}
async function uploadImageFromUrl(imageUrl, filename) {
  try {
    console.log(`  Uploading image: ${filename}`);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
    const buffer = await response.buffer();
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: response.headers.get("content-type") || "image/jpeg"
    });
    return asset._id;
  } catch (err) {
    console.warn(`  ⚠️  Failed to upload image ${filename}: ${err.message}`);
    return null;
  }
}
async function pushProperty(property, index) {
  console.log(`\n[${index + 1}/${PROPERTIES.length}] Processing: ${property.title.slice(0, 60)}...`);
  const slug = slugify(property.title);
  const docId = `property-${slug}`.slice(0, 80);
  let cleanExcerpt = (property.excerpt || '').replace(/\s*\|\s*/g, ', ').replace(/Contact.*$/gi, '').trim();
  let desc = (property.description || '').replace(/Contact\s+\w+\s+today.*$/gi, '').trim();
  const blocks = [];
  const parseSpans = text => {
    const spans = [];
    const parts = text.split(/(\*\*.*?\*\*)/g);
    parts.forEach(part => {
      if (!part) return;
      if (part.startsWith('**') && part.endsWith('**')) {
        spans.push({
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text: part.slice(2, -2),
          marks: ["strong"]
        });
      } else {
        spans.push({
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text: part,
          marks: []
        });
      }
    });
    return spans;
  };
  const sections = desc.split(/\n?\s*(Property Features:|Building Amenities:|Nearby Attractions.*?:|\*\*.*?\*\*)\s*/gi);
  for (let i = 0; i < sections.length; i++) {
    const part = sections[i].trim();
    if (!part) continue;
    if (part.match(/^(Property Features|Building Amenities|Nearby Attractions.*):?$/i) || part.startsWith('**') && part.endsWith('**')) {
      const cleanTitle = part.replace(/^\*\*|\*\*$/g, '').replace(/:$/, '');
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2, 10),
        style: "h3",
        markDefs: [],
        children: [{
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text: cleanTitle,
          marks: ["strong"]
        }]
      });
      continue;
    }
    const items = part.split(/\n/).map(item => item.trim()).filter(item => item.length > 2);
    items.forEach(item => {
      let cleanItem = item.replace(/^\s*-\s*/, '').replace(/\s*\|\s*/g, ', ');
      if (item.match(/^\s*-\s*/) || cleanItem.match(/^\d+|^[A-Z]|^Built|^Semi|^Balcony|^Low|^High|^Rooftop|^Sauna|^Kids|^Lounge|^24|^Covered|^Dubai/)) {
        blocks.push({
          _type: "block",
          _key: Math.random().toString(36).slice(2, 10),
          style: "normal",
          listItem: "bullet",
          markDefs: [],
          children: parseSpans(cleanItem)
        });
      } else {
        blocks.push({
          _type: "block",
          _key: Math.random().toString(36).slice(2, 10),
          style: "normal",
          markDefs: [],
          children: parseSpans(cleanItem)
        });
      }
    });
  }
  let mainImageAssetId = null;
  const galleryAssetIds = [];
  if (property.imageUrls && property.imageUrls.length > 0) {
    mainImageAssetId = await uploadImageFromUrl(property.imageUrls[0], `${slug}-main.jpg`);
    const galleryUrls = property.imageUrls.slice(1, 10);
    for (let i = 0; i < galleryUrls.length; i++) {
      const assetId = await uploadImageFromUrl(galleryUrls[i], `${slug}-gallery-${i + 1}.jpg`);
      if (assetId) galleryAssetIds.push(assetId);
    }
  }
  const doc = {
    _type: "property",
    _id: docId,
    title: property.title,
    slug: {
      _type: "slug",
      current: slug
    },
    propertyId: `EMR-${Date.now().toString().slice(-6)}`,
    price: property.price,
    priceLabel: property.priceLabel || null,
    status: property.status,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    areaUnit: property.areaUnit || "sqft",
    excerpt: cleanExcerpt,
    description: blocks,
    completionStatus: property.completionStatus || "ready",
    buildingName: property.buildingName || null,
    furnishing: property.furnishing || null,
    floorNumber: property.floorNumber || null,
    viewType: property.viewType || null,
    developer: property.developer || null,
    amenities: property.amenities || [],
    tags: property.tags || [],
    featured: property.featured || false,
    publishedAt: new Date().toISOString(),
    location: {
      _type: "object",
      area: property.location?.area || "",
      city: property.location?.city || "Dubai",
      fullAddress: property.location?.fullAddress || ""
    },
    agent: {
      _type: "reference",
      _ref: AGENT_ID
    },
    ...(mainImageAssetId && {
      mainImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: mainImageAssetId
        },
        alt: property.title
      }
    }),
    ...(galleryAssetIds.length > 0 && {
      gallery: galleryAssetIds.map((assetId, i) => ({
        _type: "image",
        _key: `gallery-${i}`,
        asset: {
          _type: "reference",
          _ref: assetId
        },
        alt: `${property.title} - Image ${i + 2}`
      }))
    }),
    ...(property.handoverDate && {
      handoverDate: property.handoverDate
    }),
    seo: {
      metaTitle: `${property.title} | Emiratiyo`,
      metaDescription: cleanExcerpt.slice(0, 160) || ""
    }
  };
  try {
    const result = await client.createOrReplace(doc);
    console.log(`  ✅ Pushed: ${result._id}`);
    return result;
  } catch (err) {
    console.error(`  ❌ Failed: ${err.message}`);
    return null;
  }
}
async function push() {
  console.log("🚀 Starting property push...");
  console.log(`   Project: ${process.env.VITE_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.VITE_SANITY_DATASET}`);
  console.log(`   Properties to push: ${PROPERTIES.length}\n`);
  let success = 0;
  let failed = 0;
  for (let i = 0; i < PROPERTIES.length; i++) {
    const result = await pushProperty(PROPERTIES[i], i);
    if (result) success++;else failed++;
    if (i < PROPERTIES.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
  console.log("\n─────────────────────────────────────");
  console.log(`✅ Done! Pushed: ${success} | Failed: ${failed}`);
  console.log("🌐 Check your Sanity Studio to verify listings.");
}
push();
