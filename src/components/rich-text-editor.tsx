'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = "Compose your message..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
      TextStyle,
      Color,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 dark:prose-invert',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
       

        <Button
  variant="ghost"
  size="sm"
  className={editor.isActive('bold') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleBold().run()}
>
  <Bold className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive('italic') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleItalic().run()}
>
  <Italic className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive('underline') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleUnderline().run()}
>
  <UnderlineIcon className="w-4 h-4" />
</Button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().setTextAlign('left').run()}
>
  <AlignLeft className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().setTextAlign('center').run()}
>
  <AlignCenter className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().setTextAlign('right').run()}
>
  <AlignRight className="w-4 h-4" />
</Button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive('bulletList') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleBulletList().run()}
>
  <List className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive('orderedList') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleOrderedList().run()}
>
  <ListOrdered className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  className={editor.isActive('blockquote') ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
  onClick={() => editor.chain().focus().toggleBlockquote().run()}
>
  <Quote className="w-4 h-4" />
</Button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

<Button
  variant="ghost"
  size="sm"
  onClick={addLink}
>
  <LinkIcon className="w-4 h-4" />
</Button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

<Button
  variant="ghost"
  size="sm"
  onClick={() => editor.chain().focus().undo().run()}
>
  <Undo className="w-4 h-4" />
</Button>

<Button
  variant="ghost"
  size="sm"
  onClick={() => editor.chain().focus().redo().run()}
>
  <Redo className="w-4 h-4" />
</Button>

      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] max-h-[400px] overflow-y-auto"
        placeholder={placeholder}
      />
    </div>
  );
}