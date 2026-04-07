import React from 'react';
import { Searchbar } from 'react-native-paper';

interface Props {
  onSearch: (query: string) => void;
  value: string;
}

export const SearchBar: React.FC<Props> = ({ onSearch, value }) => {
  return (
    <Searchbar
      placeholder="Search Pokémon"
      onChangeText={onSearch}
      value={value}
      style={{ margin: 12, borderRadius: 10, elevation: 2 }}
      inputStyle={{ fontSize: 16 }}
    />
  );
};