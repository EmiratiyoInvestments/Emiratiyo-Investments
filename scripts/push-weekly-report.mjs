import { createClient } from "@sanity/client";
import { config } from "dotenv";
config();
const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  token: process.env.VITE_SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false
});
const DATA = {
  weekEnding: "2026-08-30",
  statsGroup: {
    totalValue: 6800,
    valueChangePct: -5.18,
    totalVolume: 2263,
    volumeChangePct: -27.88,
    pricePerSqft: 1700,
    priceChangePct: -1.32
  },
  offPlanApartments: [{
    _key: "opa1",
    projectName: "TODO: name missing from source", // volume 61, value 176.6M — fill in
    volume: 61,
    valueMillion: 176.6
  }, {
    _key: "opa2",
    projectName: "Serra Tower 2",
    volume: 53,
    valueMillion: 87.3
  }, {
    _key: "opa3",
    projectName: "Azizi Venice 11",
    volume: 43,
    valueMillion: 38
  }, {
    _key: "opa4",
    projectName: "Azizi Venice 10 Building A",
    volume: 28,
    valueMillion: 22.4
  }, {
    _key: "opa5",
    projectName: "Azizi Venice 10 Building B",
    volume: 28,
    valueMillion: 20.5
  }],
  offPlanVillas: [{
    _key: "opv1",
    projectName: "Al Rowaiyah First",
    volume: 29,
    valueMillion: 121.8
  }, {
    _key: "opv2",
    projectName: "Damac Islands 2 - Bahamas - All Phases",
    volume: 14,
    valueMillion: 39.5
  }, {
    _key: "opv3",
    projectName: "Damac Islands 2 - Cuba",
    volume: 10,
    valueMillion: 24.7
  }, {
    _key: "opv4",
    projectName: "Cedarwood Estates",
    volume: 7,
    valueMillion: 169.1
  }, {
    _key: "opv5",
    projectName: "Damac Islands 2 - Bermuda",
    volume: 5,
    valueMillion: 21.3
  }],
  readyApartments: [{
    _key: "ra1",
    projectName: "Veritas Residence",
    volume: 22,
    valueMillion: 36.3
  }, {
    _key: "ra2",
    projectName: "Binghatti Apex",
    volume: 8,
    valueMillion: 7.6
  }, {
    _key: "ra3",
    projectName: "Luma Park Views",
    volume: 7,
    valueMillion: 10.2
  }, {
    _key: "ra4",
    projectName: "Golf Grand",
    volume: 6,
    valueMillion: 13.5
  }, {
    _key: "ra5",
    projectName: "Blue Bell Residences",
    volume: 6,
    valueMillion: 5.2
  }],
  readyVillas: [{
    _key: "rv1",
    projectName: "Al Yufrah 1",
    volume: 72,
    valueMillion: 449.6
  }, {
    _key: "rv2",
    projectName: "Mudon Al Ranim",
    volume: 16,
    valueMillion: 60.3
  }, {
    _key: "rv3",
    projectName: "The Valley",
    volume: 10,
    valueMillion: 35.1
  }, {
    _key: "rv4",
    projectName: "Costa Brava",
    volume: 7,
    valueMillion: 26.2
  }, {
    _key: "rv5",
    projectName: "Reem - Mira Community",
    volume: 6,
    valueMillion: 21
  }],
  plots: [{
    _key: "pl1",
    projectName: "Hor Al Anz",
    volume: 3,
    valueMillion: 12.7
  }, {
    _key: "pl2",
    projectName: "Wadi Al Safa 5",
    volume: 2,
    valueMillion: 208
  }, {
    _key: "pl3",
    projectName: "Al Ras",
    volume: 2,
    valueMillion: 53
  }, {
    _key: "pl4",
    projectName: "Al Ttay",
    volume: 2,
    valueMillion: 10
  }, {
    _key: "pl5",
    projectName: "Nad Al Sheba Villas",
    volume: 2,
    valueMillion: 9.9
  }]
};
async function push() {
  const doc = {
    _type: "marketReport",
    _id: `marketReport-${DATA.weekEnding}`,
    ...DATA
  };
  try {
    const result = await client.createOrReplace(doc);
    console.log("Pushed:", result._id);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
push();