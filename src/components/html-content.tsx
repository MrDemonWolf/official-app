import { Image } from 'expo-image';
import { Linking, Text, View, useWindowDimensions } from 'react-native';

import { useSettings } from '@/contexts/settings-context';
import { decodeHtmlEntities } from '@/lib/decode-html';
import { FONT_SCALES, type FontScale } from '@/lib/font-scale';
import { parseHtml, type HtmlNode } from '@/lib/html-parser';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HtmlContentProps {
  html: string;
}

const BLOCK_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'ul',
  'ol',
  'li',
  'pre',
  'figure',
  'figcaption',
  'hr',
  'div',
]);

function isBlockElement(node: HtmlNode): boolean {
  return node.type === 'element' && BLOCK_TAGS.has(node.tag);
}

function getTextContent(nodes: HtmlNode[]): string {
  let result = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      result += node.content;
    } else if (node.type === 'element') {
      if (node.tag === 'br') {
        result += '\n';
      } else {
        result += getTextContent(node.children);
      }
    }
  }
  return result;
}

function renderInline(
  nodes: HtmlNode[],
  scale: FontScale,
  isDark: boolean,
  parentStyles?: object,
  keyPrefix = ''
): React.ReactNode[] {
  const result: React.ReactNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const key = `${keyPrefix}${i}`;

    if (node.type === 'text') {
      const text = decodeHtmlEntities(node.content);
      if (text) {
        result.push(
          <Text key={key} style={parentStyles}>
            {text}
          </Text>
        );
      }
      continue;
    }

    if (node.tag === 'br') {
      result.push(<Text key={key}>{'\n'}</Text>);
      continue;
    }

    if (node.tag === 'strong' || node.tag === 'b') {
      result.push(
        <Text key={key} style={[parentStyles, { fontWeight: '700' }]}>
          {renderInline(node.children, scale, isDark, { ...parentStyles, fontWeight: '700' }, `${key}-`)}
        </Text>
      );
      continue;
    }

    if (node.tag === 'em' || node.tag === 'i') {
      result.push(
        <Text key={key} style={[parentStyles, { fontStyle: 'italic' }]}>
          {renderInline(node.children, scale, isDark, { ...parentStyles, fontStyle: 'italic' }, `${key}-`)}
        </Text>
      );
      continue;
    }

    if (node.tag === 'a') {
      const href = node.attributes.href;
      result.push(
        <Text
          key={key}
          style={[parentStyles, { color: isDark ? '#38bdf8' : '#0a7ea4', textDecorationLine: 'underline' }]}
          onPress={href ? () => Linking.openURL(href) : undefined}
        >
          {renderInline(node.children, scale, isDark, parentStyles, `${key}-`)}
        </Text>
      );
      continue;
    }

    if (node.tag === 'code') {
      result.push(
        <Text
          key={key}
          style={[
            parentStyles,
            {
              fontFamily: 'monospace',
              fontSize: scale.code,
              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
            },
          ]}
        >
          {renderInline(node.children, scale, isDark, parentStyles, `${key}-`)}
        </Text>
      );
      continue;
    }

    // Generic inline — just recurse
    result.push(...renderInline(node.children, scale, isDark, parentStyles, `${key}-`));
  }

  return result;
}

function RenderBlock({
  node,
  scale,
  isDark,
  imageWidth,
  index,
  listIndex,
  listType,
}: {
  node: HtmlNode;
  scale: FontScale;
  isDark: boolean;
  imageWidth: number;
  index: number;
  listIndex?: number;
  listType?: 'ul' | 'ol';
}) {
  if (node.type === 'text') {
    const text = decodeHtmlEntities(node.content).trim();
    if (!text) return null;
    return (
      <Text
        style={{
          fontSize: scale.body,
          lineHeight: scale.body * scale.lineHeight,
          color: isDark ? '#d4d4d8' : '#3f3f46',
        }}
        selectable
      >
        {text}
      </Text>
    );
  }

  const { tag, children, attributes } = node;

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    const level = parseInt(tag[1], 10) as 1 | 2 | 3 | 4 | 5 | 6;
    const sizeKey = level <= 4 ? (`h${level}` as keyof FontScale) : 'body';
    const fontSize = typeof scale[sizeKey] === 'number' ? (scale[sizeKey] as number) : scale.body;
    return (
      <Text
        style={{
          fontSize,
          fontWeight: '700',
          lineHeight: fontSize * 1.3,
          color: isDark ? '#f4f4f5' : '#18181b',
        }}
        selectable
      >
        {renderInline(children, scale, isDark)}
      </Text>
    );
  }

  // Paragraph
  if (tag === 'p') {
    // Check if children contain only an img
    const hasOnlyImage =
      children.length === 1 &&
      children[0].type === 'element' &&
      children[0].tag === 'img';

    if (hasOnlyImage) {
      return (
        <RenderBlock
          node={children[0]}
          scale={scale}
          isDark={isDark}
          imageWidth={imageWidth}
          index={0}
        />
      );
    }

    return (
      <Text
        style={{
          fontSize: scale.body,
          lineHeight: scale.body * scale.lineHeight,
          color: isDark ? '#d4d4d8' : '#3f3f46',
        }}
        selectable
      >
        {renderInline(children, scale, isDark)}
      </Text>
    );
  }

  // Blockquote
  if (tag === 'blockquote') {
    return (
      <View
        style={{
          borderLeftWidth: 3,
          borderLeftColor: isDark ? '#52525b' : '#d4d4d8',
          paddingLeft: 16,
          marginLeft: 4,
        }}
      >
        {children.map((child, i) => (
          <RenderBlock
            key={i}
            node={child}
            scale={scale}
            isDark={isDark}
            imageWidth={imageWidth - 23}
            index={i}
          />
        ))}
      </View>
    );
  }

  // Lists
  if (tag === 'ul' || tag === 'ol') {
    const items = children.filter(
      (c) => c.type === 'element' && c.tag === 'li'
    );
    return (
      <View style={{ gap: 4 }}>
        {items.map((item, i) => (
          <RenderBlock
            key={i}
            node={item}
            scale={scale}
            isDark={isDark}
            imageWidth={imageWidth - 24}
            index={i}
            listIndex={i}
            listType={tag}
          />
        ))}
      </View>
    );
  }

  // List item
  if (tag === 'li') {
    const bullet =
      listType === 'ol' ? `${(listIndex ?? 0) + 1}. ` : '\u2022 ';

    // Check if li has block children
    const hasBlockChildren = children.some(isBlockElement);

    if (hasBlockChildren) {
      return (
        <View style={{ flexDirection: 'row', paddingLeft: 8 }}>
          <Text
            style={{
              fontSize: scale.body,
              lineHeight: scale.body * scale.lineHeight,
              color: isDark ? '#d4d4d8' : '#3f3f46',
              width: listType === 'ol' ? 24 : 16,
            }}
          >
            {bullet}
          </Text>
          <View style={{ flex: 1, gap: 8 }}>
            {children.map((child, i) => (
              <RenderBlock
                key={i}
                node={child}
                scale={scale}
                isDark={isDark}
                imageWidth={imageWidth - 32}
                index={i}
              />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row', paddingLeft: 8 }}>
        <Text
          style={{
            fontSize: scale.body,
            lineHeight: scale.body * scale.lineHeight,
            color: isDark ? '#d4d4d8' : '#3f3f46',
          }}
        >
          {bullet}
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: scale.body,
            lineHeight: scale.body * scale.lineHeight,
            color: isDark ? '#d4d4d8' : '#3f3f46',
          }}
          selectable
        >
          {renderInline(children, scale, isDark)}
        </Text>
      </View>
    );
  }

  // Pre / code block
  if (tag === 'pre') {
    const codeText = decodeHtmlEntities(getTextContent(children));
    return (
      <View
        style={{
          backgroundColor: isDark ? '#18181b' : '#f4f4f5',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: scale.code,
            lineHeight: scale.code * 1.5,
            color: isDark ? '#d4d4d8' : '#3f3f46',
          }}
          selectable
        >
          {codeText}
        </Text>
      </View>
    );
  }

  // Figure
  if (tag === 'figure') {
    return (
      <View style={{ gap: 8 }}>
        {children.map((child, i) => (
          <RenderBlock
            key={i}
            node={child}
            scale={scale}
            isDark={isDark}
            imageWidth={imageWidth}
            index={i}
          />
        ))}
      </View>
    );
  }

  // Figcaption
  if (tag === 'figcaption') {
    return (
      <Text
        style={{
          fontSize: scale.small,
          lineHeight: scale.small * scale.lineHeight,
          color: isDark ? '#71717a' : '#a1a1aa',
          textAlign: 'center',
        }}
        selectable
      >
        {renderInline(children, scale, isDark)}
      </Text>
    );
  }

  // Horizontal rule
  if (tag === 'hr') {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: isDark ? '#3f3f46' : '#e4e4e7',
          marginVertical: 8,
        }}
      />
    );
  }

  // Image
  if (tag === 'img') {
    const src = attributes.src;
    if (!src) return null;

    const rawW = parseInt(attributes.width, 10);
    const rawH = parseInt(attributes.height, 10);
    const aspect = rawW && rawH ? rawW / rawH : 16 / 9;
    const displayWidth = Math.min(imageWidth, rawW || imageWidth);
    const displayHeight = displayWidth / aspect;

    return (
      <Image
        source={{ uri: src }}
        style={{
          width: displayWidth,
          height: displayHeight,
          borderRadius: 8,
          alignSelf: 'center',
        }}
        contentFit="cover"
        alt={attributes.alt || ''}
      />
    );
  }

  // Div or other block — recurse
  if (BLOCK_TAGS.has(tag)) {
    return (
      <View>
        {children.map((child, i) => (
          <RenderBlock
            key={i}
            node={child}
            scale={scale}
            isDark={isDark}
            imageWidth={imageWidth}
            index={i}
          />
        ))}
      </View>
    );
  }

  // Inline element at block level — wrap in Text
  return (
    <Text
      style={{
        fontSize: scale.body,
        lineHeight: scale.body * scale.lineHeight,
        color: isDark ? '#d4d4d8' : '#3f3f46',
      }}
      selectable
    >
      {renderInline([node], scale, isDark)}
    </Text>
  );
}

export function HtmlContent({ html }: HtmlContentProps) {
  const { settings } = useSettings();
  const scale = FONT_SCALES[settings.fontSize];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const contentWidth = width - 32; // account for page padding

  const nodes = parseHtml(html);

  return (
    <View style={{ gap: 16 }}>
      {nodes.map((node, i) => (
        <RenderBlock
          key={i}
          node={node}
          scale={scale}
          isDark={isDark}
          imageWidth={contentWidth}
          index={i}
        />
      ))}
    </View>
  );
}
