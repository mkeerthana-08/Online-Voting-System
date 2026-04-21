const express = require("express");

const { castVote, getVotes, getVoteCount, getMyVoteStatus } = require("../controllers/voteController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, allowRoles("user"), castVote);
router.get("/me/status", authMiddleware, allowRoles("user"), getMyVoteStatus);
router.get("/", authMiddleware, allowRoles("admin"), getVotes);
router.get("/count", authMiddleware, allowRoles("admin"), getVoteCount);

module.exports = router;
