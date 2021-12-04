import { test } from "uvu";
import { Permer } from "../src";
import * as assert from "uvu/assert";

const instance = new Permer(["create", "read", "update", "delete"]);

const user1 = instance.calculate(["create", "read"]);
const user2 = instance.calculate(["read", "update"]);
const user3 = instance.calculate(["update", "delete"]);

test("Calculations", () => {
	assert.is(user1, 3);
	assert.is(user2, 6);
	assert.is(user3, 12);
});

test("Additions", () => {
	const added = instance.add(user1, ["delete"]);
	const actual = instance.calculate(["create", "read", "delete"]);
	assert.is(added, actual);
});

test("Subtractions", () => {
	const subtracted = instance.subtract(user1, ["read"]);
	const actual = instance.calculate(["create"]);
	assert.is(subtracted, actual);
});

test("Keys are correct", () => {
	const keys = instance.keys();
	assert.is(keys.length, 4);
	assert.equal(keys, ["create", "read", "update", "delete"]);
});

test("Tests", () => {
	const user1CanRead = instance.test(user1, "read");
	const user1CanDelete = instance.test(user1, "delete");

	assert.is(user1CanRead, true);
	assert.is(user1CanDelete, false);
});

test.run();
