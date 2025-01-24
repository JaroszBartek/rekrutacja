import test from 'ava';

import { tryConvertStringToNumber } from '../task';

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
