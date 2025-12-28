"use client";

import { memo, useEffect } from "react";

import { Strike } from "@tiptap/extension-strike";
import Typography from "@tiptap/extension-typography";
import type { Editor, Extensions } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

import { EditorToolbar } from "./editor-toolbar";

interface WritingEditorProps {
    isLocked: boolean;
    initialContent?: unknown;
    onContentChange?: (content: unknown, wordCount: number) => void;
    syncExtension?: Extensions[number];
    onEditorReady?: (editor: Editor) => void;
}

// Export the extensions so they can be used elsewhere
export const editorExtensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
        strike: false,
    }),
    Strike.configure({
        HTMLAttributes: {
            class: "line-through",
        },
    }).extend({
        addKeyboardShortcuts() {
            return {
                "Mod-Shift-s": () => this.editor.commands.toggleStrike(),
            };
        },
    }),
    Typography.configure({
        oneHalf: false,
        oneQuarter: false,
        threeQuarters: false,
        emDash: "—",
        ellipsis: "…",
        openDoubleQuote: '"',
        closeDoubleQuote: '"',
        openSingleQuote: "'",
        closeSingleQuote: "'",
        leftArrow: "←",
        rightArrow: "→",
    }),
];

export const WritingEditor = memo(function WritingEditor({
    isLocked,
    initialContent,
    onContentChange,
    syncExtension,
    onEditorReady,
}: WritingEditorProps) {
    const editor = useEditor({
        extensions: syncExtension
            ? [...editorExtensions, syncExtension]
            : editorExtensions,
        content: initialContent ?? { type: "doc", content: [] },
        editorProps: {
            attributes: {
                class: "outline-none min-h-full text-lg md:text-xl leading-relaxed",
            },
            scrollThreshold: 200,
            scrollMargin: 200,
        },
        editable: !isLocked,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            editor.commands.focus("start");
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                const json = editor.getJSON();
                const text = editor.getText();
                const wordCount = text.trim()
                    ? text.trim().split(/\s+/).length
                    : 0;
                onContentChange(json, wordCount);
            }
        },
    });

    // Cleanup editor on unmount
    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!isLocked);
        }
    }, [isLocked, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex h-[calc(100dvh-49px)] min-h-[calc(100dvh-49px)] flex-col">
            <div className="h-12">
                <EditorToolbar
                    editor={editor}
                    isLocked={isLocked}
                />
            </div>

            <div className="relative h-0 grow">
                <div className="flex max-h-full overflow-auto">
                    <div
                        className={cn(
                            "mx-auto w-full max-w-3xl flex-1 cursor-text p-4 md:p-6 lg:p-8",
                            isLocked && "cursor-not-allowed"
                        )}
                        onClick={() => {
                            if (!isLocked) {
                                editor.commands.focus();
                            }
                        }}
                    >
                        <EditorContent
                            editor={editor}
                            className={cn(
                                "min-h-full",
                                isLocked &&
                                    "cursor-not-allowed opacity-75 select-none"
                            )}
                            style={{
                                fontFeatureSettings: "'liga' 1, 'calt' 1",
                                WebkitFontSmoothing: "antialiased",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
