import { Router } from "express";
import * as WishlistController from "./wishlist.controller.js";
import { wishlistSchema } from "./wishlist.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";

const router = Router();


// Add course to wishlist
router.post(
 "/:courseId",
  auth(),
  validation(wishlistSchema),
  WishlistController.addToWishlist
);


// Get all wishlist courses for logged-in user
router.get("/",auth(), WishlistController.getWishlist);

// Remove course from wishlist
router.delete(
  "/:courseId",
   auth(),
  validation(wishlistSchema.params),
  WishlistController.removeFromWishlist
);

export default router;
