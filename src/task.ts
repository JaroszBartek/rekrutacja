import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

type Nullable<T> = T | null;

export const tryConvertStringToNumber = (value: string): Nullable<number> => {
  const number = parseInt(value, 10);
  return !Number.isNaN(number) ? number : null;
};

export const tryParseOrderFromCategoryTitle = (
  title: string
): Nullable<number> => {
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

export const applyShowOnHomeRules = (
  categories: CategoryListElement[]
): CategoryListElement[] => {
  if (categories.length <= 5) {
    return categories.map((x) => ({ ...x, showOnHome: true }));
  }

  if (categories.some((x) => x.showOnHome)) {
    return categories;
  }

  return categories.map((x, i) => ({ ...x, showOnHome: i < 3 }));
};

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();
  const categories = res?.data;

  if (!categories) {
    return [];
  }

  const sortedCategoryTree = sortByOrder(
    categories.map((x) => mapCategoryToCategoryListElement(x, true))
  );

  return applyShowOnHomeRules(sortedCategoryTree);
};
