import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { spacing } from '../constants/spacing';

export const BottomSheetInfo = ({ children, snapPoints = ['25%', '50%'] }: any) => {
  const sheetRef = useRef<BottomSheet>(null);
  const handleOpen = useCallback(() => sheetRef.current?.expand(), []);
  const handleClose = useCallback(() => sheetRef.current?.close(), []);

  return (
    <>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose>
        <BottomSheetView style={{ padding: spacing.lg }}>{children}</BottomSheetView>
      </BottomSheet>
    </>
  );
};