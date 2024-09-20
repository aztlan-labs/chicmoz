/**
 * The following error classes are defined based on standard
 * HTTP status codes https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 *
 * We consider default `Error` class to be the representation of "500 internal server error"
 */

// 4xx errors

export class BadRequestError extends Error {
  readonly code = 400;
}

export class UnauthorizedError extends Error {
  readonly code = 401;
}

export class ForbiddenError extends Error {
  readonly code = 403;
}

export class NotFoundError extends Error {
  readonly code = 404;
}

export class MethodNotAllowedError extends Error {
  readonly code = 405;
}

export class NotAcceptableError extends Error {
  readonly code = 406;
}

export class ProxyAuthenticationRequiredError extends Error {
  readonly code = 407;
}

export class RequestTimeoutError extends Error {
  readonly code = 408;
}

export class ConflictError extends Error {
  readonly code = 409;
}

export class TeapotError extends Error {
  readonly code = 418;
}

export class TooManyRequestsError extends Error {
  readonly code = 429;
}

// 5xx errors
// 500 Internal Error is omitted since every instance of `Error` will default to 500

export class NotImplementedError extends Error {
  readonly code = 501;
}

export class BadGatewayError extends Error {
  readonly code = 502;
}

export class ServiceUnavailableError extends Error {
  readonly code = 503;
}

export class GatewayTimeoutError extends Error {
  readonly code = 504;
}

// TODO: these should have a more generic name and we should use CHICMOZ_ERRORS for more specific errors
export const CHICMOZ_ERRORS = [
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  MethodNotAllowedError,
  NotAcceptableError,
  ProxyAuthenticationRequiredError,
  RequestTimeoutError,
  ConflictError,
  TeapotError,
  TooManyRequestsError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
];
