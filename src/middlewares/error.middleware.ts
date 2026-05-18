type Request = {
  body?: unknown;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

type Response = {
  status: (code: number) => Response;
  json: (payload: unknown) => Response;
};

type NextFunction = (error?: unknown) => void;

export interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction): void => {
  const status = typeof error === "object" && error !== null && "status" in error && typeof (error as any).status === "number"
    ? (error as any).status
    : 500;

  const message = error instanceof Error ? error.message : "Internal server error.";
  console.error(error);

  res.status(status).json({
    error: message,
  });
};
