import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ErrorView } from '../components/ErrorView';

describe('ErrorView', () => {
  it('renders message and triggers retry', () => {
    const mockRetry = jest.fn();

    const { getByText } = render(
      <ErrorView message="Something went wrong" onRetry={mockRetry} />
    );

    expect(getByText('Something went wrong')).toBeTruthy();

    fireEvent.press(getByText('Retry'));

    expect(mockRetry).toHaveBeenCalled();
  });
});