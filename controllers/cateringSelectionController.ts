import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const cateringController = {
  getAllCatering: asyncHandler(async (req: Request, res: Response) => {
    const cateringSelections = await prisma.cateringSelection.findMany({
      include: {
        mainDishPackage: true,
        mainDishes: true,
        pickASnackCorner: true,
        addOns: true,
        event: true,
      },
    });

    res.json(cateringSelections);
  }),

  getCateringById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const cateringSelection = await prisma.cateringSelection.findUnique({
      where: { id },
      include: {
        mainDishPackage: true,
        mainDishes: true,
        pickASnackCorner: true,
        addOns: true,
        event: true,
      },
    });

    if (!cateringSelection) {
      res.status(404);
      throw new Error("Catering selection not found");
    }

    res.json(cateringSelection);
  }),

  getCateringByEventId: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const cateringSelection = await prisma.cateringSelection.findUnique({
      where: { eventId: id },
      include: {
        mainDishPackage: true,
        mainDishes: {
          include: {
            mainDishDetail: true,
          },
        },
        pickASnackCorner: {
          include: {
            pickASnackCorner: true,
          },
        },
        addOns: {
          include: {
            cateringAddOnDetail: true,
          },
        },
      },
    });

    const transformedSelection = {
      ...cateringSelection,
      mainDishes: cateringSelection?.mainDishes.map((dish) => ({
        id: dish.mainDishDetail.id,
        name: dish.mainDishDetail.name,
        dishType: dish.mainDishDetail.dishType,
        category: dish.mainDishDetail.category,
        description: dish.mainDishDetail.description,
        status: dish.mainDishDetail.status,
        createdAt: dish.mainDishDetail.createdAt,
        modifiedAt: dish.mainDishDetail.modifiedAt,
      })),
      pickASnackCorner: cateringSelection?.pickASnackCorner.map((snack) => ({
        id: snack.pickASnackCorner.id,
        name: snack.pickASnackCorner.name,
        description: snack.pickASnackCorner.description,
        category: snack.pickASnackCorner.category,
        status: snack.pickASnackCorner.status,
        createdAt: snack.pickASnackCorner.createdAt,
        modifiedAt: snack.pickASnackCorner.modifiedAt,
      })),
      addOns: cateringSelection?.addOns.map((addOn) => ({
        id: addOn.cateringAddOnDetail.id,
        name: addOn.cateringAddOnDetail.name,
        category: addOn.cateringAddOnDetail.category,
        description: addOn.cateringAddOnDetail.description,
        price: addOn.cateringAddOnDetail.price,
        paxCapacity: addOn.cateringAddOnDetail.paxCapacity,
        serviceHours: addOn.cateringAddOnDetail.serviceHours,
        status: addOn.cateringAddOnDetail.status,
        createdAt: addOn.cateringAddOnDetail.createdAt,
        modifiedAt: addOn.cateringAddOnDetail.modifiedAt,
      })),
    };

    if (!cateringSelection) {
      res.status(404);
      throw new Error("Catering selection not found");
    }

    res.json(transformedSelection);
  }),

  createCatering: [
    body("expectedPax")
      .isNumeric()
      .withMessage("Expected pax must be a number"),
    body("totalAmount")
      .isNumeric()
      .withMessage("Total amount must be a number"),
    body("numberOfMainDishes")
      .isNumeric()
      .withMessage("Number of main dishes must be a number"),
    body("packageId")
      .isString()
      .notEmpty()
      .withMessage("Package ID is required and must be a string"),
    body("eventId")
      .isString()
      .notEmpty()
      .withMessage("Event ID is required and must be a string"),
    body("mainDishes")
      .isArray()
      .withMessage("Main dishes must be an array of dish IDs"),
    body("pickASnackCorner")
      .isArray()
      .withMessage("Pick-a-snack corner must be an array of snack IDs"),
    body("addOns")
      .isArray()
      .withMessage("Add-ons must be an array of add-on IDs"),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        throw new Error("Invalid data");
      }

      const {
        expectedPax,
        totalAmount,
        numberOfMainDishes,
        packageId,
        mainDishes,
        pickASnackCorner,
        addOns,
        eventId,
      } = req.body;

      const cateringSelection = await prisma.cateringSelection.create({
        data: {
          expectedPax,
          totalAmount,
          numberOfMainDishes,
          packageId,
          eventId,
          mainDishes: {
            create: mainDishes.map((dishId: string) => ({
              mainDishDetailId: dishId,
            })),
          },
          pickASnackCorner: {
            create: pickASnackCorner.map((snackId: string) => ({
              pickASnackCornerId: snackId,
            })),
          },
          addOns: {
            create: addOns.map((addOnId: string) => ({
              addOnDetailId: addOnId,
            })),
          },
        },
        include: {
          mainDishPackage: true,
          mainDishes: true,
          pickASnackCorner: true,
          addOns: true,
        },
      });

      res.status(201).json(cateringSelection);
    }),
  ],

  updateCatering: [
    body("expectedPax")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Expected pax must be a positive integer"),
    body("totalAmount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Total amount must be a positive number"),
    body("numberOfMainDishes")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Number of main dishes must be a positive integer"),
    body("mainDishes")
      .optional()
      .isArray()
      .withMessage("Main dishes must be an array of dish IDs"),
    body("pickASnackCorner")
      .optional()
      .isArray()
      .withMessage("Pick-a-snack corner must be an array of snack IDs"),
    body("addOns")
      .optional()
      .isArray()
      .withMessage("Add-ons must be an array of add-on IDs"),

    asyncHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: "Invalid input data. Please fix the issues and try again.",
        });
      }

      const { id } = req.params; // Catering ID from URL
      const updateData = req.body;

      const existingCatering = await prisma.cateringSelection.findUnique({
        where: { id },
      });

      if (!existingCatering) {
        res.status(404);
        throw new Error("Catering selection not found");
      }

      const updatedCatering = await prisma.cateringSelection.update({
        where: { id },
        data: updateData,
        include: {
          mainDishPackage: true,
          mainDishes: true,
          pickASnackCorner: true,
          addOns: true,
        },
      });

      res.status(200).json(updatedCatering);
    }),
  ],

  deleteCatering: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // Catering ID from URL

    const existingCatering = await prisma.cateringSelection.findUnique({
      where: { id },
    });

    if (!existingCatering) {
      res.status(404);
      throw new Error("Catering selection not found");
    }

    await prisma.cateringSelection.delete({
      where: { id },
    });

    res
      .status(204)
      .json({ message: "Catering selection deleted successfully" });
  }),
};

export default cateringController;
