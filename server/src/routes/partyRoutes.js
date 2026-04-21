const express = require("express");

const { getParties, addParty, updateParty, deleteParty } = require("../controllers/partyController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getParties);
router.post("/", authMiddleware, allowRoles("admin"), addParty);
router.put("/:partyId", authMiddleware, allowRoles("admin"), updateParty);
router.delete("/:partyId", authMiddleware, allowRoles("admin"), deleteParty);

module.exports = router;
