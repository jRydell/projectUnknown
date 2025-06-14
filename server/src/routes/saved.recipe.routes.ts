import { Router } from "express";
import * as savedRecipeController from "../controllers/saved-recipe.controller";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  deleteRecipeSchema,
  savedRecipeSchema,
} from "../validation/saved-recipe.validation";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Save a recipe to user's collection
router.post(
  "/",
  validate(savedRecipeSchema, "body"),
  savedRecipeController.saveRecipe
);

// Get all saved recipes for the logged-in user
router.get("/", savedRecipeController.getSavedRecipes);

// Remove a recipe from user's collection
router.delete(
  "/:mealId",
  validate(deleteRecipeSchema, "params"),
  savedRecipeController.deleteSavedRecipe
);

export default router;
