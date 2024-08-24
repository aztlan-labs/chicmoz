import { API_URL, aztecExplorer } from "./constants";

export const getLatestHeight = async () => {
  const url = `${API_URL}/${aztecExplorer.getLatestHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching latest height: ${result}`);

  return result;
};

export const getBlockByHeight = async (height: number) => {
  const url = `${API_URL}/${aztecExplorer.getBlockByHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ height }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height range: ${result}`);

  return result;
};

export const getBlocksByHeightRange = async (start: number, end: number) => {
  const url = `${API_URL}/${aztecExplorer.getBlocksByHeightRange}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height range: ${result}`);

  return result;
};

export const getBlocksByHash = async (hash: string) => {
  const url = `${API_URL}/${aztecExplorer.getBlockByHash}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hash }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching block by hash: ${result}`);

  return result;
};

export const getTransactionById = async (id: string) => {
  const url = `${API_URL}/${aztecExplorer.getTransactionById}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transaction by id: ${result}`);

  return result;
};

export const getTransactionsByHeight = async (height: number) => {
  const url = `${API_URL}/${aztecExplorer.getTransactionsByHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ height }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transactions by height: ${result}`);

  return result;
};

export const getTransactionsByHeightRange = async (start: number, end: number) => {
  const url = `${API_URL}/${aztecExplorer.getTransactionsByHeightRange}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transactions by height range: ${result}`);

  return result;
};
