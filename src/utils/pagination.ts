/**
 * Generic pagination result container
 */
export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

/**
 * Paginates a list of items based on current page and size constraints.
 */
export function paginateList<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  let currentPage = page;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalPages,
    currentPage,
    totalItems
  };
}

/**
 * Filters a list of items based on a case-insensitive search term applied to a string field of the item.
 */
export function filterList<T>(
  items: T[],
  searchQuery: string,
  fieldSelector: (item: T) => string
): T[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return items;
  }
  
  const query = searchQuery.toLowerCase().trim();
  return items.filter(item => {
    const value = fieldSelector(item);
    return value ? value.toLowerCase().includes(query) : false;
  });
}

/**
 * Sorts a list of items dynamically.
 */
export function sortList<T, K extends keyof T>(
  items: T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) return 0;
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (order === 'asc') {
      return aStr < bStr ? -1 : 1;
    } else {
      return aStr > bStr ? -1 : 1;
    }
  });
}
