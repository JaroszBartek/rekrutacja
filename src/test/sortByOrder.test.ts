import test from 'ava';

import { CategoryListElement, sortByOrder } from '../task';

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
