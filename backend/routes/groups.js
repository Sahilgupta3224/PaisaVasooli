import express from "express";
import { creategroup,joingroup,getgroups,getmembers,splitBill, markPaid, markApproved} from "../controllers/groups.js";

const router = express.Router();
router.post("/creategroup",creategroup)
router.post("/joingroup",joingroup)
router.get("/getgroups/:id",getgroups)
router.get("/getmembers/:id",getmembers)
router.post("/splitbill",splitBill)
router.put("/markpaid/:id",markPaid)
router.put("/markapproved/:id",markApproved)



export default router;