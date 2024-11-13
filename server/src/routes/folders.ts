import express from 'express';
import { 
  get,
  store,
  update,
  destroy
} from "../controllers/folders.js";
import { Validator } from "../middleware/index.js";
import { getSchema, storeSchema } from "../validation/folders.js";

const router = express.Router();
router.get("/", Validator(getSchema), get);
router.post("/", Validator(storeSchema), store);
router.put("/:id", Validator(storeSchema), update);
router.delete("/:id", destroy);


export default router;