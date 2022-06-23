import {test} from 'uvu';
import {Permer} from '../src';
import * as assert from 'uvu/assert';

const instanceBigInt = new Permer(['create', 'read', 'update', 'delete'], true);

const instanceNumber = new Permer(
	['create', 'read', 'update', 'delete'],
	false,
);

const [user1BigInt, user1Number] = [
	instanceBigInt.calculate(['create', 'read']),
	instanceNumber.calculate(['create', 'read']),
];

const [user2BigInt, user2Number] = [
	instanceBigInt.calculate(['read', 'update']),
	instanceNumber.calculate(['read', 'update']),
];

const [user3BigInt, user3Number] = [
	instanceBigInt.calculate(['update', 'delete']),
	instanceNumber.calculate(['update', 'delete']),
];

test('Calculations', () => {
	assert.is(user1BigInt, 3n);
	assert.is(user1Number, 3);

	assert.is(user2BigInt, 6n);
	assert.is(user2Number, 6);

	assert.is(user3BigInt, 12n);
	assert.is(user3Number, 12);
});

test('Additions', () => {
	const added = instanceBigInt.add(user1BigInt, ['delete']);
	const actual = instanceBigInt.calculate(['create', 'read', 'delete']);

	assert.is(added, actual);

	const added2 = instanceNumber.add(user1Number, ['delete']);
	const actual2 = instanceNumber.calculate(['create', 'read', 'delete']);

	assert.is(added2, actual2);
});

test('Subtractions', () => {
	const subtracted = instanceBigInt.subtract(user1BigInt, ['read']);
	const actual = instanceBigInt.calculate(['create']);

	assert.is(subtracted, actual);

	const subtracted2 = instanceNumber.subtract(user1Number, ['read']);
	const actual2 = instanceNumber.calculate(['create']);

	assert.is(subtracted2, actual2);
});

test('Keys are correct', () => {
	const keys = instanceBigInt.keys();

	assert.is(keys.length, 4);
	assert.equal(keys, ['create', 'read', 'update', 'delete']);

	const keys2 = instanceNumber.keys();

	assert.is(keys2.length, 4);
	assert.equal(keys2, ['create', 'read', 'update', 'delete']);
});

test('Tests', () => {
	const user1CanRead = instanceBigInt.test(user1BigInt, 'read');
	const user1CanDelete = instanceBigInt.test(user1BigInt, 'delete');

	assert.is(user1CanRead, true);
	assert.is(user1CanDelete, false);

	const user1CanRead2 = instanceNumber.test(user1Number, 'read');
	const user1CanDelete2 = instanceNumber.test(user1Number, 'delete');

	assert.is(user1CanRead2, true);
	assert.is(user1CanDelete2, false);
});

test.run();
