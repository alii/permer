export class Permer<T extends string, UseBigInts extends boolean = false> {
	private readonly map: Record<T, UseBigInts extends true ? bigint : number>;
	private readonly useBigints: UseBigInts;

	/**
	 * Constructs a new instance of Permer
	 * @param flags - An array of available flags
	 */
	constructor(flags: T[], useBigints: UseBigInts = false as UseBigInts) {
		this.useBigints = useBigints;

		this.map = flags.reduce((all, key, index) => {
			const representation = useBigints ? 2n ** BigInt(index) : 2 ** index;

			return {
				...all,
				[key]: representation,
			};
		}, {} as Record<T, UseBigInts extends true ? bigint : number>);
	}

	/**
	 * Gets the binary representation of a given flag
	 * @param flag
	 */
	get(flag: T): UseBigInts extends true ? bigint : number {
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
	test(
		value: UseBigInts extends true ? bigint : number,
		flag: T | (UseBigInts extends true ? bigint : number),
	): boolean {
		if (this.useBigints) {
			return !!(
				value & (typeof flag === 'bigint' ? flag : this.get(flag as T))
			);
		}

		return !!(value & (typeof flag === 'number' ? flag : this.get(flag as T)));
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
	calculate(flags: T[]): UseBigInts extends true ? bigint : number {
		const result = flags.reduce(
			// `as number` below is a bit of a hack because the values will be either bigints or numbers
			// at runtime, but the type system doesn't know that.
			(all, flag) => (this.get(flag) as number) | (all as number),
			this.useBigints ? 0n : 0,
		);

		return result as UseBigInts extends true ? bigint : number;
	}

	/**
	 * Adds new flags to an integer
	 * @param current - The current integer
	 * @param newValues - The new values to add
	 */
	add(
		current: UseBigInts extends true ? bigint : number,
		newValues: T[],
	): UseBigInts extends true ? bigint : number {
		const oldList = this.list(current);
		return this.calculate([...oldList, ...newValues]);
	}

	/**
	 * Removes flags from an integer
	 * @param current - The current integer
	 * @param removeValues - The values to remove
	 */
	subtract(
		current: UseBigInts extends true ? bigint : number,
		removeValues: T[],
	): UseBigInts extends true ? bigint : number {
		const oldList = this.list(current);
		return this.calculate(oldList.filter(it => !removeValues.includes(it)));
	}

	/**
	 * Converts an integer back into a list of flags.
	 * @param value
	 */
	list(value: UseBigInts extends true ? bigint : number): T[] {
		return this.keys().filter(key => this.test(value, key));
	}
}
