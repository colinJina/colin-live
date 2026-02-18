/* eslint-disable react-hooks/immutability */
// DrawerContext.tsx
import { Drawer } from 'antd';
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react';
import { App } from 'antd';
interface DrawerContextType {
    openDrawer: (content: ReactNode | string) => void;
    closeDrawer: () => void;
    showMessage: () => void;
    drawerContent: ReactNode | null;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

const decodeHtml = (html: string) => {
    if (!html) return '';

    try {
        return decodeHtmlRecursive(html, 0);
    } catch {
        return html;
    }
};

const decodeHtmlRecursive = (html: string, level = 0): string => {
    if (level >= 10) return html;

    let result = html
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    const textarea = document.createElement('textarea');
    textarea.innerHTML = result;
    result = textarea.value;

    const entities = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&amp;': '&',
        '&#34;': '"',
    };

    Object.entries(entities).forEach(([entity, replacement]) => {
        result = result.replace(new RegExp(entity, 'g'), replacement);
    });

    if (result === html || !/&[a-z]+;|&#\d+;/i.test(result)) {
        return result;
    }

    return decodeHtmlRecursive(result, level + 1);
};

const hasHtml = (str: string): boolean => {
    if (!str) return false;

    const patterns = [
        /<img[^>]*>/i,
        /<p[^>]*>/i,
        /<div[^>]*>/i,
        /<span[^>]*>/i,
        /<a[^>]*>/i,
        /<table[^>]*>/i,
        /<[a-z][^>]*>/i,
    ];

    return patterns.some((pattern) => pattern.test(str));
};

const isUrl = (str: string): boolean => /^https?:\/\/\S+/i.test(str.trim());

const fixEncodedTags = (content: string): string => {
    if (!content) return '';

    try {
        const replacements = [
            { from: '&lt;p&gt;', to: '<p>' },
            { from: '&lt;/p&gt;', to: '</p>' },
            { from: '&lt;img', to: '<img' },
            { from: '&lt;br&gt;', to: '<br>' },
            { from: '&lt;br/&gt;', to: '<br/>' },
            { from: '&lt;br /&gt;', to: '<br />' },
            { from: '&gt;', to: '>' },
            { from: '&#34;', to: '"' },
            { from: '&quot;', to: '"' },
            { from: '&#39;', to: "'" },
            { from: '&amp;', to: '&' },
        ];

        return replacements.reduce(
            (acc, { from, to }) => acc.replace(new RegExp(from, 'g'), to),
            content,
        );
    } catch {
        return content;
    }
};

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a DrawerProvider');
    }
    return context;
};

export function DrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState<ReactNode | null>(null);
    const { message } = App.useApp();

    const showMessage = () => {
        message.success('Success!');
    };

    const getText = useCallback((node: React.ReactElement): string | null => {
        try {
            const props = node.props as Record<string, any>;
            if (!props?.children) return null;

            const { children } = props;

            // 字符串直接返回
            if (typeof children === 'string') return children;

            // 处理数组
            if (Array.isArray(children)) {
                // 尝试找纯文本
                const text = children.find((child) => typeof child === 'string');
                if (text) return text;

                // 递归处理元素
                let extracted = null;
                children.some((child) => {
                    if (React.isValidElement(child)) {
                        extracted = getText(child);
                        return !!extracted;
                    }
                    return false;
                });

                if (extracted) return extracted;
            }
            // 递归处理单个元素
            else if (React.isValidElement(children)) {
                return getText(children);
            }

            // 检查innerHTML

            const html = props.dangerouslySetInnerHTML?.__html;
            if (html) return html;

            return null;
        } catch {
            return null;
        }
    }, []);

    const openDrawer = useCallback(
        (content: ReactNode | string) => {
            // 处理React元素
            if (React.isValidElement(content)) {
                const text = getText(content);
                if (text) {
                    openDrawer(text);
                    return;
                }

                setContent(content);
                setOpen(true);
                return;
            }

            // 处理字符串内容
            if (typeof content === 'string') {
                let text = decodeHtml(content);

                // 处理编码的HTML标签
                if (text.includes('&lt;') || text.includes('src=&#34;')) {
                    text = fixEncodedTags(text);
                }

                // 根据内容类型生成不同展示
                if (isUrl(text)) {
                    // URL类型
                    const isNotion = text.includes('notion.so') || text.includes('notion.site');
                    setContent(
                        <div className="h-full w-full p-4">
                            {isNotion && <p className="mb-4">此内容位于Notion，点击链接查看：</p>}
                            <a
                                href={text.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 underline"
                            >
                                {text.trim()}
                            </a>
                        </div>,
                    );
                } else if (
                    hasHtml(text) ||
                    text.includes('<img') ||
                    text.toLowerCase().includes('src=')
                ) {
                    // HTML内容
                    try {
                        setContent(
                            <div className="h-full w-full p-4">
                                <div
                                    className="prose prose-sm prose-img:rounded prose-img:my-4 max-w-none whitespace-pre-wrap break-words"
                                    dangerouslySetInnerHTML={{ __html: text }}
                                />
                            </div>,
                        );
                    } catch {
                        setContent(
                            <div className="h-full w-full p-4">
                                <div className="text-red-500 whitespace-pre-wrap break-words">
                                    <p className="mb-4">渲染失败，原始内容：</p>
                                    {content}
                                </div>
                            </div>,
                        );
                    }
                } else {
                    // 纯文本
                    setContent(
                        <div className="h-full w-full p-4">
                            <div className="whitespace-pre-wrap break-words">{text}</div>
                        </div>,
                    );
                }
            } else {
                setContent(content);
            }

            setOpen(true);
        },
        [getText],
    );

    const closeDrawer = useCallback(() => {
        setOpen(false);
        setTimeout(() => setContent(null), 300);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) closeDrawer();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, closeDrawer]);

    return (
        <DrawerContext.Provider
            value={{ openDrawer, closeDrawer, showMessage, drawerContent: content }}
        >
            {children}
            <Drawer
                title="功能说明"
                open={open}
                onClose={closeDrawer}
                size={600}
                styles={{ body: { padding: 0 } }}
                destroyOnClose
                className="content-drawer"
            >
                <style>
                    {`
            .content-drawer .ant-drawer-body img {
              max-width: 100% !important;
              height: auto !important;
              border-radius: 4px;
              margin: 16px 0;
              display: block;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .content-drawer .ant-drawer-body p {margin-bottom: 16px; line-height: 1.6;}
            .content-drawer .ant-drawer-body a {color: #1890ff; text-decoration: none;}
            .content-drawer .ant-drawer-body a:hover {color: #40a9ff; text-decoration: underline;}
            .content-drawer .prose img {
              max-width: 100% !important;
              height: auto !important;
              margin: 16px 0;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              display: block;
            }
            .content-drawer .prose {font-size: 14px; line-height: 1.8;}
            .content-drawer .ant-drawer-body {padding: 0; overflow-x: hidden;}
            .content-drawer .prose h1,
            .content-drawer .prose h2,
            .content-drawer .prose h3 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
            }
          `}
                </style>
                {content}
            </Drawer>
        </DrawerContext.Provider>
    );
}
