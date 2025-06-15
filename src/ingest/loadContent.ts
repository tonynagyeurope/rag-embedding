import fs from 'fs/promises';
import path from 'path';

export async function loadAllDocuments(): Promise<string[]> {
  const contentDir = path.join(__dirname, '..', 'data', 'content');
  const files = await fs.readdir(contentDir);

  const jsonFiles = files.filter((file) => file.endsWith('.json'));
  const contents: string[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(contentDir, file);

    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        const combined = parsed
          .map((item) => item?.content)
          .filter((text): text is string => typeof text === 'string')
          .join('\n\n');

        if (combined) contents.push(combined);
        else console.warn(`Skipped ${file}: all array items missing content`);
      } else if (typeof parsed?.content === 'string') {
        contents.push(parsed.content);
      } else {
        console.warn(`Skipped ${file}: missing 'content' field`);
      }
    } catch (err) {
      console.warn(`Failed to parse ${file}: ${(err as Error).message}`);
    }
  }

  return contents;
}
