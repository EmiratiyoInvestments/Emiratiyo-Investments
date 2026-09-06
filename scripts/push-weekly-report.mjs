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
  weekEnding: "2026-09-06",
  statsGroup: {
    totalValue: 7800,
    valueChangePct: 13.97,
    totalVolume: 2836,
    volumeChangePct: 25.32,
    pricePerSqft: 1700,
    priceChangePct: 2.08
  },
  offPlanApartments: [{
    _key: "opa1",
    projectName: "Binghatti Skyterraces",
    volume: 84,
    valueMillion: 75.9
  }, {
    _key: "opa2",
    projectName: "Binghatti Skyflame 1",
    volume: 80,
    valueMillion: 55.3
  }, {
    _key: "opa3",
    projectName: "TODO: name missing from source", // volume 73, value 200.1M — fill in
    volume: 73,
    valueMillion: 200.1
  }, {
    _key: "opa4",
    projectName: "Binghatti Skyflame 2",
    volume: 50,
    valueMillion: 39.4
  }, {
    _key: "opa5",
    projectName: "Binghatti Cullinan",
    volume: 44,
    valueMillion: 66.6
  }],
  offPlanVillas: [{
    _key: "opv1",
    projectName: "Al Rowaiyah First",
    volume: 38,
    valueMillion: 192.1
  }, {
    _key: "opv2",
    projectName: "Dubai Investment Park First",
    volume: 21,
    valueMillion: 27.6
  }, {
    _key: "opv3",
    projectName: "Damac Islands 2 - Bermuda",
    volume: 5,
    valueMillion: 17.1
  }, {
    _key: "opv4",
    projectName: "Dubai South",
    volume: 4,
    valueMillion: 19.6
  }, {
    _key: "opv5",
    projectName: "Verdana",
    volume: 6,
    valueMillion: 44.8
  }],
  readyApartments: [{
    _key: "ra1",
    projectName: "Dune Residency Dubai",
    volume: 14,
    valueMillion: 10.8
  }, {
    _key: "ra2",
    projectName: "Dubai Marina",
    volume: 8,
    valueMillion: 28.5
  }, {
    _key: "ra3",
    projectName: "Binghatti Apex",
    volume: 8,
    valueMillion: 8
  }, {
    _key: "ra4",
    projectName: "Skycourts Tower C",
    volume: 6,
    valueMillion: 3.6
  }, {
    _key: "ra5",
    projectName: "Sobha Hartland - Crest Grande",
    volume: 5,
    valueMillion: 14.5
  }],
  readyVillas: [{
    _key: "rv1",
    projectName: "Al Yufrah 1",
    volume: 45,
    valueMillion: 283.5
  }, {
    _key: "rv2",
    projectName: "Mudon Al Ranim",
    volume: 16,
    valueMillion: 64
  }, {
    _key: "rv3",
    projectName: "The Springs",
    volume: 9,
    valueMillion: 45.7
  }, {
    _key: "rv4",
    projectName: "Damac Lagoons - Malta",
    volume: 9,
    valueMillion: 22.4
  }, {
    _key: "rv5",
    projectName: "Meadows",
    volume: 5,
    valueMillion: 57.5
  }],
  plots: [{
    _key: "pl1",
    projectName: "Jabal Ali Industrial First",
    volume: 10,
    valueMillion: 92
  }, {
    _key: "pl2",
    projectName: "Hor Al Anz",
    volume: 4,
    valueMillion: 9.4
  }, {
    _key: "pl3",
    projectName: "Abu Hail",
    volume: 4,
    valueMillion: 6
  }, {
    _key: "pl4",
    projectName: "Damac Lagoons - Nice (All Phases)",
    volume: 3,
    valueMillion: 8.1
  }, {
    _key: "pl5",
    projectName: "Al Warqa First",
    volume: 2,
    valueMillion: 22.5
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