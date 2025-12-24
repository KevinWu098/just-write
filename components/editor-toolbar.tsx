"use client"

import type React from "react"

import type { Editor } from "@tiptap/react"
import { Bold, Italic, Underline, Strikethrough, List, Heading1, Heading2, Heading3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
  editor: Editor
  isLocked: boolean
}

export function EditorToolbar({ editor, isLocked }: EditorToolbarProps) {
  if (isLocked) return null

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label,
    shortcut,
  }: {
    onClick: () => void
    isActive: boolean
    icon: React.ComponentType<{ className?: string }>
    label: string
    shortcut?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "p-2 rounded-md transition-colors",
        "hover:bg-muted",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive && "bg-muted text-foreground",
        !isActive && "text-muted-foreground",
      )}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  return (
    <div className="w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto max-w-3xl mx-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
          shortcut="⌘B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
          shortcut="⌘I"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={Underline}
          label="Underline"
          shortcut="⌘U"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          label="Strikethrough"
          shortcut="⌘⇧S"
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          label="Heading 1"
          shortcut="⌘⌥1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="Heading 2"
          shortcut="⌘⌥2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          label="Heading 3"
          shortcut="⌘⌥3"
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="Bullet List"
          shortcut="⌘⇧8"
        />
      </div>
    </div>
  )
}
