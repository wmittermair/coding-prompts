import React, { useState } from 'react';
import './TextBlockManager.css';

interface TextBlock {
  id: string;
  title: string;
  content: string;
}

interface TextBlockManagerProps {
  categoryId: string;
  textBlocks: TextBlock[];
  onAddTextBlock: (categoryId: string, title: string, content: string) => void;
  onEditTextBlock: (categoryId: string, textBlockId: string, title: string, content: string) => void;
  onDeleteTextBlock: (categoryId: string, textBlockId: string) => void;
}

export const TextBlockManager: React.FC<TextBlockManagerProps> = ({
  categoryId,
  textBlocks,
  onAddTextBlock,
  onEditTextBlock,
  onDeleteTextBlock,
}) => {
  const [newTextBlock, setNewTextBlock] = useState({ title: '', content: '' });
  const [editingTextBlock, setEditingTextBlock] = useState<TextBlock | null>(null);

  const handleAddTextBlock = () => {
    if (newTextBlock.title.trim() && newTextBlock.content.trim()) {
      onAddTextBlock(categoryId, newTextBlock.title.trim(), newTextBlock.content.trim());
      setNewTextBlock({ title: '', content: '' });
    }
  };

  const handleEditSubmit = () => {
    if (editingTextBlock && editingTextBlock.title.trim() && editingTextBlock.content.trim()) {
      onEditTextBlock(
        categoryId,
        editingTextBlock.id,
        editingTextBlock.title.trim(),
        editingTextBlock.content.trim()
      );
      setEditingTextBlock(null);
    }
  };

  return (
    <div className="text-block-manager">
      <div className="text-block-add">
        <input
          type="text"
          value={newTextBlock.title}
          onChange={(e) => setNewTextBlock({ ...newTextBlock, title: e.target.value })}
          placeholder="Titel des Textbausteins"
        />
        <textarea
          value={newTextBlock.content}
          onChange={(e) => setNewTextBlock({ ...newTextBlock, content: e.target.value })}
          placeholder="Inhalt des Textbausteins"
        />
        <button onClick={handleAddTextBlock}>Textbaustein hinzufügen</button>
      </div>

      <div className="text-block-list">
        {textBlocks.map((textBlock) => (
          <div key={textBlock.id} className="text-block-item">
            {editingTextBlock?.id === textBlock.id ? (
              <div className="text-block-edit">
                <input
                  type="text"
                  value={editingTextBlock.title}
                  onChange={(e) =>
                    setEditingTextBlock({ ...editingTextBlock, title: e.target.value })
                  }
                />
                <textarea
                  value={editingTextBlock.content}
                  onChange={(e) =>
                    setEditingTextBlock({ ...editingTextBlock, content: e.target.value })
                  }
                />
                <div className="text-block-actions">
                  <button onClick={handleEditSubmit}>Speichern</button>
                  <button onClick={() => setEditingTextBlock(null)}>Abbrechen</button>
                </div>
              </div>
            ) : (
              <div className="text-block-display">
                <h3>{textBlock.title}</h3>
                <p>{textBlock.content}</p>
                <div className="text-block-actions">
                  <button onClick={() => setEditingTextBlock(textBlock)}>
                    Bearbeiten
                  </button>
                  <button onClick={() => onDeleteTextBlock(categoryId, textBlock.id)}>
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