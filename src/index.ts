export class Permer<T extends string> extends Map<T, number> {
  public readonly permissions: Record<T, number>;

  constructor(permissions: T[]) {
    super();
    this.permissions = permissions.reduce((all, key, index) => {
      const representation = 2 ** index;
      this.set(key, representation);

      return {
        ...all,
        [key]: representation
      }
    }, {} as Record<T, number>);
  }

  hasPermission(value: number, permission: T | number): boolean {
    return !!(value & (typeof permission === "number" ? permission : this.get(permission)));
  }

  toPermissionsInteger(perms: T[]): number {
    return perms.reduce((all, perm) => this.get(perm) | all, 0);
  }
}
