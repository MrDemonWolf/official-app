export interface HtmlTextNode {
  type: 'text';
  content: string;
}

export interface HtmlElementNode {
  type: 'element';
  tag: string;
  attributes: Record<string, string>;
  children: HtmlNode[];
}

export type HtmlNode = HtmlTextNode | HtmlElementNode;

const SELF_CLOSING = new Set([
  'br',
  'hr',
  'img',
  'input',
  'meta',
  'link',
  'source',
  'wbr',
]);

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4];
  }
  return attrs;
}

interface Token {
  type: 'open' | 'close' | 'self-closing' | 'text' | 'comment';
  tag?: string;
  attributes?: Record<string, string>;
  content?: string;
}

function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < html.length) {
    const nextTag = html.indexOf('<', pos);

    if (nextTag === -1) {
      const text = html.slice(pos);
      if (text) tokens.push({ type: 'text', content: text });
      break;
    }

    if (nextTag > pos) {
      const text = html.slice(pos, nextTag);
      if (text) tokens.push({ type: 'text', content: text });
    }

    // Comment
    if (html.startsWith('<!--', nextTag)) {
      const endComment = html.indexOf('-->', nextTag + 4);
      pos = endComment === -1 ? html.length : endComment + 3;
      tokens.push({ type: 'comment' });
      continue;
    }

    const endBracket = html.indexOf('>', nextTag);
    if (endBracket === -1) {
      tokens.push({ type: 'text', content: html.slice(nextTag) });
      break;
    }

    const tagContent = html.slice(nextTag + 1, endBracket);
    pos = endBracket + 1;

    if (tagContent.startsWith('/')) {
      const tag = tagContent.slice(1).trim().toLowerCase().split(/\s/)[0];
      tokens.push({ type: 'close', tag });
    } else {
      const selfClose = tagContent.endsWith('/');
      const cleaned = selfClose ? tagContent.slice(0, -1).trim() : tagContent.trim();
      const spaceIdx = cleaned.search(/\s/);
      const tag = (spaceIdx === -1 ? cleaned : cleaned.slice(0, spaceIdx)).toLowerCase();
      const attrStr = spaceIdx === -1 ? '' : cleaned.slice(spaceIdx);
      const attributes = parseAttributes(attrStr);

      if (selfClose || SELF_CLOSING.has(tag)) {
        tokens.push({ type: 'self-closing', tag, attributes });
      } else {
        tokens.push({ type: 'open', tag, attributes });
      }
    }
  }

  return tokens;
}

export function parseHtml(html: string): HtmlNode[] {
  const tokens = tokenize(html);
  const root: HtmlNode[] = [];
  const stack: HtmlElementNode[] = [];

  function current(): HtmlNode[] {
    return stack.length > 0 ? stack[stack.length - 1].children : root;
  }

  for (const token of tokens) {
    switch (token.type) {
      case 'text': {
        const content = token.content!;
        if (content) {
          current().push({ type: 'text', content });
        }
        break;
      }
      case 'open': {
        const node: HtmlElementNode = {
          type: 'element',
          tag: token.tag!,
          attributes: token.attributes ?? {},
          children: [],
        };
        current().push(node);
        stack.push(node);
        break;
      }
      case 'close': {
        // Pop back to matching tag (handles implicit closes)
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].tag === token.tag) {
            stack.length = i;
            break;
          }
        }
        break;
      }
      case 'self-closing': {
        const node: HtmlElementNode = {
          type: 'element',
          tag: token.tag!,
          attributes: token.attributes ?? {},
          children: [],
        };
        current().push(node);
        break;
      }
      case 'comment':
        break;
    }
  }

  return root;
}
