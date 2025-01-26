import React, { useEffect, useState } from 'react';
import './App.css';

declare global {
  interface Window {
    electron: {
      copyToClipboard: (text: string) => Promise<void>;
      getClipboardContent: () => Promise<string>;
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

export const App: React.FC = () => {
  const [categories, setCategories] = useState(DEMO_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTextBlockId, setSelectedTextBlockId] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      // Hole aktuellen Clipboard-Inhalt für $clipboard Variable
      const clipboardContent = await window.electron.getClipboardContent();
      
      // Ersetze $clipboard mit aktuellem Inhalt
      const processedText = text.replace(/\$clipboard/g, clipboardContent);
      
      // Kopiere in Zwischenablage
      await window.electron.copyToClipboard(processedText);
      
      // Optional: Visuelles Feedback
      const preview = document.querySelector('.preview');
      if (preview) {
        preview.classList.add('copied');
        setTimeout(() => preview.classList.remove('copied'), 200);
      }
    } catch (error) {
      console.error('Fehler beim Kopieren:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentCategory = categories.find(c => c.id === selectedCategoryId);
    
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (selectedCategoryId) {
          const currentCatIndex = categories.findIndex(c => c.id === selectedCategoryId);
          const currentCat = categories[currentCatIndex];
          
          if (selectedTextBlockId && currentCat.isOpen) {
            // In Textbausteinen navigieren
            const textBlockIndex = currentCat.textBlocks.findIndex(t => t.id === selectedTextBlockId);
            if (textBlockIndex > 0) {
              // Zum vorherigen Textbaustein
              setSelectedTextBlockId(currentCat.textBlocks[textBlockIndex - 1].id);
            } else {
              // Zur Kategorie
              setSelectedTextBlockId(null);
            }
          } else if (currentCatIndex > 0) {
            // Zur vorherigen Kategorie
            const prevCat = categories[currentCatIndex - 1];
            setSelectedCategoryId(prevCat.id);
            if (prevCat.isOpen && prevCat.textBlocks.length > 0) {
              // Zum letzten Textbaustein der vorherigen Kategorie
              setSelectedTextBlockId(prevCat.textBlocks[prevCat.textBlocks.length - 1].id);
            } else {
              setSelectedTextBlockId(null);
            }
          }
        } else {
          setSelectedCategoryId(categories[0].id);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (selectedCategoryId) {
          const currentCatIndex = categories.findIndex(c => c.id === selectedCategoryId);
          const currentCat = categories[currentCatIndex];
          
          if (currentCat.isOpen && (!selectedTextBlockId && currentCat.textBlocks.length > 0)) {
            // Zum ersten Textbaustein
            setSelectedTextBlockId(currentCat.textBlocks[0].id);
          } else if (selectedTextBlockId && currentCat.isOpen) {
            // In Textbausteinen navigieren
            const textBlockIndex = currentCat.textBlocks.findIndex(t => t.id === selectedTextBlockId);
            if (textBlockIndex < currentCat.textBlocks.length - 1) {
              // Zum nächsten Textbaustein
              setSelectedTextBlockId(currentCat.textBlocks[textBlockIndex + 1].id);
            } else if (currentCatIndex < categories.length - 1) {
              // Zur nächsten Kategorie
              setSelectedCategoryId(categories[currentCatIndex + 1].id);
              setSelectedTextBlockId(null);
            }
          } else if (currentCatIndex < categories.length - 1) {
            // Zur nächsten Kategorie
            setSelectedCategoryId(categories[currentCatIndex + 1].id);
            setSelectedTextBlockId(null);
          }
        } else {
          setSelectedCategoryId(categories[0].id);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedCategoryId) {
          if (selectedTextBlockId) {
            // Textbaustein in Zwischenablage kopieren
            const textBlock = categories
              .find(c => c.textBlocks.some(b => b.id === selectedTextBlockId))
              ?.textBlocks.find(b => b.id === selectedTextBlockId);
            
            if (textBlock) {
              copyToClipboard(textBlock.content);
            }
          } else {
            // Kategorie auf/zuklappen
            setCategories(cats => cats.map(cat => 
              cat.id === selectedCategoryId 
                ? { ...cat, isOpen: !cat.isOpen }
                : cat
            ));
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (selectedTextBlockId) {
          setSelectedTextBlockId(null);
        } else {
          setSelectedCategoryId(null);
        }
        break;
    }
  };

  // Fokus auf Container setzen
  useEffect(() => {
    const container = document.getElementById('app-container');
    if (container) {
      container.focus();
    }
  }, []);

  return (
    <div 
      id="app-container"
      className="app" 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
    >
      <h1>Prompt Manager</h1>
      <div className="main-container">
        <div className="category-list">
          {categories.map(category => (
            <div key={category.id}>
              <div
                className={`category-item ${selectedCategoryId === category.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setCategories(cats => cats.map(cat => 
                    cat.id === category.id 
                      ? { ...cat, isOpen: !cat.isOpen }
                      : cat
                  ));
                }}
              >
                {category.isOpen ? '▼' : '▶'} {category.name}
              </div>
              {category.isOpen && (
                <div className="text-block-list">
                  {category.textBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`text-block-item ${selectedTextBlockId === block.id ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTextBlockId(block.id);
                      }}
                    >
                      {block.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="preview-container">
          {selectedTextBlockId && (
            <div className="preview">
              <h2>Vorschau</h2>
              <pre className="content">
                {categories
                  .find(c => c.textBlocks.some(b => b.id === selectedTextBlockId))
                  ?.textBlocks.find(b => b.id === selectedTextBlockId)
                  ?.content || ''}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 