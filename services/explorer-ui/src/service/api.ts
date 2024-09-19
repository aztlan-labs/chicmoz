import { type ChicmozL2Block, chicmozL2BlockSchema, chicmozL2ContractInstanceDeluxeSchema, type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import { API_URL, aztecExplorer } from "./constants";
import {z} from "zod";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": "true",
};

export const getLatestHeight = async () => {
  const url = `${API_URL}/${aztecExplorer.getL2LatestHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching latest height: ${JSON.stringify(result)}`);

  return result;
};

export const getLatestBlock = async (): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getL2LatestBlock}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  if (response.status !== 200) throw new Error(`An error occurred while fetching latest height: ${JSON.stringify(result)}`);

  const res = chicmozL2BlockSchema.parse(result);


  return res;
};

export const getBlockByHeight = async (height: number): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getL2BlockByHeight}${height}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height: ${JSON.stringify(result)}`);

  return result;
};

export const getBlocksByHeightRange = async (start: number, end: number) => {
  const url = `${API_URL}/${aztecExplorer.getL2BlocksByHeightRange}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching blocks by height range: ${JSON.stringify(result)}`);

  return result;
};

export const getBlocksByHash = async (hash: string): Promise<ChicmozL2Block> => {
  const url = `${API_URL}/${aztecExplorer.getL2BlockByHash}${hash}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching block by hash: ${JSON.stringify(result)}`);

  return result;
};

export const getTransactionById = async (id: string) => {
  const url = `${API_URL}/${aztecExplorer.getL2TransactionById}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
    body: JSON.stringify({ id }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transaction by id: ${JSON.stringify(result)}`);

  return result;
};

export const getTransactionsByHeight = async (height: number) => {
  const url = `${API_URL}/${aztecExplorer.getL2TransactionsByHeight}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
    body: JSON.stringify({ height }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transactions by height: ${JSON.stringify(result)}`);

  return result;
};

export const getTransactionByHeightAndIndex = async (height: number, index: number) => {
  const url = `${API_URL}/${aztecExplorer.getL2TransactionByHeightAndIndex(height, index)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transaction by height and index: ${JSON.stringify(result)}`);

  return result;
}

export const getTransactionsByHeightRange = async (start: number, end: number) => {
  const url = `${API_URL}/${aztecExplorer.getL2TransactionsByHeightRange}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
    body: JSON.stringify({ start, end }),
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching transactions by height range: ${JSON.stringify(result)}`);

  return result;
};

export const getL2ContractInstance = async (address: string): Promise<ChicmozL2ContractInstanceDeluxe> => {
  const url = `${API_URL}/${aztecExplorer.getL2ContractInstance}${address}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching contract instance: ${JSON.stringify(result)}`);

  const res = chicmozL2ContractInstanceDeluxeSchema.parse(result);

  return res;
}

export const getL2ContractInstancesByBlockHash = async (hash: string): Promise<ChicmozL2ContractInstanceDeluxe[]> => {
  const url = `${API_URL}/${aztecExplorer.getL2ContractInstancesByBlockHash(hash)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });
  const result = await response.json();

  console.info(`GET ${url}: `, response.status);
  if (response.status !== 200) throw new Error(`An error occurred while fetching contract instances by block hash: ${JSON.stringify(result)}`);

  const res = z.array(chicmozL2ContractInstanceDeluxeSchema).parse(result);

  return res;
}
