import { describe, expect, it } from 'vitest'
import { formatDate } from '../../src/utils/formatDate'

describe('formatDate', () => {
  it('deve formatar a data para o padrão brasileiro', () => {
    expect(formatDate('2026-09-03')).toBe('03/09/2026')
  })
})
