export class Permer<T extends string> {
  private readonly permissions: Record<T, number>;

  constructor(permissions: T[]) {
    this.permissions = permissions.reduce((all, key, index) => {
      const representation = 2 ** index;

      return {
        ...all,
        [key]: representation,
      };
    }, {} as Record<T, number>);
  }

  get(perm: T): number {
    return this.permissions[perm];
  }

  keys() {
    return Object.keys(this.permissions) as T[];
  }

  values(): number[] {
    return Object.values(this.permissions);
  }

  hasPermission(value: number, permission: T | number): boolean {
    return !!(value & (typeof permission === "number" ? permission : this.get(permission)));
  }

  toPermissionsInteger(perms: T[]): number {
    return perms.reduce((all, perm) => this.get(perm) | all, 0);
  }

  toPermissionList(value: number): T[] {
    return this.keys().filter((key) => this.hasPermission(value, key));
  }
}
