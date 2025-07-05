import express from 'express';
import {userAuth} from '../middlewares/userAuth.middleware.js';
import {registerUser,loginUser,logoutUser} from "../controllers/user.controller.js"


export const userRouter = express.Router();
userRouter.post('/signup',registerUser);
userRouter.post('/login',loginUser);

userRouter.post('/logout',userAuth,logoutUser)



