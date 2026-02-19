import { createClient } from "@sanity/client";
import { config } from "dotenv";

config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.VITE_SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const DATA = {
  weekEnding: "2026-02-15",
  statsGroup: {
    totalValue: 18700,
    valueChangePct: 31.32,
    totalVolume: 4460,
    volumeChangePct: 3.82,
    pricePerSqft: 1700,
    priceChangePct: -5.05,
  },
  offPlanApartments: [
    {
      _key: "opa1",
      projectName: "Maybach 6 - Tower B",
      volume: 72,
      valueMillion: 112.6,
    },
    {
      _key: "opa2",
      projectName: "Sierra By Iman",
      volume: 58,
      valueMillion: 89.7,
    },
    {
      _key: "opa3",
      projectName: "Samana Boulevard Heights",
      volume: 46,
      valueMillion: 38,
    },
    {
      _key: "opa4",
      projectName: "Greencrest Tower",
      volume: 43,
      valueMillion: 97.2,
    },
    {
      _key: "opa5",
      projectName: "Ivy At Park Five",
      volume: 40,
      valueMillion: 44.6,
    },
  ],
  offPlanVillas: [
    {
      _key: "opv1",
      projectName: "Al Yelayiss 1",
      volume: 288,
      valueMillion: 985.8,
    },
    {
      _key: "opv2",
      projectName: "The Valley",
      volume: 136,
      valueMillion: 62.9,
    },
    {
      _key: "opv3",
      projectName: "Dubai Investment Park Second",
      volume: 103,
      valueMillion: 93.3,
    },
    {
      _key: "opv4",
      projectName: "Rukan Residences",
      volume: 101,
      valueMillion: 16.7,
    },
    { _key: "opv5", projectName: "Anya", volume: 62, valueMillion: 20.8 },
  ],
  readyApartments: [
    { _key: "ra1", projectName: "Ashjar", volume: 47, valueMillion: 94.8 },
    { _key: "ra2", projectName: "Ritaj A", volume: 47, valueMillion: 18.9 },
    {
      _key: "ra3",
      projectName: "The Neighbourhood C1",
      volume: 46,
      valueMillion: 92.8,
    },
    {
      _key: "ra4",
      projectName: "Luma Park Views",
      volume: 14,
      valueMillion: 20.8,
    },
    {
      _key: "ra5",
      projectName: "Rabdan Building",
      volume: 12,
      valueMillion: 13.5,
    },
  ],
  readyVillas: [
    {
      _key: "rv1",
      projectName: "Al Yelayiss 5",
      volume: 31,
      valueMillion: 224.5,
    },
    {
      _key: "rv2",
      projectName: "Me'Aisem Second",
      volume: 26,
      valueMillion: 458.8,
    },
    {
      _key: "rv3",
      projectName: "Me'Aisem First",
      volume: 10,
      valueMillion: 182.8,
    },
    { _key: "rv4", projectName: "The Springs", volume: 7, valueMillion: 33.8 },
    {
      _key: "rv5",
      projectName: "The Pulse- Beachfront",
      volume: 7,
      valueMillion: 33.4,
    },
  ],
  plots: [
    {
      _key: "pl1",
      projectName: "Warsan Fourth",
      volume: 145,
      valueMillion: 1900,
    },
    {
      _key: "pl2",
      projectName: "Um Suqaim First",
      volume: 32,
      valueMillion: 63,
    },
    { _key: "pl3", projectName: "Hor Al Anz", volume: 3, valueMillion: 14.7 },
    { _key: "pl4", projectName: "Abu Hail", volume: 3, valueMillion: 7.1 },
    {
      _key: "pl5",
      projectName: "Al Yelayiss 1",
      volume: 2,
      valueMillion: 2300,
    },
  ],
};

async function push() {
  const doc = {
    _type: "marketReport",
    _id: `marketReport-${DATA.weekEnding}`,
    ...DATA,
  };
  try {
    const result = await client.createOrReplace(doc);
    console.log("Pushed:", result._id);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

push();
