type Request = {
  body: unknown;
  params: Record<string, unknown>;
};

type Response = {
  status: (code: number) => Response;
  json: (payload: unknown) => Response;
};

type NextFunction = (error?: unknown) => void;

import { validateTaskPayload, validateTaskIdParam } from "../schemas/task.schema";

export const validateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = validateTaskPayload(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid task payload." });
  }
};

export const validateTaskId = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.params.id = validateTaskIdParam(req.params.id);
    next();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid task id." });
  }
};
