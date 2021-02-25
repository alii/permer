# Permer

### A basic abstraction for handling flags and permissions using bitwise

#### Install

`yarn add permer` or, with npm `npm i --save permer`

#### Example

```ts
import { Permer } from "permer";

const permer = new Permer(["read", "write", "admin", "owner", "staff"]);

const user = {
  permissions: permer.calculate(["read", "write", "admin"]),
  username: "alii",
};

// Get individual permissions
const isAdmin = permer.test(user.permissions, "admin");
const isOwner = permer.test(user.permissions, "owner");
const isStaff = permer.test(user.permissions, "staff");
const canRead = permer.test(user.permissions, "read");
const canWrite = permer.test(user.permissions, "write");

console.log(`${user.username}'s permissions:`, {
  isAdmin,
  isOwner,
  isStaff,
  canRead,
  canWrite,
});

// Get an array of all permissions
const availablePermissions = permer.list(user.permissions).join(", ");
console.log(`${user.username}'s permission list:`, availablePermissions);
```
