import {describe,test,it,expect} from "vitest"
import { fizzBuzz, max } from "../src/intro"

describe ('max',()=>{
    it('should returne the first arugment if it is greater',()=>{
        //AAA
        //arange
        const a =2
        const b =1
        //act
        const result=max(a,b)
        //assert
        expect(result).toBe(2)
    })
    it('should returne the second arugment if it is greater',()=>{
        expect(max(1,2)).toBe(2)
    })
    it('should returne the first arugment if arguments are equal',()=>{
        expect(max(2,2)).toBe(2)
    })
})

describe('fizzBuzz',()=>{
    it('should return fizzBuzz if arg is divisible by 3 and 5',()=>{
        expect(fizzBuzz(15)).toBe('FizzBuzz')
    })
    it('should return fizz if arg is divisible by 3',()=>{
        expect(fizzBuzz(3)).toBe('Fizz')
    })
    it('should return Buzz if arg is divisible by 5',()=>{
        expect(fizzBuzz(5)).toBe('Buzz')
    })
    it('should return 1 if arg is not divisible by 5  and 3',()=>{
        expect(fizzBuzz(1)).toBe('1')
    })
})