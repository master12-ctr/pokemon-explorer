export const getStatLabel = (value: number) => {
  if (value < 50) return 'Low';
  if (value < 100) return 'Medium';
  return 'High';
};