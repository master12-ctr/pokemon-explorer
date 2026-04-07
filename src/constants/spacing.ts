
export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

export const getLayout = (width: number, height: number) => {
  const isTablet = width > 600;
  const columns = isTablet ? 3 : 2;
  const gap = isTablet ? spacing.md : spacing.sm;
  const horizontalPadding = spacing.md * 2;
  const availableWidth = width - horizontalPadding - gap * (columns - 1);
  const cardWidth = Math.floor(availableWidth / columns);

  return {
    headerHeight: Math.min(height * 0.18, 160),
    imageSize: Math.min(width * 0.38, 160),
    listHeaderHeight: Math.min(height * 0.12, 90),
    numColumns: columns,
    cardWidth,
    gap,
    screenWidth: width,
  };
};