const START_HASH_LENGTH = 6;
const END_HASH_LENGTH = 4;
const TRUNCATE_STRING = "...";

const TOTAL_HASH_LENGTH =
  START_HASH_LENGTH + END_HASH_LENGTH + TRUNCATE_STRING.length;
export const truncateHashString = (value: string) => {
  if (value.length <= TOTAL_HASH_LENGTH) return value;
  const startHash = value.substring(0, START_HASH_LENGTH);
  const endHash = value.substring(value.length - END_HASH_LENGTH, value.length);
  return `${startHash}${TRUNCATE_STRING}${endHash}`;
};
