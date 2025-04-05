
import 'jest';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue<U = T>(value: U | Promise<U>): this;
      mockResolvedValueOnce<U = T>(value: U | Promise<U>): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
    }

    type MockedFunction<T extends (...args: any[]) => any> = {
      (...args: Parameters<T>): ReturnType<T>;
      mock: MockContext<T>;
    } & Mock<ReturnType<T>, Parameters<T>>;

    interface MockContext<T extends (...args: any[]) => any> {
      calls: Parameters<T>[];
      instances: any[];
      invocationCallOrder: number[];
      results: { type: string; value: any }[];
      lastCall: Parameters<T>;
    }
  }

  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function describe(name: string, fn: () => void): void;
  function expect(value: any): any;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  const setImmediate: (callback: (...args: any[]) => void, ...args: any[]) => NodeJS.Immediate;
}
