import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Node as TiptapNode, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo,
    Image as ImageIcon
} from 'lucide-react';

// -- Resizable Image Node --

interface ResizableImageComponentProps {
    node: {
        attrs: {
            src: string;
            alt?: string;
            title?: string;
            width?: number | string;
        };
    };
    updateAttributes: (attrs: Record<string, unknown>) => void;
}

type ResizeDirection = 'right' | 'left';

const ResizableImageComponent: React.FC<ResizableImageComponentProps> = ({
    node,
    updateAttributes,
}) => {
    const imgRef     = useRef<HTMLImageElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Semua state pakai ref agar tidak trigger re-render saat drag
    const isActiveRef   = useRef(false);
    const isResizingRef = useRef(false);
    const cleanupRef    = useRef<(() => void) | null>(null);

    // State hanya untuk UI visual
    const [isActive,   setIsActive]   = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [liveWidth,  setLiveWidth]  = useState<number | null>(null);

    // Cleanup SEMUA listener aktif - dipanggil dari mana saja
    const forceStopResize = useCallback(() => {
        if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
        }
        isResizingRef.current = false;
        document.body.style.cursor     = '';
        document.body.style.userSelect = '';
        setIsResizing(false);
        setLiveWidth(null);
    }, []);

    // Klik di luar wrapper → deactivate
    useEffect(() => {
        const onDocMouseDown = (e: MouseEvent) => {
            if (
                isActiveRef.current &&
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Element)
            ) {
                forceStopResize();
                isActiveRef.current = false;
                setIsActive(false);
            }
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, [forceStopResize]);

    // Safety net: jika mouse button tidak ditekan tapi resize masih aktif → stop
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            // buttons === 0 berarti tidak ada tombol mouse yang ditekan
            if (isResizingRef.current && e.buttons === 0) {
                forceStopResize();
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    }, [forceStopResize]);

    // Cleanup on unmount
    useEffect(() => {
        return () => forceStopResize();
    }, [forceStopResize]);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isResizingRef.current) return;
        const next = !isActiveRef.current;
        isActiveRef.current = next;
        setIsActive(next);
    };

    const startResize = (e: React.MouseEvent, dir: ResizeDirection) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isActiveRef.current) return;

        const startX = e.clientX;
        const startW = imgRef.current?.offsetWidth ?? 300;

        isResizingRef.current = true;
        setIsResizing(true);
        setLiveWidth(startW);
        document.body.style.cursor     = dir === 'left' ? 'w-resize' : 'e-resize';
        document.body.style.userSelect = 'none';

        const onMove = (mv: MouseEvent) => {
            mv.preventDefault();
            const dx  = mv.clientX - startX;
            const nw  = Math.max(80, dir === 'left' ? startW - dx : startW + dx);
            if (imgRef.current) imgRef.current.style.width = `${nw}px`;
            setLiveWidth(Math.round(nw));
        };

        const onUp = () => {
            const finalW = imgRef.current?.offsetWidth ?? startW;
            updateAttributes({ width: Math.round(finalW) });
            cleanup();
        };

        const cleanup = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup',   onUp);
            // Tambahan: visibilitychange & blur untuk handle tab-switch / alt-tab
            document.removeEventListener('visibilitychange', cleanup);
            window.removeEventListener('blur', cleanup);
            isResizingRef.current          = false;
            document.body.style.cursor     = '';
            document.body.style.userSelect = '';
            setIsResizing(false);
            setLiveWidth(null);
            cleanupRef.current = null;
        };

        // Simpan cleanup agar bisa dipanggil dari luar (forceStopResize)
        cleanupRef.current = cleanup;

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
        // Handle edge case: user alt-tab atau switch window saat drag
        document.addEventListener('visibilitychange', cleanup);
        window.addEventListener('blur', cleanup);
    };

    const width      = node.attrs.width;
    const widthStyle = width ? `${width}px` : 'auto';

    const EdgeHandle = ({ side, dir }: { side: 'left' | 'right'; dir: ResizeDirection }) => (
        <div
            onMouseDown={(e) => startResize(e, dir)}
            style={{
                position:        'absolute',
                top: 0, bottom:  0,
                [side]:          0,
                width:           '14px',
                cursor:          dir === 'left' ? 'w-resize' : 'e-resize',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                zIndex:          10,
                opacity:         isActive ? 1 : 0,
                transition:      'opacity 0.15s ease',
                borderRadius:    side === 'left' ? '6px 0 0 6px' : '0 6px 6px 0',
                background:      isResizing
                    ? 'rgba(37,99,235,0.20)'
                    : 'rgba(27,38,59,0.12)',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '3px', height: '3px',
                        borderRadius: '50%',
                        background: isResizing ? '#2563eb' : '#1B263B',
                        opacity: 0.75,
                    }} />
                ))}
            </div>
        </div>
    );

    return (
        <div
            ref={wrapperRef}
            style={{ display: 'inline-block', position: 'relative', lineHeight: 0 }}
        >
            <img
                ref={imgRef}
                src={node.attrs.src}
                alt={node.attrs.alt ?? ''}
                title={node.attrs.title ?? ''}
                onClick={handleImageClick}
                style={{
                    width:         widthStyle,
                    height:        'auto',
                    display:       'block',
                    maxWidth:      '100%',
                    userSelect:    'none',
                    outline:       isActive
                        ? isResizing ? '2px solid #2563eb' : '2px solid #1B263B'
                        : 'none',
                    outlineOffset: '2px',
                    borderRadius:  '6px',
                    cursor:        isActive ? 'default' : 'pointer',
                    boxShadow:     '0 1px 4px rgba(0,0,0,0.10)',
                    transition:    'outline 0.1s',
                }}
                draggable={false}
            />

            {isActive && (
                <>
                    <EdgeHandle side="left"  dir="left"  />
                    <EdgeHandle side="right" dir="right" />

                    {isResizing && liveWidth !== null && (
                        <div style={{
                            position:      'absolute',
                            top:           '-30px',
                            left:          '50%',
                            transform:     'translateX(-50%)',
                            display:       'flex',
                            alignItems:    'center',
                            gap:           '5px',
                            background:    '#1B263B',
                            color:         'white',
                            fontSize:      '11px',
                            fontWeight:    600,
                            padding:       '3px 10px',
                            borderRadius:  '5px',
                            whiteSpace:    'nowrap',
                            pointerEvents: 'none',
                            zIndex:        20,
                            boxShadow:     '0 2px 8px rgba(0,0,0,0.25)',
                        }}>
                            <span style={{ opacity: 0.65, fontSize: '10px' }}>↔</span>
                            {liveWidth}px
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// -- Custom Tiptap Node --
const ResizableImage = TiptapNode.create({
    name: 'resizableImage',
    group: 'inline',
    inline: true,
    draggable: true,
    selectable: true,
    atom: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: '' },
            title: { default: '' },
            width: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: 'img[src]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ({ node, updateAttributes }: any) => {
            const container = document.createElement('span');
            container.style.display = 'inline-block';
            container.style.lineHeight = '0';

            let reactRoot: any;

            const renderComponent = () => {
                import('react-dom/client').then(({ createRoot }) => {
                    if (!reactRoot) {
                        reactRoot = createRoot(container);
                    }
                    reactRoot.render(
                        React.createElement(ResizableImageComponent, {
                            node,
                            updateAttributes,
                        })
                    );
                });
            };

            renderComponent();

            return {
                dom: container,
                update(updatedNode: any) {
                    if (updatedNode.type !== node.type) return false;
                    Object.assign(node, updatedNode);
                    renderComponent();
                    return true;
                },
                destroy() { setTimeout(() => reactRoot?.unmount(), 0); },
            };
        };
    },
});

// -- MenuBar --
interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onFileUpload?: (file: File) => void;
}

const MenuBar = ({ editor, onFileUpload }: { editor: any; onFileUpload?: (file: File) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Url = event.target?.result as string;
                    editor.chain().focus().insertContent({
                        type: 'resizableImage',
                        attrs: { src: base64Url },
                    }).run();
                };
                reader.readAsDataURL(file);
            }
            if (onFileUpload) onFileUpload(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-border bg-slate-50 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('strike') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Numbered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-md hover:bg-slate-200 transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 text-navy' : 'text-slate-600'}`}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>

            {onFileUpload && (
                <>
                    <div className="w-px h-6 bg-slate-300 mx-1" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 rounded-md hover:bg-slate-200 transition-colors text-slate-600 flex items-center gap-1 px-2"
                        title="Insert Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">Gambar</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </>
            )}
        </div>
    );
};

// -- Main Component --

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    onFileUpload,
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ResizableImage,
        ],
        content: value,
        onUpdate: ({ editor }: { editor: any }) => {
            // Cek apakah kontennya kosong atau berisi elemen kosong, return HTML atau empty string
            const html = editor.getHTML();
            if (html === '<p></p>') {
                onChange('');
            } else {
                onChange(html);
            }
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm sm:prose-base focus:outline-none min-h-[200px] max-w-none p-4 w-full h-full text-slate-800',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === '' && editor.getHTML() !== '<p></p>') {
                editor.commands.setContent(value);
            } else if (value !== '') {
                editor.commands.setContent(value, false);
            }
        }
    }, [value, editor]);

    return (
        <div className="border border-slate-border rounded-lg bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-navy focus-within:border-navy transition-all duration-200">
            <MenuBar editor={editor} onFileUpload={onFileUpload} />
            <div className="bg-white min-h-[200px]">
                <EditorContent editor={editor} />
            </div>
            <style>{`
                .ProseMirror p { margin-bottom: 1em; }
                .ProseMirror h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: #1B263B; }
                .ProseMirror h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; color: #1B263B; }
                .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
                .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
                .ProseMirror blockquote { border-left: 4px solid #E2E8F0; padding-left: 1em; color: #64748B; font-style: italic; }
                .ProseMirror ul p, .ProseMirror ol p { margin-bottom: 0; }
                .resizable-image-wrapper { position: relative; display: inline-block; }
                .resizable-image-wrapper:hover > div[style*="opacity: 0"] { opacity: 1 !important; }
            `}</style>
        </div>
    );
};
