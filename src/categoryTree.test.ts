import test from 'ava';

import { CORRECT } from './correctResult';
import { Category, getCategories } from './mockedApi';
import {
  applyShowOnHomeRules,
  CategoryListElement,
  categoryTree,
  mapCategoryToCategoryListElement,
  sortByOrder,
  tryConvertStringToNumber,
  tryParseOrderFromCategoryTitle,
} from './task';

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

test('sortByOrder should sort categories by order property', (t) => {
  const unsortedList: CategoryListElement[] = [
    { id: 1, name: 'A', order: 3, image: '', children: [], showOnHome: false },
    { id: 2, name: 'B', order: 1, image: '', children: [], showOnHome: false },
    { id: 3, name: 'C', order: 2, image: '', children: [], showOnHome: false },
  ];

  const result = sortByOrder(unsortedList);

  t.is(result[0].order, 1);
  t.is(result[1].order, 2);
  t.is(result[2].order, 3);
});

test('sortByOrder should return empty array for empty input', (t) => {
  const result = sortByOrder([]);
  t.deepEqual(result, []);
});

test('sortByOrder should not modify original array', (t) => {
  const originalList: CategoryListElement[] = [
    { id: 1, name: 'A', order: 2, image: '', children: [], showOnHome: false },
    { id: 2, name: 'B', order: 1, image: '', children: [], showOnHome: false },
  ];
  const originalFirstOrder = originalList[0].order;

  sortByOrder(originalList);

  t.is(originalList[0].order, originalFirstOrder);
});

test('mapCategoryToCategoryListElement should map category correctly', (t) => {
  const category: Category = {
    id: 1,
    name: 'Test Category',
    Title: '2#Test',
    MetaTagDescription: 'image-url',
    children: [],
    hasChildren: false,
    url: 'url',
  };

  const result = mapCategoryToCategoryListElement(category, true);

  t.is(result.id, 1);
  t.is(result.name, 'Test Category');
  t.is(result.order, 2);
  t.is(result.image, 'image-url');
  t.true(result.showOnHome);
  t.deepEqual(result.children, []);
});

test('mapCategoryToCategoryListElement should use id as order when Title has no number', (t) => {
  const category: Category = {
    id: 1,
    name: 'Test Category',
    Title: 'No Number',
    MetaTagDescription: 'image-url',
    children: [],
    hasChildren: false,
    url: 'url',
  };

  const result = mapCategoryToCategoryListElement(category);

  t.is(result.order, 1);
});

test('mapCategoryToCategoryListElement should handle nested children', (t) => {
  const category: Category = {
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
        url: 'url',
      },
    ],
    hasChildren: false,
    url: '',
  };

  const result = mapCategoryToCategoryListElement(category);

  t.is(result.children.length, 1);
  t.is(result.children[0].name, 'Child');
  t.is(result.children[0].order, 1);
});

test('mapCategoryToCategoryListElement should handle missing children array', (t) => {
  const category: Category = {
    id: 1,
    name: 'Test',
    Title: '1#Test',
    MetaTagDescription: 'image',
    children: undefined,
    hasChildren: false,
    url: 'url',
  };

  const result = mapCategoryToCategoryListElement(category);

  t.deepEqual(result.children, []);
});

test('mapCategoryToCategoryListElement should set showOnHome false for non-root categories', (t) => {
  const category: Category = {
    id: 1,
    name: 'Test',
    Title: '1#Test',
    MetaTagDescription: 'image',
    children: [],
    hasChildren: false,
    url: 'url',
  };

  const result = mapCategoryToCategoryListElement(category, false);

  t.false(result.showOnHome);
});

test('applyShowOnHomeRules should show all categories when list has 5 or fewer items', (t) => {
  const categories: CategoryListElement[] = [
    { id: 1, name: 'A', order: 1, image: '', children: [], showOnHome: false },
    { id: 2, name: 'B', order: 2, image: '', children: [], showOnHome: false },
    { id: 3, name: 'C', order: 3, image: '', children: [], showOnHome: false },
  ];

  const result = applyShowOnHomeRules(categories);

  t.true(result.every((category) => category.showOnHome));
});

test('applyShowOnHomeRules should preserve existing showOnHome values when any category has showOnHome=true', (t) => {
  const categories: CategoryListElement[] = [
    { id: 1, name: 'A', order: 1, image: '', children: [], showOnHome: true },
    { id: 2, name: 'B', order: 2, image: '', children: [], showOnHome: false },
    { id: 3, name: 'C', order: 3, image: '', children: [], showOnHome: false },
    { id: 4, name: 'D', order: 4, image: '', children: [], showOnHome: true },
    { id: 5, name: 'E', order: 5, image: '', children: [], showOnHome: false },
    { id: 6, name: 'F', order: 6, image: '', children: [], showOnHome: false },
  ];

  const result = applyShowOnHomeRules(categories);

  t.true(result[0].showOnHome);
  t.false(result[1].showOnHome);
  t.false(result[2].showOnHome);
  t.true(result[3].showOnHome);
  t.false(result[4].showOnHome);
  t.false(result[5].showOnHome);
});

test('applyShowOnHomeRules should show first 3 categories when list has more than 5 items and no showOnHome flags', (t) => {
  const categories: CategoryListElement[] = [
    { id: 1, name: 'A', order: 1, image: '', children: [], showOnHome: false },
    { id: 2, name: 'B', order: 2, image: '', children: [], showOnHome: false },
    { id: 3, name: 'C', order: 3, image: '', children: [], showOnHome: false },
    { id: 4, name: 'D', order: 4, image: '', children: [], showOnHome: false },
    { id: 5, name: 'E', order: 5, image: '', children: [], showOnHome: false },
    { id: 6, name: 'F', order: 6, image: '', children: [], showOnHome: false },
  ];

  const result = applyShowOnHomeRules(categories);

  t.true(result[0].showOnHome);
  t.true(result[1].showOnHome);
  t.true(result[2].showOnHome);
  t.false(result[3].showOnHome);
  t.false(result[4].showOnHome);
  t.false(result[5].showOnHome);
});

test('applyShowOnHomeRules should handle empty array', (t) => {
  const result = applyShowOnHomeRules([]);
  t.deepEqual(result, []);
});

test('applyShowOnHomeRules should not modify original array', (t) => {
  const categories: CategoryListElement[] = [
    { id: 1, name: 'A', order: 1, image: '', children: [], showOnHome: false },
    { id: 2, name: 'B', order: 2, image: '', children: [], showOnHome: false },
    { id: 3, name: 'C', order: 3, image: '', children: [], showOnHome: false },
  ];
  const originalShowOnHome = categories[0].showOnHome;

  applyShowOnHomeRules(categories);

  t.is(categories[0].showOnHome, originalShowOnHome);
});
