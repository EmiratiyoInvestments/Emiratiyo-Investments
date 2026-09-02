import Papa from "papaparse";

export const TRANSACTION_CSV_PATH = "/data/transaction-26.csv";

export function loadTransactions() {
  return new Promise((resolve, reject) => {
    Papa.parse(TRANSACTION_CSV_PATH, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err)
    });
  });
}
