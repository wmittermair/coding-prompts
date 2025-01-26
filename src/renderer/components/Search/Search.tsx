export const Search: React.FC = () => {
  const searchItems = (query: string) => {
    // Durchsuche Kategorien und Textbausteine
    // Unterstützt Tags und Volltext
    // ... existing code ...
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Suchen..."
        onChange={(e) => searchItems(e.target.value)}
      />
      {/* Suchergebnisse */}
    </div>
  );
}; 