// example:
import { Router } from 'express';
import { getLLMResponseController } from '../controllers/controller.js';
// import {
//     createItem,
//     getItems,
//     getItemById,
//     updateItem,
//     deleteItem,
// } from '../controllers/itemController';

const router = Router();

router.post('/llm', getLLMResponseController)

// router.get('/', getItems);
// router.get('/:id', getItemById);
// router.post('/', createItem);
// router.put('/:id', updateItem);
// router.delete('/:id', deleteItem);

export default router;