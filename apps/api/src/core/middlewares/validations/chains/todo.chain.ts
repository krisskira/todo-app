import { body, param, query } from 'express-validator'

export const TodoPostValidationsChain = [
  body('title').isLength({ min: 2, max: 30 }).withMessage('title_too_short').withMessage('title_too_long'),
  body('description')
    .notEmpty()
    .withMessage('description_required')
    .isLength({ min: 2, max: 255 })
    .withMessage('description_out_of_range')
]

export const TodoPatchValidationsChain = [
  param('uuid').isUUID().withMessage('uuid_not_valid'),
  body('title').optional().isLength({ min: 2, max: 30 }).withMessage('title_too_short').withMessage('title_too_long'),
  body('description').optional().isLength({ min: 2, max: 255 }).withMessage('description_out_of_range'),
  body('completed').optional().isBoolean().withMessage('completed_not_boolean')
]

export const TodoGetValidationsChain = [param('uuid').isUUID().withMessage('uuid_not_valid')]

export const TodoFilterValidationsChain = [
  query('query').optional().isString().withMessage('query_not_valid'),
  query('completed').optional().isBoolean().withMessage('completed_not_boolean'),
  query('sort')
    .optional()
    .isString()
    .isIn(['createdAt_desc', 'createdAt_asc', 'title_desc', 'title_asc', 'completed_desc', 'completed_asc'])
    .withMessage('sort_not_valid'),
  query('offset').optional().isInt({ min: 0 }).withMessage('offset_not_valid'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit_not_valid')
]

export const TodoDeleteValidationsChain = [param('uuid').isUUID().withMessage('uuid_not_valid')]
