import React, { useCallback, useState } from 'react';
import { Searchbar } from 'react-native-paper';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    (text: string) => {
      setQuery(text);
      onSearch(text);
    },
    [onSearch]
  );

  return (
    <Searchbar
      placeholder="Search Pokémon"
      onChangeText={handleChange}
      value={query}
      className="mx-4 my-2"
    />
  );
};