import { TextBlock } from '../shared/types';

export class VersionManager {
  static createNewVersion(textBlock: TextBlock): TextBlock {
    return {
      ...textBlock,
      versions: [
        {
          version: textBlock.versions.length + 1,
          content: textBlock.content,
          createdAt: new Date().toISOString()
        },
        ...textBlock.versions
      ]
    };
  }
} 