// src/sanity/schemas/marketReport.js
// After adding this file, import it in your schema index and add to the types array.
// e.g. in schemaTypes/index.js: import marketReport from './marketReport'; export default [marketReport, ...]

const projectRowFields = [
  {
    name: "projectName",
    title: "Project Name",
    type: "string",
    validation: (Rule) => Rule.required(),
  },
  {
    name: "volume",
    title: "Volume (No. of Transactions)",
    type: "number",
  },
  {
    name: "valueMillion",
    title: "Value in AED Millions",
    description: "e.g. for AED 112.6M enter 112.6 — for AED 1.9B enter 1900",
    type: "number",
  },
];

const projectRowPreview = {
  select: { title: "projectName", subtitle: "volume" },
  prepare({ title, subtitle }) {
    return { title, subtitle: subtitle ? `Volume: ${subtitle}` : "" };
  },
};

const projectTable = (name, title) => ({
  name,
  title,
  type: "array",
  of: [
    {
      type: "object",
      fields: projectRowFields,
      preview: projectRowPreview,
    },
  ],
  description: "Add rows in order (top project first). No limit on rows.",
});

export default {
  name: "marketReport",
  title: "Market Report",
  type: "document",

  // Sort newest first in Sanity Studio list
  orderings: [
    {
      title: "Week Ending (Newest First)",
      name: "weekEndingDesc",
      by: [{ field: "weekEnding", direction: "desc" }],
    },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      name: "weekEnding",
      title: "Week Ending Date",
      type: "date",
      description: "The Sunday this report covers, e.g. 2026-02-15",
      validation: (Rule) => Rule.required(),
    },

    // ── Weekly Stats ──────────────────────────────────────────────────────────
    {
      name: "statsGroup",
      title: "Weekly Transaction Stats",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "totalValue",
          title: "Total Transaction Value (AED Millions)",
          type: "number",
          description: "Enter in MILLIONS. e.g. AED 18.7B → enter 18700",
        },
        {
          name: "valueChangePct",
          title: "Value Change % vs Previous Week",
          type: "number",
          description: "e.g. +31.32 or -5.05",
        },
        {
          name: "totalVolume",
          title: "Total Volume (No. of Transactions)",
          type: "number",
          description: "e.g. 4460",
        },
        {
          name: "volumeChangePct",
          title: "Volume Change % vs Previous Week",
          type: "number",
        },
        {
          name: "pricePerSqft",
          title: "Average Price Per Sqft (AED)",
          type: "number",
          description: "e.g. 1700",
        },
        {
          name: "priceChangePct",
          title: "Price/Sqft Change % vs Previous Week",
          type: "number",
        },
      ],
    },

    // ── Best Selling Project Tables ───────────────────────────────────────────
    projectTable("offPlanApartments", "🏢 Off-Plan Apartments — Top Projects"),
    projectTable("offPlanVillas", "🏡 Off-Plan Villas — Top Projects"),
    projectTable("readyApartments", "🏢 Ready Apartments — Top Projects"),
    projectTable("readyVillas", "🏡 Ready Villas — Top Projects"),
    projectTable("plots", "🌍 Plots — Top Projects"),
  ],

  // What shows in the Studio document list
  preview: {
    select: {
      weekEnding: "weekEnding",
      volume: "statsGroup.totalVolume",
    },
    prepare({ weekEnding, volume }) {
      const label = weekEnding
        ? new Date(weekEnding).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "No date";
      return {
        title: `Week ending ${label}`,
        subtitle: volume ? `${volume.toLocaleString()} transactions` : "",
      };
    },
  },
};