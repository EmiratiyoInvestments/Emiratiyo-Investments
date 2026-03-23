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
  weekEnding: "2026-03-15",
  statsGroup: {
    totalValue: 12400,
    valueChangePct: 49.65,
    totalVolume: 3730,
    volumeChangePct: 55.91,
    pricePerSqft: 1700,
    priceChangePct: -2.8,
  },
  offPlanApartments: [
    { _key: "opa1", projectName: "Bararigate By Ade",        volume: 41, valueMillion: 39.1 },
    { _key: "opa2", projectName: "Sierra By Iman",            volume: 37, valueMillion: 62.3 },
    { _key: "opa3", projectName: "Hado By Beyond Tower C",    volume: 35, valueMillion: 127.4 },
    { _key: "opa4", projectName: "Kensington Gardens",        volume: 34, valueMillion: 36.4 },
    { _key: "opa5", projectName: "Samana Boulevard Heights",  volume: 32, valueMillion: 30.3 },
  ],
  offPlanVillas: [
    { _key: "opv1", projectName: "Damac Islands 2 - Tahiti 2", volume: 67, valueMillion: 200 },
    { _key: "opv2", projectName: "Damac Islands 2 - Tahiti 1", volume: 49, valueMillion: 150.6 },
    { _key: "opv3", projectName: "Damac Islands 2 - Cuba",     volume: 43, valueMillion: 121.9 },
    { _key: "opv4", projectName: "Damac Islands 2 - Bermuda",  volume: 29, valueMillion: 80 },
    { _key: "opv5", projectName: "Damac Islands 2 - Maui",     volume: 17, valueMillion: 58.3 },
  ],
  readyApartments: [
    { _key: "ra1", projectName: "Majan",         volume: 223, valueMillion: 149.8 },
    { _key: "ra2", projectName: "Affini",         volume: 12,  valueMillion: 17.4 },
    { _key: "ra3", projectName: "Kappa Acca -5",  volume: 10,  valueMillion: 6.3 },
    { _key: "ra4", projectName: "Ost Tower 11",   volume: 7,   valueMillion: 7.6 },
    { _key: "ra5", projectName: "Mog 225",        volume: 6,   valueMillion: 4.6 },
  ],
  readyVillas: [
    { _key: "rv1", projectName: "Salva The Heights",   volume: 63, valueMillion: 550.4 },
    { _key: "rv2", projectName: "Serro 2 The Heights", volume: 56, valueMillion: 451 },
    { _key: "rv3", projectName: "Serro The Heights",   volume: 27, valueMillion: 207.3 },
    { _key: "rv4", projectName: "Mareva The Oasis",    volume: 16, valueMillion: 399.9 },
    { _key: "rv5", projectName: "Mareva 2 The Oasis",  volume: 11, valueMillion: 215.1 },
  ],
  plots: [
    { _key: "pl1", projectName: "Jebel Ali Hills",      volume: 5, valueMillion: 20.8 },
    { _key: "pl2", projectName: "Um Suqaim First",       volume: 4, valueMillion: 560.4 },
    { _key: "pl3", projectName: "Al Goze First",         volume: 4, valueMillion: 71.1 },
    { _key: "pl4", projectName: "Dubai Industrial City", volume: 4, valueMillion: 51.6 },
    { _key: "pl5", projectName: "Ivory",                 volume: 3, valueMillion: 11.4 },
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