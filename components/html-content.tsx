import { Text, View } from 'react-native';

interface HtmlContentProps {
  html: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&hellip;/g, '...')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

type HtmlBlock = { type: 'paragraph' | 'heading'; content: string; level?: number };

function parseHtmlToBlocks(html: string): HtmlBlock[] {
  const blocks: HtmlBlock[] = [];

  // Split by common block elements
  const parts = html.split(/<\/?(?:p|h[1-6]|div|br\s*\/?)>/gi);

  // Extract heading levels
  const headingMatches = html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi);
  const headings = new Map<string, number>();
  for (const match of headingMatches) {
    const content = decodeHtmlEntities(match[2].replace(/<[^>]*>/g, '').trim());
    if (content) {
      headings.set(content, parseInt(match[1], 10));
    }
  }

  for (const part of parts) {
    const content = decodeHtmlEntities(part.replace(/<[^>]*>/g, '').trim());
    if (content) {
      const headingLevel = headings.get(content);
      if (headingLevel) {
        blocks.push({ type: 'heading', content, level: headingLevel });
      } else {
        blocks.push({ type: 'paragraph', content });
      }
    }
  }

  return blocks;
}

export function HtmlContent({ html }: HtmlContentProps) {
  const blocks = parseHtmlToBlocks(html);

  return (
    <View className="gap-4">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const fontSize = block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg';
          return (
            <Text
              key={index}
              className={`${fontSize} font-bold text-zinc-900 dark:text-zinc-100`}
              selectable
            >
              {block.content}
            </Text>
          );
        }

        return (
          <Text
            key={index}
            className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
            selectable
          >
            {block.content}
          </Text>
        );
      })}
    </View>
  );
}
