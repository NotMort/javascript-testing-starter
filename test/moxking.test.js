import {
    getPriceInCurrency,
    getShippingInfo,
    renderPage,
    submitOrder,
    signUp,
    login,
    isOnline,
    getDiscount,
  } from '../src/mocking'
  
  import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
  
  
  vi.mock('../src/libs/analytics', () => ({
    trackPageView: vi.fn(),
  }))
  
  vi.mock('../src/libs/currency', () => ({
    getExchangeRate: vi.fn(() => 0.9), 
  }))
  
  vi.mock('../src/libs/email', () => ({
    isValidEmail: vi.fn(() => true),
    sendEmail: vi.fn(),
  }))
  
  vi.mock('../src/libs/payment', () => ({
    charge: vi.fn(),
  }))
  
  vi.mock('../src/libs/security', () => ({
    default: {
      generateCode: vi.fn(() => 123456),
    },
  }))
  
  vi.mock('../src/libs/shipping', () => ({
    getShippingQuote: vi.fn(() => ({ cost: 15, estimatedDays: 5 })),
  }))
  
  import { trackPageView } from '../src/libs/analytics'
  import { getExchangeRate } from '../src/libs/currency'
  import { isValidEmail, sendEmail } from '../src/libs/email'
  import { charge } from '../src/libs/payment'
  import security from '../src/libs/security'
  import { getShippingQuote } from '../src/libs/shipping'
  
  describe('getPriceInCurrency', () => {
    it('calculates price using exchange rate', () => {
      const result = getPriceInCurrency(100, 'EUR')
      expect(result).toBe(90) 
      expect(getExchangeRate).toHaveBeenCalledWith('USD', 'EUR')
    })
  })
  
  describe('getShippingInfo', () => {
    it('returns formatted shipping quote', () => {
      const result = getShippingInfo('Germany')
      expect(result).toBe('Shipping Cost: $15 (5 Days)')
      expect(getShippingQuote).toHaveBeenCalledWith('Germany')
    })
  
    it('returns unavailable if no quote found', () => {
      getShippingQuote.mockReturnValueOnce(null)
      const result = getShippingInfo('Nowhere')
      expect(result).toBe('Shipping Unavailable')
    })
  })
  
  describe('renderPage', () => {
    it('calls trackPageView and returns page', async () => {
      const result = await renderPage()
      expect(trackPageView).toHaveBeenCalledWith('/home')
      expect(result).toBe('<div>content</div>')
    })
  })
  
  describe('submitOrder', () => {
    it('returns success when payment passes', async () => {
      charge.mockResolvedValueOnce({ status: 'success' })
      const order = { totalAmount: 50 }
      const result = await submitOrder(order, 'card123')
      expect(result).toEqual({ success: true })
    })
  
    it('returns error when payment fails', async () => {
      charge.mockResolvedValueOnce({ status: 'failed' })
      const order = { totalAmount: 50 }
      const result = await submitOrder(order, 'card123')
      expect(result).toEqual({ success: false, error: 'payment_error' })
    })
  })
  
  describe('signUp', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
  
    it('sends email if valid', async () => {
      isValidEmail.mockReturnValueOnce(true)
      const result = await signUp('user@example.com')
      expect(result).toBe(true)
      expect(sendEmail).toHaveBeenCalledWith('user@example.com', 'Welcome aboard!')
    })
  
    it('returns false if email is invalid', async () => {
      isValidEmail.mockReturnValueOnce(false)
      const result = await signUp('bademail')
      expect(result).toBe(false)
      expect(sendEmail).not.toHaveBeenCalled()
    })
  })
  
  
  describe('login', () => {
    it('generates code and sends email', async () => {
      await login('login@example.com')
      expect(security.generateCode).toHaveBeenCalled()
      expect(sendEmail).toHaveBeenCalledWith('login@example.com', '123456')
    })
  })
  
  describe('isOnline', () => {
    const RealDate = Date
  
    afterEach(() => {
      global.Date = RealDate
    })
  
    it('returns true if within working hours', () => {
      global.Date = class extends RealDate {
        constructor() {
          super()
          return new RealDate('2025-04-14T10:00:00Z') 
        }
      }
      expect(isOnline()).toBe(true)
    })
  
    it('returns false if outside working hours', () => {
      global.Date = class extends RealDate {
        constructor() {
          super()
          return new RealDate('2025-04-14T03:00:00Z')
        }
      }
      expect(isOnline()).toBe(false)
    })
  })
  
  describe('getDiscount', () => {
    const RealDate = Date
  
    afterEach(() => {
      global.Date = RealDate
    })
  
    it('returns 0.2 on Christmas', () => {
      global.Date = class extends RealDate {
        constructor() {
          super()
          return new RealDate('2025-12-25T12:00:00Z')
        }
      }
      expect(getDiscount()).toBe(0.2)
    })
  
    it('returns 0 otherwise', () => {
      global.Date = class extends RealDate {
        constructor() {
          super()
          return new RealDate('2025-06-15T12:00:00Z')
        }
      }
      expect(getDiscount()).toBe(0)
    })
  })
  