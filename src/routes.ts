import { Router } from "express";
import multer from 'multer'
import uploadConfig from './config/multer'
import { CreateUserController } from "./controllers/user/CreateUserController";
import { createUserSchema, authUserSchema } from "./schemas/userSchema";
import { validateSchema } from "./middlewares/validateSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoriesController } from "./controllers/category/ListCategoriesController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/categorySchema";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductsController } from "./controllers/product/ListProductsController";
import { createProductSchema } from "./schemas/productSchema";
import { DeleteProductController } from "./controllers/product/DeleteProductController";



const router = Router();
const upload = multer(uploadConfig)

router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle)
router.get("/category", isAuthenticated, new ListCategoriesController().handle)
router.post("/category", isAuthenticated, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle)
router.get("/products", isAuthenticated, new ListProductsController().handle)
router.post("/product", isAuthenticated, isAdmin, upload.single('file'), new CreateProductController().handle, validateSchema(createProductSchema))
router.delete("/product", isAuthenticated, isAdmin, new DeleteProductController().handle)
export { router };