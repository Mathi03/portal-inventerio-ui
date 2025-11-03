import { ConfigDataAttribute } from '@/core/tipo-componente/tipo-componente.type';

export type ShapeIndexEntry = 'array' | 'object' | 'value';

export type ShapeIndex = Record<string, ShapeIndexEntry>;

// [CHG] Construye un índice que define si cada path es array u objeto
export function buildShapeIndex(
  items: ConfigDataAttribute[],
  forceAllObject: boolean,
  prefix = ''
): ShapeIndex {
  const index: ShapeIndex = {};

  const apply = (attrs: ConfigDataAttribute[], currentPrefix: string) => {
    attrs.forEach((attr) => {
      const path = currentPrefix
        ? `${currentPrefix}#${attr.name}`
        : attr.name;
      const hasChildren =
        Array.isArray(attr.atribs_config) && attr.atribs_config.length > 0;
      const isArray = !forceAllObject && attr.type === 'array';
      const entry: ShapeIndexEntry = isArray
        ? 'array'
        : hasChildren
        ? 'object'
        : 'value';
      index[path] = entry;

      if (hasChildren) {
        apply(attr.atribs_config!, path);
      }
    });
  };

  apply(items ?? [], prefix);
  return index;
}

// [CHG] Consulta si un path debe tratarse como array
export const isArrayAt = (shapeIndex: ShapeIndex, path: string) =>
  shapeIndex[path] === 'array';
