import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";

const getAllAdmin = async (req: Request, res: Response) => {
  const filters = pick(req.query, ["name", "email", "searchTerm"]);

  const result = AdminService.getAllAdminFromDB(filters);

  return result;
};

export const AdminController = {
  getAllAdmin,
};
