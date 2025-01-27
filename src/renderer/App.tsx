import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

// Typen für die Kategorien
interface TextBlock {
  id: string;
  title: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
  isOpen?: boolean;
  textBlocks: TextBlock[];
}

// Dummy-Daten
const dummyCategories: Category[] = [
  {
    id: '1',
    name: 'Begrüßungen',
    isOpen: true,
    textBlocks: [
      {
        id: '1-1',
        title: 'Formelle Begrüßung',
        content: 'Sehr geehrte Damen und Herren,\n\nich hoffe, diese Nachricht erreicht Sie gut.'
      },
      {
        id: '1-2',
        title: 'Informelle Begrüßung',
        content: 'Hallo zusammen,\n\nich hoffe, bei euch ist alles gut!'
      }
    ]
  },
  {
    id: '2',
    name: 'E-Mail Vorlagen',
    isOpen: false,
    textBlocks: [
      {
        id: '2-1',
        title: 'Meeting Anfrage',
        content: 'Können wir einen Termin für nächste Woche vereinbaren? Ich hätte Montag oder Dienstag zwischen 14-16 Uhr Zeit.'
      }
    ]
  }
];

// Typ für die Navigation
type NavigationItem = {
  id: string;
  type: 'category' | 'textBlock';
  content?: string;
};

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ 
    id: string, 
    type: 'category' | 'textBlock' | 'textBlockTitle' | 'textBlockContent', 
    value: string 
  } | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('In Zwischenablage kopiert!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Fehler beim Kopieren:', error);
      setCopyFeedback('Fehler beim Kopieren!');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleEdit = (id: string, type: 'category' | 'textBlock' | 'textBlockTitle' | 'textBlockContent') => {
    const category = categories.find(c => c.id === id || c.textBlocks.some(t => t.id === id));
    if (type === 'category' && category) {
      setEditingItem({ id, type, value: category.name });
    } else if ((type === 'textBlock' || type === 'textBlockTitle' || type === 'textBlockContent') && category) {
      const textBlock = category.textBlocks.find(t => t.id === id);
      if (textBlock) {
        setEditingItem({ 
          id, 
          type, 
          value: type === 'textBlockContent' ? textBlock.content : textBlock.title 
        });
      }
    }
  };

  const handleDelete = (id: string, type: 'category' | 'textBlock') => {
    if (type === 'category') {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      setCategories(categories.map(c => ({
        ...c,
        textBlocks: c.textBlocks.filter(t => t.id !== id)
      })));
    }
    setSelectedId(null);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setCategories(categories.map(category => {
      if (editingItem.type === 'category' && category.id === editingItem.id) {
        return { ...category, name: editingItem.value };
      }
      
      return {
        ...category,
        textBlocks: category.textBlocks.map(block => {
          if (block.id === editingItem.id) {
            if (editingItem.type === 'textBlockTitle') {
              return { ...block, title: editingItem.value };
            }
            if (editingItem.type === 'textBlockContent') {
              return { ...block, content: editingItem.value };
            }
          }
          return block;
        })
      };
    }));

    setEditingItem(null);
  };

  // Hilfsfunktionen für die Navigation
  const items = React.useMemo((): NavigationItem[] => {
    const result: NavigationItem[] = [];
    categories.forEach(category => {
      result.push({ id: category.id, type: 'category' });
      if (category.isOpen) {
        category.textBlocks.forEach(block => {
          result.push({ id: block.id, type: 'textBlock', content: block.content });
        });
      }
    });
    return result;
  }, [categories]);

  const findItemById = (id: string): NavigationItem | undefined => {
    return items.find(item => item.id === id);
  };

  const getCurrentIndex = (): number => {
    return items.findIndex(item => item.id === selectedId);
  };

  // Keyboard Navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const currentIndex = getCurrentIndex();
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          setSelectedId(items[currentIndex - 1].id);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < items.length - 1) {
          setSelectedId(items[currentIndex + 1].id);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        const categoryToOpen = categories.find(c => c.id === selectedId);
        if (categoryToOpen && !categoryToOpen.isOpen) {
          setCategories(categories.map(cat => 
            cat.id === selectedId ? { ...cat, isOpen: true } : cat
          ));
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        const categoryToClose = categories.find(c => c.id === selectedId);
        if (categoryToClose && categoryToClose.isOpen) {
          setCategories(categories.map(cat => 
            cat.id === selectedId ? { ...cat, isOpen: false } : cat
          ));
        }
        break;

      case 'Enter':
        event.preventDefault();
        const selectedItem = findItemById(selectedId || '');
        if (selectedItem?.type === 'textBlock' && selectedItem.content) {
          copyToClipboard(selectedItem.content);
        } else if (selectedItem?.type === 'category') {
          const category = categories.find(c => c.id === selectedId);
          if (category) {
            setCategories(categories.map(cat => 
              cat.id === selectedId ? { ...cat, isOpen: !cat.isOpen } : cat
            ));
          }
        }
        break;
    }
  }, [categories, selectedId, items, copyToClipboard]);

  // Event Listener für Keyboard Navigation
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="app">
      {copyFeedback && (
        <div className="copy-feedback">
          {copyFeedback}
        </div>
      )}
      
      <div className="content">
        <div className="sidebar">
          <div className="add-category">
            <button 
              onClick={() => {
                const newId = String(Math.max(...categories.map(c => Number(c.id))) + 1);
                setCategories([...categories, {
                  id: newId,
                  name: 'Neue Kategorie',
                  isOpen: true,
                  textBlocks: []
                }]);
              }}
              className="add-button"
            >
              + Neue Kategorie
            </button>
          </div>
          
          {categories.map(category => (
            <div key={category.id} className={`category ${category.id === selectedId ? 'selected' : ''}`}>
              <div 
                className={`category-header ${category.id === selectedId ? 'selected' : ''}`}
                onClick={() => {
                  if (!editingItem) {
                    setSelectedId(category.id);
                    setCategories(categories.map(cat => 
                      cat.id === category.id ? { ...cat, isOpen: !cat.isOpen } : cat
                    ));
                  }
                }}
              >
                {editingItem?.id === category.id ? (
                  <input
                    value={editingItem.value}
                    onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="category-header-content">
                      <span className="category-icon">{category.isOpen ? '▼' : '▶'}</span>
                      <span className="category-name">{category.name}</span>
                    </div>
                    <div className="item-controls" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(category.id, 'category')}>✎</button>
                      <button onClick={() => handleDelete(category.id, 'category')}>🗑</button>
                    </div>
                  </>
                )}
              </div>
              
              {category.isOpen && (
                <div className="text-blocks">
                  <div className="add-textblock">
                    <button 
                      onClick={() => {
                        const newId = `${category.id}-${category.textBlocks.length + 1}`;
                        setCategories(categories.map(c => 
                          c.id === category.id ? {
                            ...c,
                            textBlocks: [...c.textBlocks, {
                              id: newId,
                              title: 'Neuer Textbaustein',
                              content: ''
                            }]
                          } : c
                        ));
                      }}
                      className="add-button"
                    >
                      + Neuer Textbaustein
                    </button>
                  </div>
                  
                  {category.textBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`text-block ${block.id === selectedId ? 'selected' : ''}`}
                      onClick={() => !editingItem && setSelectedId(block.id)}
                    >
                      {editingItem?.id === block.id && editingItem.type === 'textBlockTitle' ? (
                        <input
                          value={editingItem.value}
                          onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                          onBlur={handleSaveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <span>{block.title}</span>
                          <div className="item-controls" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleEdit(block.id, 'textBlockTitle')}>✎</button>
                            <button onClick={() => handleDelete(block.id, 'textBlock')}>🗑</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="preview">
          {selectedId && categories.some(c => 
            c.textBlocks.some(b => b.id === selectedId)
          ) && (
            <div className="preview-content">
              <div className="preview-header">
                <h2>Vorschau</h2>
                <div className="preview-controls">
                  <button 
                    className="edit-button"
                    onClick={() => {
                      const block = categories
                        .flatMap(c => c.textBlocks)
                        .find(b => b.id === selectedId);
                      if (block) {
                        handleEdit(selectedId, 'textBlockContent');
                      }
                    }}
                    title="Bearbeiten"
                  >
                    ✎ Bearbeiten
                  </button>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      const block = categories
                        .flatMap(c => c.textBlocks)
                        .find(b => b.id === selectedId);
                      if (block) {
                        copyToClipboard(block.content);
                      }
                    }}
                    title="In Zwischenablage kopieren"
                  >
                    📋 Kopieren
                  </button>
                </div>
              </div>
              {editingItem?.id === selectedId && editingItem.type === 'textBlockContent' ? (
                <textarea
                  value={editingItem.value}
                  onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                  onBlur={handleSaveEdit}
                  autoFocus
                  className="preview-editor"
                />
              ) : (
                <pre>
                  {categories
                    .flatMap(c => c.textBlocks)
                    .find(b => b.id === selectedId)?.content || ''}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 