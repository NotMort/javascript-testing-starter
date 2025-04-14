import {
    getCoupons,
    calculateDiscount,
    validateUserInput,
    isPriceInRange,
    isValidUsername,
    canDrive,
    fetchData,
    Stack,
    createProduct,
    isStrongPassword,
  } from '../src/core' 
  
  import { describe, it, expect, beforeEach } from 'vitest'
  
  describe('getCoupons', () => {
    it('should return correct coupons', () => {
      expect(getCoupons()).toEqual([
        { code: 'SAVE20NOW', discount: 0.2 },
        { code: 'DISCOUNT50OFF', discount: 0.5 },
      ])
    })
  })
  
  describe('calculateDiscount', () => {
    it('should calculate discount correctly', () => {
      expect(calculateDiscount(100, 'SAVE10')).toBe(90)
      expect(calculateDiscount(100, 'SAVE20')).toBe(80)
    })
  
    it('should handle invalid price', () => {
      expect(calculateDiscount(-5, 'SAVE10')).toBe('Invalid price')
      expect(calculateDiscount('abc', 'SAVE10')).toBe('Invalid price')
    })
  
    it('should handle invalid discount code', () => {
      expect(calculateDiscount(100, 123)).toBe('Invalid discount code')
    })
  })
  
  describe('validateUserInput', () => {
    it('should validate correct input', () => {
      expect(validateUserInput('JohnDoe', 25)).toBe('Validation successful')
    })
  
    it('should return errors for invalid input', () => {
      expect(validateUserInput('Jo', 17)).toBe('Invalid username, Invalid age')
      expect(validateUserInput(123, 'abc')).toBe('Invalid username, Invalid age')
    })
  })
  
  describe('isPriceInRange', () => {
    it('should return true if price is in range', () => {
      expect(isPriceInRange(50, 10, 100)).toBe(true)
    })
  
    it('should return false if price is out of range', () => {
      expect(isPriceInRange(5, 10, 100)).toBe(false)
    })
  })
  
  describe('isValidUsername', () => {
    it('should validate username length', () => {
      expect(isValidUsername('MartinGruber')).toBe(true)
      expect(isValidUsername('abc')).toBe(false)
      expect(isValidUsername('averylongusernamethatisinvalid')).toBe(false)
    })
  })
  
  describe('canDrive', () => {
    it('should validate driving age', () => {
      expect(canDrive(18, 'US')).toBe(true)
      expect(canDrive(15, 'US')).toBe(false)
      expect(canDrive(17, 'UK')).toBe(true)
    })
  
    it('should handle invalid country code', () => {
      expect(canDrive(18, 'DE')).toBe('Invalid country code')
    })
  })
  
  describe('fetchData', () => {
    it('should fetch data asynchronously', async () => {
      const data = await fetchData()
      expect(data).toEqual([1, 2, 3])
    })
  })
  
  describe('Stack', () => {
    let stack
  
    beforeEach(() => {
      stack = new Stack()
    })
  
    it('should push and pop items', () => {
      stack.push(1)
      stack.push(2)
      expect(stack.pop()).toBe(2)
      expect(stack.pop()).toBe(1)
    })
  
    it('should peek at the top item', () => {
      stack.push('item')
      expect(stack.peek()).toBe('item')
    })
  
    it('should throw error when popping empty stack', () => {
      expect(() => stack.pop()).toThrow('Stack is empty')
    })
  
    it('should clear the stack', () => {
      stack.push(1)
      stack.clear()
      expect(stack.isEmpty()).toBe(true)
    })
  })
  
  describe('createProduct', () => {
    it('should create valid product', () => {
      expect(createProduct({ name: 'Laptop', price: 1000 })).toEqual({
        success: true,
        message: 'Product was successfully published',
      })
    })
  
    it('should handle missing name', () => {
      expect(createProduct({ price: 1000 })).toEqual({
        success: false,
        error: { code: 'invalid_name', message: 'Name is missing' },
      })
    })
  
    it('should handle invalid price', () => {
      expect(createProduct({ name: 'Laptop', price: 0 })).toEqual({
        success: false,
        error: { code: 'invalid_price', message: 'Price is missing' },
      })
    })
  })
  
  describe('isStrongPassword', () => {
    it('should validate strong password', () => {
      expect(isStrongPassword('StrongP4ssword')).toBe(true)
    })
  
    it('should reject weak passwords', () => {
      expect(isStrongPassword('short')).toBe(false)
      expect(isStrongPassword('nouppercase1')).toBe(false)
      expect(isStrongPassword('NOLOWERCASE1')).toBe(false)
      expect(isStrongPassword('NoNumber')).toBe(false)
    })
  })
  