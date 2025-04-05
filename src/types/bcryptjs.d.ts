
declare module 'bcryptjs' {
  /**
   * Synchronously generates a hash for the given string.
   * @param s The string to hash.
   * @param salt The salt length to generate or the salt to use.
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Synchronously compares the given data against the given hash.
   * @param s The string to compare.
   * @param hash The hash to compare to.
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Generates a salt with the specified number of rounds.
   * @param rounds The number of rounds to use. Default 10.
   * @param callback A callback to be fired once the salt has been generated.
   */
  export function genSalt(rounds?: number, callback?: (err: Error, salt: string) => void): Promise<string>;

  /**
   * Generates a salt synchronously with the specified number of rounds.
   * @param rounds The number of rounds to use. Default 10.
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Hashes the given string.
   * @param s The string to hash.
   * @param salt The salt to use when hashing.
   * @param callback A callback to be fired once the hash has been generated.
   */
  export function hash(s: string, salt: string | number, callback?: (err: Error, hash: string) => void): Promise<string>;
}
