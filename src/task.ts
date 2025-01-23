import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export const tryConvertStringToNumber = (value: string): number | null => {
  const number = parseInt(value, 10);
  return !Number.isNaN(number) ? number : null;
};

export const tryParseOrderFromCategoryTitle = (
  title: string
): number | null => {
  if (!title) {
    return null;
  }

  const [titleWithoutHash] = title.split('#');
  return tryConvertStringToNumber(titleWithoutHash);
};

export const sortByOrder = (
  categoryList: CategoryListElement[]
): CategoryListElement[] => [...categoryList].sort((a, b) => a.order - b.order);

export const mapCategoryToCategoryListElement = (
  category: Category,
  isRootCategory = false
): CategoryListElement => ({
  id: category.id,
  image: category.MetaTagDescription,
  name: category.name,
  order: tryParseOrderFromCategoryTitle(category.Title) ?? category.id,
  children: sortByOrder(
    (category?.children || []).map((x) => mapCategoryToCategoryListElement(x))
  ),
  showOnHome: isRootCategory && !!category.Title?.includes('#'),
});

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();
  const categories = res?.data;

  if (!categories) {
    return [];
  }
  const toShowOnHome: number[] = [];
  const sortedCategoryTree = sortByOrder(
    categories.map((x) => mapCategoryToCategoryListElement(x, true))
  );

  if (sortedCategoryTree.length <= 5) {
    sortedCategoryTree.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    sortedCategoryTree.forEach(
      (x) => (x.showOnHome = toShowOnHome.includes(x.id))
    );
  } else {
    sortedCategoryTree.forEach((x, index) => (x.showOnHome = index < 3));
  }

  return sortedCategoryTree;
};
