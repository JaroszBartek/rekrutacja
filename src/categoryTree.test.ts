import test from 'ava';

import { INCORRECT } from './currentResult';
import { getCategories } from './mockedApi';
import { categoryTree } from './task';

test('categoryTree should transform and sort categories properly', async (t) => {
  const result = await categoryTree(getCategories);
  t.deepEqual(result, INCORRECT);
});

test('categoryTree should return empty array if getCategories returns empty data', async (t) => {
  const getCategories = async () => ({ data: null });
  const result = await categoryTree(getCategories);
  t.deepEqual(result, []);
});

test('categoryTree should return empty array if getCategories returns undefined', async (t) => {
  const getCategories = async () => undefined;
  const result = await categoryTree(getCategories);
  t.deepEqual(result, []);
});
