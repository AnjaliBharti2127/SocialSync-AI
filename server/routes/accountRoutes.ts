import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addAccount, getAccounts, disconnectAccount} from '../controllers/accountsControllers.js';

const accountRouter = express.Router();

// accountRouter.use(protect);
accountRouter.get('/', protect, getAccounts);
accountRouter.post('/', protect, addAccount); // Assuming you have a createAccount controller
accountRouter.delete('/:id', protect, disconnectAccount); // Assuming you have a deleteAccount controller

export default accountRouter;