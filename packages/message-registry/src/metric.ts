type NEW_REQUEST_EVENT = {
  protocolNetwork: string;
  fullRoute: string;
  method: string;
  apiKey: string;
};

export type METRIC_MESSAGES = {
  NEW_REQUEST: NEW_REQUEST_EVENT;
};
