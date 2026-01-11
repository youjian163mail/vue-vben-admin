/**
 * 检查值是否为 null 或 undefined
 * @param value 要检查的值
 * @returns 如果值为 null 或 undefined 返回 true，否则返回 false
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * 如果值为 null 或 undefined，返回默认值；否则返回原值
 * @param value 要检查的值
 * @param defaultValue 默认值
 * @returns 如果值为 null 或 undefined 返回默认值，否则返回原值
 */
export function nullToDefault<T, K>(
  value: T,
  defaultValue: K,
): T extends null | undefined ? K : T {
  if (isNullOrUndefined(value)) {
    return defaultValue as any;
  }
  return value as any;
}

/**
 * 将 null 或 undefined 转换为空字符串
 * @param value 要转换的值
 * @returns 如果值为 null 或 undefined 返回空字符串，否则返回原值的字符串形式
 */
export function nullToEmptyString(value: unknown): string {
  if (isNullOrUndefined(value)) {
    return '';
  }
  return String(value);
}
