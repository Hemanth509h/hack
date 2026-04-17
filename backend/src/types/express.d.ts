// Extend Express's Request interface so passport's req.user remains flexible.
// We cast to 'any' in auth-aware controllers via AuthRequest instead.
declare namespace Express {
  // Keep req.user as 'any' to avoid conflicts between passport User and our JWT payload.
  interface User {
    [key: string]: any;
  }
}
