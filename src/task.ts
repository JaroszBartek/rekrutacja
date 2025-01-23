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

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res?.data) {
    return [];
  }

  const toShowOnHome: number[] = [];

  const result = res.data.map((c1) => {
    if (c1.Title && c1.Title.includes('#')) {
      toShowOnHome.push(c1.id);
    }
    const l2Kids = c1.children
      ? c1.children.map((c2) => {
          const l3Kids = c2.children
            ? c2.children.map((c3) => {
                return {
                  id: c3.id,
                  image: c3.MetaTagDescription,
                  name: c3.name,
                  order: tryParseOrderFromCategoryTitle(c1.Title) ?? c3.id,
                  children: [],
                  showOnHome: false,
                };
              })
            : [];
          l3Kids.sort((a, b) => a.order - b.order);
          return {
            id: c2.id,
            image: c2.MetaTagDescription,
            name: c2.name,
            order: tryParseOrderFromCategoryTitle(c1.Title) ?? c2.id,
            children: l3Kids,
            showOnHome: false,
          };
        })
      : [];
    l2Kids.sort((a, b) => a.order - b.order);
    return {
      id: c1.id,
      image: c1.MetaTagDescription,
      name: c1.name,
      order: tryParseOrderFromCategoryTitle(c1.Title) ?? c1.id,
      children: l2Kids,
      showOnHome: false,
    };
  });

  result.sort((a, b) => a.order - b.order);

  if (result.length <= 5) {
    result.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    result.forEach((x) => (x.showOnHome = toShowOnHome.includes(x.id)));
  } else {
    result.forEach((x, index) => (x.showOnHome = index < 3));
  }

  return result;
};
