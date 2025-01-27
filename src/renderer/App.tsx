import React, { useState } from 'react';
import './App.css';

declare global {
  interface Window {
    electron: {
      copyToClipboard: (text: string) => Promise<boolean>;
      getClipboardContent: () => Promise<string>;
      minimizeWindow: () => Promise<boolean>;
      maximizeWindow: () => Promise<boolean>;
      closeWindow: () => Promise<boolean>;
    }
  }
}

const DEMO_CATEGORIES = [
  { 
    id: '1', 
    name: 'Projektplanung',
    isOpen: false,
    textBlocks: [
      { 
        id: 't1', 
        title: 'Neues Projekt starten', 
        content: 'Ich möchte ein neues Projekt erstellen. Der Projektname ist: $clipboard\n\nBitte erstelle:\n1. Eine sinnvolle Ordnerstruktur\n2. Notwendige Konfigurationsdateien\n3. Eine README.md mit Projektbeschreibung\n4. Eine erste Version der wichtigsten Dateien'
      },
      { 
        id: 't2', 
        title: 'Technologie-Stack', 
        content: 'Welcher Tech-Stack würde für folgendes Projekt am besten passen: $clipboard\n\nBitte berücksichtige:\n- Wartbarkeit\n- Performance\n- Entwicklungsgeschwindigkeit\n- Community/Support'
      },
      {
        id: 't3',
        title: 'Architektur-Review',
        content: 'Bitte analysiere die aktuelle Projektstruktur und gib Verbesserungsvorschläge für:\n1. Code-Organisation\n2. Dateienstruktur\n3. Namenskonventionen\n4. Potenzielle Probleme'
      }
    ]
  },
  { 
    id: '2', 
    name: 'Anweisungen',
    isOpen: false,
    textBlocks: [
      { 
        id: 't4', 
        title: 'Feature implementieren', 
        content: 'Bitte implementiere folgendes Feature: $clipboard\n\nWichtige Aspekte:\n- Clean Code Prinzipien\n- Typsicherheit\n- Fehlerbehandlung\n- Tests'
      },
      {
        id: 't5',
        title: 'Code Review',
        content: 'Bitte überprüfe den folgenden Code auf:\n1. Potenzielle Bugs\n2. Performance-Probleme\n3. Best Practices\n4. Sicherheitslücken\n5. Verbesserungsmöglichkeiten'
      },
      {
        id: 't6',
        title: 'Bug fixen',
        content: 'Es gibt einen Bug im Code: $clipboard\n\nBitte:\n1. Analysiere das Problem\n2. Erkläre die Ursache\n3. Schlage eine Lösung vor\n4. Implementiere die Lösung'
      }
    ]
  },
  { 
    id: '3', 
    name: 'Während dem Projekt',
    isOpen: false,
    textBlocks: [
      {
        id: 't7',
        title: 'Code optimieren',
        content: 'Bitte optimiere den folgenden Code-Abschnitt: $clipboard\n\nFokus auf:\n- Performance\n- Lesbarkeit\n- Wartbarkeit'
      },
      {
        id: 't8',
        title: 'Dokumentation erstellen',
        content: 'Bitte erstelle eine Dokumentation für: $clipboard\n\nBenötigt wird:\n1. Funktionsbeschreibung\n2. Parameter/Rückgabewerte\n3. Beispiele\n4. Bekannte Einschränkungen'
      },
      {
        id: 't9',
        title: 'Tests schreiben',
        content: 'Bitte erstelle Tests für: $clipboard\n\nAbdecken:\n1. Erfolgsfall\n2. Fehlerfälle\n3. Edge Cases\n4. Performance Tests'
      }
    ]
  },
  { 
    id: '4', 
    name: 'Vor Abschluss',
    isOpen: false,
    textBlocks: [
      {
        id: 't10',
        title: 'Code Review Checkliste',
        content: 'Bitte prüfe vor dem Commit:\n1. Sind alle Tests erfolgreich?\n2. Ist der Code dokumentiert?\n3. Gibt es keine Console.logs?\n4. Sind Variablennamen aussagekräftig?\n5. Ist der Code formatiert?'
      },
      {
        id: 't11',
        title: 'Performance Check',
        content: 'Bitte analysiere die Performance von: $clipboard\n\nPrüfe auf:\n1. Unnötige Berechnungen\n2. Memory Leaks\n3. Render-Optimierungen\n4. Lazy Loading Möglichkeiten'
      },
      {
        id: 't12',
        title: 'Abschluss-Review',
        content: 'Bitte führe ein finales Review durch:\n1. Code-Qualität\n2. Test-Abdeckung\n3. Dokumentation\n4. Performance\n5. Sicherheit'
      }
    ]
  }
];

// Typen für die Navigation
type NavigationItem = {
  id: string;
  type: 'category' | 'textBlock';
  content?: string;
};

export const App: React.FC = () => {
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

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
    return items.find((item: NavigationItem) => item.id === id);
  };

  const getCurrentIndex = (): number => {
    return items.findIndex((item: NavigationItem) => item.id === selectedId);
  };

  const copyToClipboard = async (text: string) => {
    try {
      console.log('Kopiere Text:', text);
      
      // Direkt in Zwischenablage kopieren
      await window.electron.copyToClipboard(text);
      console.log('Text wurde in Zwischenablage kopiert');
      
      // Zeige Feedback
      setCopyFeedback('In Zwischenablage kopiert!');
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Fehler beim Kopieren:', error);
      setCopyFeedback('Fehler beim Kopieren! Bitte versuchen Sie es erneut.');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  // Keyboard Navigation
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
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
          setCategories(cats => cats.map(cat => 
            cat.id === selectedId ? { ...cat, isOpen: true } : cat
          ));
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        const categoryToClose = categories.find(c => c.id === selectedId);
        if (categoryToClose && categoryToClose.isOpen) {
          setCategories(cats => cats.map(cat => 
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
          // Toggle Kategorie öffnen/schließen bei Enter
          const category = categories.find(c => c.id === selectedId);
          if (category) {
            setCategories(cats => cats.map(cat => 
              cat.id === selectedId ? { ...cat, isOpen: !cat.isOpen } : cat
            ));
          }
        }
        break;
    }
  }, [categories, selectedId, items, copyToClipboard]);

  // Event Listener für Keyboard Navigation
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleWindowControls = {
    minimize: async () => {
      try {
        await window.electron.minimizeWindow();
      } catch (error) {
        console.error('Fehler beim Minimieren:', error);
      }
    },
    maximize: async () => {
      try {
        await window.electron.maximizeWindow();
      } catch (error) {
        console.error('Fehler beim Maximieren:', error);
      }
    },
    close: async () => {
      try {
        await window.electron.closeWindow();
      } catch (error) {
        console.error('Fehler beim Schließen:', error);
      }
    }
  };

  return (
    <div className="app">
      {copyFeedback && (
        <div className="copy-feedback">
          {copyFeedback}
        </div>
      )}
      <div className="titlebar">
        <div className="titlebar-drag">
          <div className="drag-icon">⋮⋮⋮</div>
          <h1>Prompt Manager</h1>
        </div>
        <div className="window-controls">
          <button onClick={handleWindowControls.minimize}>─</button>
          <button onClick={handleWindowControls.maximize}>□</button>
          <button onClick={handleWindowControls.close}>×</button>
        </div>
      </div>
      
      <div className="content">
        <div className="sidebar">
          {categories.map(category => (
            <div key={category.id} className="category">
              <div 
                className={`category-header ${selectedId === category.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedId(category.id);
                  setCategories(cats => cats.map(cat => 
                    cat.id === category.id ? { ...cat, isOpen: !cat.isOpen } : cat
                  ));
                }}
              >
                <span className="category-icon">{category.isOpen ? '▼' : '▶'}</span>
                <span className="category-name">{category.name}</span>
              </div>
              
              {category.isOpen && (
                <div className="category-items">
                  {category.textBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`category-item ${selectedId === block.id ? 'selected' : ''}`}
                      onClick={() => setSelectedId(block.id)}
                    >
                      <span>{block.title}</span>
                      <button 
                        className="copy-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(block.content);
                        }}
                        title="In Zwischenablage kopieren"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="preview">
          {selectedId && findItemById(selectedId)?.type === 'textBlock' && (
            <div className="preview-content">
              <div className="preview-header">
                <h2>Vorschau</h2>
                <button 
                  className="copy-button"
                  onClick={() => {
                    const content = findItemById(selectedId)?.content;
                    if (content) {
                      copyToClipboard(content);
                    }
                  }}
                  title="In Zwischenablage kopieren"
                >
                  📋 Kopieren
                </button>
              </div>
              <pre>
                {findItemById(selectedId)?.content || ''}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 