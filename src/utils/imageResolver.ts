// Dynamically resolve image URL from Pokémon name (no hardcoded map)
export const getPokemonImageUrl = (name: string) => {
  // Use PokeAPI sprite repository; name is lowercase
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name}.png`;
};