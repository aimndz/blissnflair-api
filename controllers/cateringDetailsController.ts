import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cateringDetailsController = {
  //--------- Packages CRUD ---------//
  getAllPackages: asyncHandler(async (req: Request, res: Response) => {
    const packages = await prisma.packagesDetails.findMany();
    res.json(packages);
  }),

  createPackage: asyncHandler(async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const newPackage = await prisma.packagesDetails.create({
      data: { title, description },
    });
    res.status(201).json(newPackage);
  }),

  updatePackage: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedPackage = await prisma.packagesDetails.update({
      where: { id },
      data: { title, description },
    });
    res.json(updatedPackage);
  }),

  deletePackage: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.packagesDetails.delete({ where: { id } });
    res.status(204).send();
  }),

  //-------- Inclusions CRUD --------//
  getAllInclusions: asyncHandler(async (req: Request, res: Response) => {
    const inclusions = await prisma.inclusionsDetails.findMany();
    res.json(inclusions);
  }),

  createInclusion: asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const newInclusion = await prisma.inclusionsDetails.create({
      data: { name, description },
    });
    res.status(201).json(newInclusion);
  }),

  updateInclusion: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedInclusion = await prisma.inclusionsDetails.update({
      where: { id },
      data: { name, description },
    });
    res.json(updatedInclusion);
  }),

  deleteInclusion: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.inclusionsDetails.delete({ where: { id } });
    res.status(204).send();
  }),

  //-------- Main Dishes CRUD --------//
  getAllMainDishes: asyncHandler(async (req: Request, res: Response) => {
    const mainDishes = await prisma.mainDishDetails.findMany();
    res.json(mainDishes);
  }),

  createMainDish: asyncHandler(async (req: Request, res: Response) => {
    const { name, category, description } = req.body;
    const mainDish = await prisma.mainDishDetails.create({
      data: { name, category, description },
    });
    res.status(201).json(mainDish);
  }),

  updateMainDish: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, description } = req.body;
    const updatedMainDish = await prisma.mainDishDetails.update({
      where: { id },
      data: { name, category, description },
    });
    res.json(updatedMainDish);
  }),

  deleteMainDish: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.mainDishDetails.delete({ where: { id } });
    res.status(204).send();
  }),

  //-------- Snack Corner CRUD --------//
  getAllSnackCorners: asyncHandler(async (req: Request, res: Response) => {
    const snackCorners = await prisma.pickASnackCornerDetails.findMany();
    res.json(snackCorners);
  }),

  createSnackCorner: asyncHandler(async (req: Request, res: Response) => {
    const { name, category, description } = req.body;
    const snackCorner = await prisma.pickASnackCornerDetails.create({
      data: { name, category, description },
    });
    res.status(201).json(snackCorner);
  }),

  updateSnackCorner: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, description } = req.body;
    const updatedSnackCorner = await prisma.pickASnackCornerDetails.update({
      where: { id },
      data: { name, category, description },
    });
    res.json(updatedSnackCorner);
  }),

  deleteSnackCorner: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.pickASnackCornerDetails.delete({ where: { id } });
    res.status(204).send();
  }),

  //-------- Add-Ons CRUD --------//
  getAllAddOns: asyncHandler(async (req: Request, res: Response) => {
    const addOns = await prisma.cateringAddOnsDetails.findMany();
    res.json(addOns);
  }),

  createAddOn: asyncHandler(async (req: Request, res: Response) => {
    const { name, category, description, price } = req.body;
    const addOn = await prisma.cateringAddOnsDetails.create({
      data: { name, category, description, price },
    });
    res.status(201).json(addOn);
  }),

  updateAddOn: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, description, price } = req.body;
    const updatedAddOn = await prisma.cateringAddOnsDetails.update({
      where: { id },
      data: { name, category, description, price },
    });
    res.json(updatedAddOn);
  }),

  deleteAddOn: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.cateringAddOnsDetails.delete({ where: { id } });
    res.status(204).send();
  }),
};

export default cateringDetailsController;
