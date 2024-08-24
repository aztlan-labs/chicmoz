type SUBSCRIPTION_EVENT = {
  tier: string;
  requestsPerMonth: number;
  requestsPer10Seconds: number;
  createdAt: number;
  action: "CREATED" | "UPDATED" | "RESET";
  subscriptionId: string;
  clientId?: string;
};

type ADD_API_KEY_EVENT = {
  apiKey: string;
  subscriptionId: string;
  clientId?: string;
};

type UPDATE_TIER_LIMITS_EVENT = {
  tier: string;
  requestsPerMonth: number;
  requestsPer10Seconds: number;
  clientId?: string;
};

type CREATE_API_KEY_FOR_PROJECT_EVENT = {
  userId: string;
  apiKey?: string;
  projectId: string;
  clientId?: string;
};

type ADD_API_KEY_TO_PROJECT_EVENT = {
  apiKey: string;
  userId: string;
  projectId: string;
  clientId?: string;
};

// this event signals the end of the api key creation flow
type END_CREATE_API_KEY_EVENT = {
  apiKey: string;
  userId: string;
  projectId: string;
  clientId?: string;
};

type DELETE_API_KEY_EVENT = {
  subscriptionId: string;
  apiKey: string;
  projectId?: string;
  clientId?: string;
};

// this event signals the end of the api key deletion flow
type END_DELETE_API_KEY_EVENT = {
  apiKey: string;
  clientId?: string;
};

export type SUBSCRIPTION_MESSAGES = {
  SUBSCRIPTION: SUBSCRIPTION_EVENT;
  ADD_API_KEY: ADD_API_KEY_EVENT;
  DELETE_API_KEY: DELETE_API_KEY_EVENT;
  UPDATE_TIER_LIMITS: UPDATE_TIER_LIMITS_EVENT;
  ADD_API_KEY_TO_PROJECT: ADD_API_KEY_TO_PROJECT_EVENT;
  CREATE_API_KEY_FOR_PROJECT: CREATE_API_KEY_FOR_PROJECT_EVENT;
  END_CREATE_API_KEY: END_CREATE_API_KEY_EVENT;
  END_DELETE_API_KEY: END_DELETE_API_KEY_EVENT;
};
