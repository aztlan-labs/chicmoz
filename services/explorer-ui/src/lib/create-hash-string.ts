export const createHashString = (value: string) => {
  const startHash = value.substring(0, 10);
  const endHash = value.substring(value.length - 10, value.length);
  return `${startHash}...${endHash}`;
};
