import test from 'ava';

import { applyShowOnHomeRules, CategoryListElement } from '../task';

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
