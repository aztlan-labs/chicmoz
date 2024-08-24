import { NextFunction, Request, Response } from "express";
import { InsufficientScopeError, InvalidTokenError, JWTPayload, auth, claimCheck } from "express-oauth2-jwt-bearer";

export const checkRequiredPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissionCheck = claimCheck((payload: JWTPayload) => {
      const permissions = payload.permissions as string[];

      const hasPermissions = requiredPermissions.every((requiredPermission) => permissions.includes(requiredPermission));

      if (!hasPermissions) throw new InsufficientScopeError();

      return hasPermissions;
    }) ;

    permissionCheck(req, res, next);
  };
};

export const validateAccessTokenPayload = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId || typeof userId !== "string") throw new InvalidTokenError("The userId is undefined or invalid");

  res.locals.userId = userId;
  next();
};

export const validateAccessToken = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
}) ;
