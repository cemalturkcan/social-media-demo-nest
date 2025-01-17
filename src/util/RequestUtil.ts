import { Request } from 'express';

export function getAuthenticatedUserId(req: Request): number {
  const user = req['user'] as { sub: number };
  return user.sub;
}
