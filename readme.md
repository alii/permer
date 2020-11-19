# Permer

## Very basic bitwise permissions abstraction.

#### Install

`yarn add permer` or, with npm `npm i --save permer`

#### Example

```ts
import { Permer } from 'permer';

const permer = new Permer(["read", "write", "admin", "owner", "staff"]);

const user = {
  permissions: permer.toPermissionsInteger(["read", "write", "admin"]),
  username: 'alii',
};

// Get individual permissions
const isAdmin = permer.hasPermission(user.permissions, "admin");
const isOwner = permer.hasPermission(user.permissions, "owner");
const isStaff = permer.hasPermission(user.permissions, "staff");
const canRead = permer.hasPermission(user.permissions, "read");
const canWrite = permer.hasPermission(user.permissions, "write");

console.log(`${user.username}'s permissions:`, { isAdmin, isOwner, isStaff, canRead, canWrite });

// Get an array of all permissions 
const availablePermissions = permer.toPermissionList(user.permissions);
console.log(`${user.username}'s permission list:`, availablePermissions.join(", "));
```
