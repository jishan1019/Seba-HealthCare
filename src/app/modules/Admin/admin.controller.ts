import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  const result = AdminService.getAllAdminFromDB(req.query);

  return result;
};

export const AdminController = {
  getAllAdmin,
};
