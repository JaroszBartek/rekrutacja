import test from 'ava';

import { tryParseOrderFromCategoryTitle } from '../task';

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
