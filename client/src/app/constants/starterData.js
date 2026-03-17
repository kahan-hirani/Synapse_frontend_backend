export const STARTER_NOTEBOOKS = [
  {
    id: 'n-1',
    icon: '🔎',
    title: 'Python Regular Expressions',
    createdAt: '2026-03-16',
    sources: [],
    featured: false,
  },
  {
    id: 'n-2',
    icon: '⚡',
    title: 'Fuel Cells and Hydrogen Energy',
    createdAt: '2026-03-14',
    sources: [],
    featured: true,
  },
  {
    id: 'n-3',
    icon: '🌬️',
    title: 'Understanding Wind Energy Systems',
    createdAt: '2026-03-13',
    sources: [],
    featured: true,
  },
  {
    id: 'n-4',
    icon: '🌊',
    title: 'Ocean Energy',
    createdAt: '2026-03-12',
    sources: [],
    featured: false,
  },
];

export function createInitialChatMap(notebooks) {
  const map = {};
  notebooks.forEach((notebook) => {
    map[notebook.id] = [];
  });
  return map;
}
