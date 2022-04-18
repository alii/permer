/**
 * The main class to instantiate Permer.
 */
export class Permer<T extends string> {
	private readonly map: Record<T, bigint>;

	/**
	 * Constructs a new instance of Permer
	 * @param flags - An array of available flags
	 */
	constructor(flags: T[]) {
		this.map = flags.reduce((all, key, index) => {
			const representation = 2n ** BigInt(index);

			return {
				...all,
				[key]: representation,
			};
		}, {} as Record<T, bigint>);
	}

	/**
	 * Gets the binary representation of a given flag
	 * @param flag
	 */
	get(flag: T): bigint {
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
	values(): bigint[] {
		return Object.values(this.map);
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
	test(value: bigint, flag: T | bigint): boolean {
		return !!(value & (typeof flag === 'bigint' ? flag : this.get(flag)));
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
	calculate(flags: T[]): bigint {
		return flags.reduce((all, flag) => this.get(flag) | all, 0n);
	}

	/**
	 * Adds new flags to an integer
	 * @param current - The current integer
	 * @param newValues - The new values to add
	 */
	add(current: bigint, newValues: T[]): bigint {
		const oldList = this.list(current);
		return this.calculate([...oldList, ...newValues]);
	}

	/**
	 * Removes flags from an integer
	 * @param current - The current integer
	 * @param removeValues - The values to remove
	 */
	subtract(current: bigint, removeValues: T[]): bigint {
		const oldList = this.list(current);
		return this.calculate(oldList.filter(it => !removeValues.includes(it)));
	}

	/**
	 * Converts an integer back into a list of flags.
	 * @param value
	 */
	list(value: bigint): T[] {
		return this.keys().filter(key => this.test(value, key));
	}
}
