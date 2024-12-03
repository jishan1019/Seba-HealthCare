import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmin = async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllAdminFromDB(filters, options);

  res.json(result);
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.getSingleAdminFromDB(id);

  res.json(result);
};

const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.updateAdminFromDB(id, req.body);

  res.json(result);
};

const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.deleteAdminFromDB(id);

  res.json(result);
};

const softAdminDelete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.softAdminDeleteFromDB(id);

  res.json(result);
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softAdminDelete,
};
