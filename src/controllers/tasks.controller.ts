import { Task } from "../schemas/task.schema";

type Request = {
  body: unknown;
  params: Record<string, string>;
};

type Response = {
  status: (code: number) => Response;
  json: (payload: unknown) => Response;
};

type NextFunction = (error?: unknown) => void;

const tasks: Task[] = [];

export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const task = tasks.find((item) => item.id === req.params.id);

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const taskData = req.body as Omit<Task, "id">;
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed ?? false,
      dueDate: taskData.dueDate,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const task = tasks.find((item) => item.id === req.params.id);

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    const updates = req.body as Partial<Omit<Task, "id">>;
    if (typeof updates.title === "string") task.title = updates.title;
    if (typeof updates.description === "string") task.description = updates.description;
    if (typeof updates.completed === "boolean") task.completed = updates.completed;
    if (typeof updates.dueDate === "string") task.dueDate = updates.dueDate;

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const index = tasks.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    tasks.splice(index, 1);
    res.status(204).json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};
