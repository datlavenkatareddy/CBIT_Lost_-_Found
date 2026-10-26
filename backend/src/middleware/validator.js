import { z } from 'zod';

const CATEGORIES = ['Electronics', 'Documents', 'Books', 'Accessories', 'Others'];
const TYPES = ['lost', 'found'];
const STATUSES = ['active', 'resolved'];

// Indian phone regex: 10 digits starting with 6, 7, 8, or 9
const PHONE_REGEX = /^[6-9]\d{9}$/;
// Standard email regex matching frontend ReportItem.jsx
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Date regex YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validation schema for creating a report.
 */
export const createItemSchema = z
  .object({
    type: z.enum(TYPES, {
      errorMap: () => ({ message: "Type must be either 'lost' or 'found'." })
    }),
    itemName: z
      .string({ required_error: 'Item name is required.' })
      .trim()
      .min(1, 'Item name cannot be empty.')
      .max(255, 'Item name cannot exceed 255 characters.'),
    category: z.enum(CATEGORIES, {
      errorMap: () => ({
        message: `Category must be one of: ${CATEGORIES.join(', ')}.`
      })
    }),
    description: z
      .string({ required_error: 'Description is required.' })
      .trim()
      .min(1, 'Description cannot be empty.')
      .max(2000, 'Description cannot exceed 2000 characters.'),
    location: z
      .string({ required_error: 'Location is required.' })
      .trim()
      .min(1, 'Location cannot be empty.')
      .max(255, 'Location cannot exceed 255 characters.'),
    date: z
      .string({ required_error: 'Date is required.' })
      .regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format.'),
    reportedBy: z
      .string({ required_error: 'Your name is required.' })
      .trim()
      .min(1, 'Your name cannot be empty.')
      .max(255, 'Reporter name cannot exceed 255 characters.'),
    rollNo: z.string().trim().optional().default(''),
    contact: z
      .string({ required_error: 'Contact number is required.' })
      .trim()
      .regex(PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number (starts with 6-9).'),
    email: z
      .string({ required_error: 'Email is required.' })
      .trim()
      .regex(EMAIL_REGEX, 'Enter a valid email address.'),
    image: z.string().trim().optional().default(''),
    status: z.enum(STATUSES).optional().default('active')
  })
  .superRefine((data, ctx) => {
    if (data.type === 'lost' && (!data.rollNo || data.rollNo.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['rollNo'],
        message: 'Roll number is required for lost item reports.'
      });
    }
  });

/**
 * Validation schema for updating an existing item.
 */
export const updateItemSchema = z
  .object({
    type: z.enum(TYPES).optional(),
    itemName: z.string().trim().min(1).max(255).optional(),
    category: z.enum(CATEGORIES).optional(),
    description: z.string().trim().min(1).max(2000).optional(),
    location: z.string().trim().min(1).max(255).optional(),
    date: z.string().regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format.').optional(),
    reportedBy: z.string().trim().min(1).max(255).optional(),
    rollNo: z.string().trim().optional(),
    contact: z.string().trim().regex(PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number.').optional(),
    email: z.string().trim().regex(EMAIL_REGEX, 'Enter a valid email address.').optional(),
    image: z.string().trim().optional(),
    status: z.enum(STATUSES).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Request body must contain at least one field to update.'
  });

/**
 * Validation schema for item ID route parameter.
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Item ID must be a positive integer.')
    .transform((val) => parseInt(val, 10))
});

/**
 * Validation schema for item search/filter query parameters.
 */
export const itemQuerySchema = z.object({
  type: z.enum(['lost', 'found']).optional(),
  category: z.string().optional(),
  status: z.enum(['active', 'resolved', 'all']).optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['date', 'created_at', 'item_name', 'itemName', 'id']).optional().default('date'),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional().default('desc')
});

/**
 * Generic middleware to validate request body, query, or params with a Zod schema.
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
