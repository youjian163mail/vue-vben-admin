export interface TableResponse<T = any> {
  items: T[];
  total: number;
}

export function transformTableResponse<T = any>(
  response: any,
): TableResponse<T> {
  return {
    items: response.records || [],
    total: response.totalRow || 0,
  };
}
