import { HandleError } from '@api/core/error/handleError'
import { PaginationInfo } from 'todo-types'

export default function PaginationService(totals: number, limit: number, offset: number): PaginationInfo {
  if (totals < 0 || limit <= 0 || offset < 0) {
    throw new HandleError('invalid_pagination_params', { totals, limit, offset })
  }

  // Corrección para el caso en que totals es 0
  if (totals === 0) {
    return {
      total: 0,
      hasNext: false,
      hasPrevious: false,
      nextOffset: 0,
      previousOffset: 0,
      nextLimit: 0,
      previousLimit: 0
    }
  }

  const hasNext = offset + limit < totals
  const hasPrevious = offset > 0

  const nextOffset = hasNext ? Math.min(offset + limit, totals) : offset
  const previousOffset = hasPrevious ? Math.max(offset - limit, 0) : offset

  const nextLimit = hasNext ? Math.min(limit, totals - nextOffset) : 0
  const previousLimit = hasPrevious ? Math.min(limit, offset) : 0

  return {
    total: totals,
    hasNext,
    hasPrevious,
    nextOffset,
    previousOffset,
    nextLimit,
    previousLimit
  }
}
