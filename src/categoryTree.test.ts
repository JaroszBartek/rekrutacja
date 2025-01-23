import test from 'ava';

import { INCORRECT } from './currentResult';
import { getCategories } from './mockedApi';
import {
  categoryTree,
  tryConvertStringToNumber,
  tryParseOrderFromCategoryTitle,
} from './task';

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

test('tryConvertStringToNumber should convert valid string to number', (t) => {
  const result = tryConvertStringToNumber('123');
  t.is(result, 123);
});

test('tryConvertStringToNumber should return null for invalid number string', (t) => {
  const result = tryConvertStringToNumber('abc');
  t.is(result, null);
});

test('tryConvertStringToNumber should return null for empty string', (t) => {
  const result = tryConvertStringToNumber('');
  t.is(result, null);
});

test('tryParseOrderFromCategoryTitle should extract number before hash', (t) => {
  const result = tryParseOrderFromCategoryTitle('1#Category');
  t.is(result, 1);
});

test('tryParseOrderFromCategoryTitle should return null for title without number', (t) => {
  const result = tryParseOrderFromCategoryTitle('Category#Test');
  t.is(result, null);
});

test('tryParseOrderFromCategoryTitle should return null for empty title', (t) => {
  const result = tryParseOrderFromCategoryTitle('');
  t.is(result, null);
});

test('tryParseOrderFromCategoryTitle should return null for null title', (t) => {
  const result = tryParseOrderFromCategoryTitle(null);
  t.is(result, null);
});
