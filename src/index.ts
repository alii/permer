import {deprecate} from "./deprecate";

/**
 * The main class to instantiate Permer.
 */
export class Permer<T extends string> {
  private readonly map: Record<T, number>;

  /**
   * Constructs a new instance of Permer
   * @param flags - An array of available flags
   */
  constructor(flags: T[]) {
    this.map = flags.reduce((all, key, index) => {
      const representation = 2 ** index;

      return {
        ...all,
        [key]: representation,
      };
    }, {} as Record<T, number>);
  }

  /**
   * Gets the binary representation of a given flag
   * @param flag
   */
  get(flag: T): number {
    return this.map[flag];
  }

  /**
   * Get a list of all flags
   */
  keys(): T[] {
    return Object.keys(this.map) as T[];
  }

  /**
   * Gets an array of the binary representation of each flag
   */
  values(): number[] {
    return Object.values(this.map);
  }

  /**
   * Tests the given flag against an integer. This method is deprecated, please use Permer#test
   * @deprecated
   * @param value
   * @param flag
   * @example
   * const user = await findUser();
   * // Note, hasPermission is deprecated. Please use Permer#test instead
   * const canCreateBlogPost = permerInstance.hasPermission(user.permissions, "create_blog_post");
   *
   * if (!canCreateBlogPost) {
   *   throw new Error("You do not have permission to create a blog post.);
   * }
   */
  @deprecate("test")
  hasPermission(value: number, flag: T | number): boolean {
    return this.test(value, flag);
  }

  /**
   * Tests the given flag against an integer.
   * @param value
   * @param flag
   * @example
   * const user = await findUser();
   * const canCreateBlogPost = permerInstance.test(user.permissions, "create_blog_post");
   *
   * if (!canCreateBlogPost) {
   *   throw new Error("You do not have permission to create a blog post.);
   * }
   */
  test(value: number, flag: T | number): boolean {
    return !!(value & (typeof flag === "number" ? flag : this.get(flag)));
  }

  /**
   * Calculate an array of permissions based upon. This method is deprecated, please use Permer#calculate
   * @deprecated
   * @param flags - An array of flags to convert to a single integer
   */
  @deprecate("calculate")
  toPermissionsInteger(flags: T[]): number {
    return this.calculate(flags);
  }

  /**
   * Calculate an array of permissions based upon.
   * @param flags - An array of permissions to convert to a single integer
   * @example
   * // Give this user the abilities to create and delete blog posts
   * await updateUser({
   *   permissions: permerInstance.calculate(["create_blog_post", "delete_blog_post"]);
   * })
   */
  calculate(flags: T[]): number {
    return flags.reduce((all, flag) => this.get(flag) | all, 0);
  }

  /**
   * Adds new flags to an integer
   * @param current - The current integer
   * @param newValues - The new values to add
   */
  add(current: number, newValues: T[]): number {
    const oldList = this.toPermissionList(current);
    return this.calculate([...oldList, ...newValues]);
  }

  /**
   * Converts an integer back into a list of flags. This method is deprecated, please use Permer#list
   * @deprecated
   * @param value
   */
  @deprecate("list")
  toPermissionList(value: number): T[] {
    return this.list(value);
  }

  /**
   * Converts an integer back into a list of flags.
   * @param value
   */
  list(value: number): T[] {
    return this.keys().filter((key) => this.test(value, key));
  }
}
