import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";

const getAllAdmin = async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllAdminFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins fetched successfully",
    meta: result.meta,
    data: result.data,
  });
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is fetched successfully",
    data: result,
  });
};

const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.updateAdminFromDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  });
};

const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
};

const softAdminDelete = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = AdminService.softAdminDeleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softAdminDelete,
};
