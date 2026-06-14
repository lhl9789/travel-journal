/**
 * 기본 카테고리 시드 데이터 (DB 마이그레이션 시 1회 삽입)
 */
export const DEFAULT_CATEGORIES = [
  { id: 'category-food', label: '식비', icon: 'restaurant', orderIndex: 0, isDefault: true },
  { id: 'category-shopping', label: '쇼핑', icon: 'bag', orderIndex: 1, isDefault: true },
  { id: 'category-transport', label: '교통', icon: 'bus', orderIndex: 2, isDefault: true },
  { id: 'category-sightseeing', label: '관광', icon: 'camera', orderIndex: 3, isDefault: true },
  { id: 'category-lodging', label: '숙박', icon: 'bed', orderIndex: 4, isDefault: true },
  { id: 'category-etc', label: '미분류', icon: 'ellipsis-horizontal', orderIndex: 5, isDefault: true },
] as const
