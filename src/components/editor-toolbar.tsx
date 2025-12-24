"use client";

import type React from "react";

import type { Editor } from "@tiptap/react";
import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    Strikethrough,
    Underline,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
    editor: Editor;
    isLocked: boolean;
}

export function EditorToolbar({ editor, isLocked }: EditorToolbarProps) {
    if (isLocked) return null;

    const ToolbarButton = ({
        onClick,
        isActive,
        icon: Icon,
        label,
        shortcut,
    }: {
        onClick: () => void;
        isActive: boolean;
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        shortcut?: string;
    }) => (
        <Button
            type="button"
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                "rounded-md p-2 transition-colors",
                "hover:bg-muted",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive && "bg-muted text-foreground",
                !isActive && "text-muted-foreground"
            )}
            aria-label={label}
            title={shortcut ? `${label} (${shortcut})` : label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="border-border bg-background/80 w-full border-b backdrop-blur-sm">
            <div className="mx-auto flex max-w-3xl items-center gap-1 overflow-x-auto px-4 py-2">
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
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
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
                <div className="bg-border mx-1 h-6 w-px" />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                    icon={Heading1}
                    label="Heading 1"
                    shortcut="⌘⌥1"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    icon={Heading2}
                    label="Heading 2"
                    shortcut="⌘⌥2"
                />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 3 })}
                    icon={Heading3}
                    label="Heading 3"
                    shortcut="⌘⌥3"
                />
                <div className="bg-border mx-1 h-6 w-px" />
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    icon={List}
                    label="Bullet List"
                    shortcut="⌘⇧8"
                />
            </div>
        </div>
    );
}
