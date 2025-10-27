import { ShapeIndex, isArrayAt } from './shape';

const asObject = (value: any): Record<string, any> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {};

// [CHG] Lectura segura de valores alineada con el índice de shape
export const getValueAtPath = (
  root: Record<string, any> | undefined,
  path: string,
  shapeIndex: ShapeIndex
) => {
  if (!root) return undefined;
  const segments = path.split('#').filter(Boolean);
  let current: any = root;
  for (let i = 0; i < segments.length; i += 1) {
    if (!current) return undefined;
    const segment = segments[i];
    const prefix = segments.slice(0, i + 1).join('#');
    if (isArrayAt(shapeIndex, prefix)) {
      const container = current[segment];
      if (Array.isArray(container) && container.length > 0) {
        current = container[0];
      } else if (container && typeof container === 'object') {
        current = container;
      } else {
        return undefined;
      }
    } else {
      if (Array.isArray(current) && current.length > 0) {
        current = current[0];
      }
      current = current[segment];
    }
  }
  return current;
};

// [CHG] Escritura inmutable alineada con las expectativas de array/objeto
export const setValueAtPath = (
  root: Record<string, any> | undefined,
  path: string,
  value: any,
  shapeIndex: ShapeIndex
) => {
  const segments = path.split('#').filter(Boolean);
  if (segments.length === 0) {
    return asObject(root);
  }

  const setRec = (node: any, depth: number): any => {
    const base = asObject(node);
    const parent: Record<string, any> = { ...base };
    const segment = segments[depth];
    const prefix = segments.slice(0, depth + 1).join('#');
    const expectArray = isArrayAt(shapeIndex, prefix);
    const isLeaf = depth === segments.length - 1;

    if (expectArray) {
      const existing = parent[segment];
      const arr = Array.isArray(existing) ? [...existing] : [];
      const currentEntry =
        arr.length > 0 && asObject(arr[0]) ? { ...asObject(arr[0]) } : {};

      if (isLeaf) {
        arr[0] = value;
      } else {
        arr[0] = setRec(currentEntry, depth + 1);
      }
      parent[segment] = [arr[0]];
    } else if (isLeaf) {
      parent[segment] = value;
    } else {
      const nextNode = parent[segment];
      parent[segment] = setRec(nextNode, depth + 1);
    }

    return parent;
  };

  return setRec(root, 0);
};
