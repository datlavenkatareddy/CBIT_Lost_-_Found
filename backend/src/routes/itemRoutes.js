import { Router } from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import {
  validate,
  createItemSchema,
  updateItemSchema,
  idParamSchema,
  itemQuerySchema
} from '../middleware/validator.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/items - Retrieve reports with filtering, search & pagination
router.get('/', validate(itemQuerySchema, 'query'), getItems);

// GET /api/items/:id - Retrieve specific report
router.get('/:id', validate(idParamSchema, 'params'), getItemById);

// POST /api/items - Create a lost or found report
router.post('/', optionalAuth, validate(createItemSchema, 'body'), createItem);

// PATCH /api/items/:id - Update permitted item fields or status
router.patch(
  '/:id',
  optionalAuth,
  validate(idParamSchema, 'params'),
  validate(updateItemSchema, 'body'),
  updateItem
);

// DELETE /api/items/:id - Delete an item report
router.delete('/:id', optionalAuth, validate(idParamSchema, 'params'), deleteItem);

export default router;
