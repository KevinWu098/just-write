"use client";

import { memo, useEffect, useMemo } from "react";

import type { Editor, Extensions } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";

import { cn, isIOS } from "@/lib/utils";
import { EditorToolbar } from "@/components/editor-toolbar";
import { scrollCursorIntoView } from "@/components/writing-editor/utils";
import { writingEditorExtensions } from "@/components/writing-editor/writing-editor-extensions";

interface WritingEditorProps {
    isLocked: boolean;
    initialContent?: unknown;
    onContentChange?: (content: unknown, wordCount: number) => void;
    syncExtension?: Extensions[number];
    onEditorReady?: (editor: Editor) => void;
    hasFooter?: boolean;
}

export const WritingEditor = memo(function WritingEditor({
    isLocked,
    initialContent,
    onContentChange,
    syncExtension,
    onEditorReady,
    hasFooter,
}: WritingEditorProps) {
    const isIos = useMemo(() => isIOS(), []);

    const editor = useEditor({
        extensions: syncExtension
            ? [...writingEditorExtensions, syncExtension]
            : writingEditorExtensions,
        content: initialContent ?? { type: "doc", content: [] },
        editorProps: {
            attributes: {
                class: cn(
                    "min-h-full text-lg leading-relaxed outline-none md:text-xl",
                    isIOS() && "input--focused"
                ),
            },
        },
        editable: !isLocked,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
        onFocus: ({ editor }) => {
            if (isIos) {
                scrollCursorIntoView(editor, true);
            }
        },
        onUpdate: ({ editor }) => {
            scrollCursorIntoView(editor);

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

    useEffect(() => {
        if (editor && !isLocked) {
            queueMicrotask(() => {
                const pos = editor.state.doc.content.size;
                editor.commands.setTextSelection({ from: pos, to: pos });
            });
        }
    }, [editor, isIos, isLocked]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!isLocked);
        }
    }, [editor, isLocked]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex h-[calc(100dvh-48px)] min-h-[calc(100dvh-48px)] flex-col">
            <EditorToolbar
                editor={editor}
                isLocked={isLocked}
            />

            <div className="relative h-0 grow">
                <div className="flex h-full max-h-full overflow-auto">
                    <div
                        className={cn(
                            "mx-auto w-full max-w-3xl flex-1 cursor-text",
                            isLocked && "cursor-not-allowed"
                        )}
                        onClick={(e) => {
                            if (!isLocked && e.target === e.currentTarget) {
                                editor.commands.focus();
                            }
                        }}
                    >
                        <EditorContent
                            editor={editor}
                            className={cn(
                                "h-full min-h-fit w-full p-4",
                                hasFooter ? "pb-16 md:pb-16" : "md:pb-16",
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
