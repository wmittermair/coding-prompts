import React, { useState } from 'react';
import './CategoryManager.css';

interface Category {
  id: string;
  name: string;
  isOpen: boolean;
  textBlocks: TextBlock[];
}

interface TextBlock {
  id: string;
  title: string;
  content: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleEditSubmit = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onEditCategory(editingCategory.id, editingCategory.name.trim());
      setEditingCategory(null);
    }
  };

  return (
    <div className="category-manager">
      <div className="category-add">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Neue Kategorie"
        />
        <button onClick={handleAddCategory}>Hinzufügen</button>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            {editingCategory?.id === category.id ? (
              <div className="category-edit">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                />
                <button onClick={handleEditSubmit}>Speichern</button>
                <button onClick={() => setEditingCategory(null)}>Abbrechen</button>
              </div>
            ) : (
              <div className="category-display">
                <span>{category.name}</span>
                <div className="category-actions">
                  <button
                    onClick={() =>
                      setEditingCategory({ id: category.id, name: category.name })
                    }
                  >
                    Bearbeiten
                  </button>
                  <button onClick={() => onDeleteCategory(category.id)}>
                    Löschen
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 