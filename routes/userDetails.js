import express from "express";
import {
  submitDetails,
  getDetails,
  getBuddies,
  getBuddyById,
  updateDetails,
} from "../controllers/userDetails.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/submit-details", verifyToken, submitDetails);

router.patch("/submit-details/:id", verifyToken, updateDetails);

router.get("/get-details", verifyToken, getDetails);

router.get("/get-buddies", verifyToken, getBuddies);

/////////////////////
// Get User By Id
/////////////////////

router.get("/:buddyId", verifyToken, getBuddyById);

export default router;
