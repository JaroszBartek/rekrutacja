import test from 'ava';

import { Category } from '../mockedApi';
import { mapCategoryToCategoryListElement } from '../task';

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
