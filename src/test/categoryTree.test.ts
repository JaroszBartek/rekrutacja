import test from 'ava';

import { CORRECT } from '../correctResult';
import { Category, getCategories } from '../mockedApi';
import { categoryTree } from '../task';

test('categoryTree should transform and sort categories properly', async (t) => {
  const result = await categoryTree(getCategories);
  t.deepEqual(result, CORRECT);
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

test('categoryTree should handle nested categories', async (t) => {
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Parent',
      Title: '1#Parent',
      MetaTagDescription: 'parent-image',
      children: [
        {
          id: 2,
          name: 'Child',
          Title: '1#Child',
          MetaTagDescription: 'child-image',
          children: [],
          hasChildren: false,
          url: 'child-url',
        },
      ],
      hasChildren: true,
      url: 'parent-url',
    },
  ];

  const getCategories = async () => ({ data: mockCategories });
  const result = await categoryTree(getCategories);

  t.is(result.length, 1);
  t.is(result[0].children.length, 1);
  t.is(result[0].children[0].name, 'Child');
});

test('categoryTree should handle API errors gracefully', async (t) => {
  const getCategories = async () => {
    throw new Error('API Error');
  };
  const result = await categoryTree(getCategories);
  t.deepEqual(result, []);
});

test('categoryTree should return empty array for empty categories array', async (t) => {
  const getCategories = async () => ({ data: [] });
  const result = await categoryTree(getCategories);
  t.deepEqual(result, []);
});
