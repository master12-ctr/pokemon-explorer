import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Image } from 'react-native';
import { PokemonCard } from '../components/PokemonCard';

// ✅ Fix Image.prefetch crash
Image.prefetch = jest.fn(() => Promise.resolve(true));

const mockPokemon = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
};

describe('PokemonCard', () => {
  it('renders pokemon name', () => {
    const { getByText } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={jest.fn()}
        screenWidth={400}
      />
    );

    expect(getByText('pikachu')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();

    const { getByText } = render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={mockPress}
        screenWidth={400}
      />
    );

    fireEvent.press(getByText('pikachu'));

    expect(mockPress).toHaveBeenCalledWith('pikachu');
  });
});