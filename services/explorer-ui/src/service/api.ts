import { type ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";
import { API_URL, aztecExplorer } from "./constants";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": "true",
};

export const getLatestHeight = async () => {
  const url = `${API_URL}/${aztecExplorer.getLatestHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching latest height: ${result}`);

  return result;
};

export const getLatestBlock = async (): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getLatestBlock}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  const res = chicmozL2BlockSchema.parse(result);

  if (response.status !== 200) throw new Error(`An error occurred while fetching latest height: ${result}`);

  return res;
};

export const getBlockByHeight = async (height: number): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getBlockByHeight}${height}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height: ${result}`);

  return result;
};

export const getBlocksByHeightRange = async (start: number, end: number) => {
  const url = `${API_URL}/${aztecExplorer.getBlocksByHeightRange}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height range: ${result}`);

  return result;
};

export const getBlocksByHash = async (hash: string): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getBlockByHash}${hash}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
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
    headers: defaultHeaders,
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
    headers: defaultHeaders,
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
    headers: defaultHeaders,
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transactions by height range: ${result}`);

  return result;
};
