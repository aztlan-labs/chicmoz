// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const emitL1Update = async (_a: any) => {
  // TODO: Implement this
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const onConnectedToAztec = async (_a: any) => {
  // TODO: Implement this
};

export const emit = {
  l1Update: emitL1Update,
};

export const handlers = {
  connectedToAztec: onConnectedToAztec,
};

