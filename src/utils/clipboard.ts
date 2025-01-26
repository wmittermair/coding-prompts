export class ClipboardManager {
  static async processTemplate(template: string): Promise<string> {
    const clipboardContent = await navigator.clipboard.readText();
    return template.replace(/\$clipboard/g, clipboardContent);
  }

  static async copyMultipleTexts(texts: string[]): Promise<void> {
    const combined = texts.join('\n\n');
    await navigator.clipboard.writeText(combined);
  }
} 