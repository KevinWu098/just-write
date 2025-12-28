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
    // Check if running on iOS
    const isIOS = () => {
        return (
            typeof window !== "undefined" &&
            (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" &&
                    navigator.maxTouchPoints > 1))
        );
    };

    // Helper function to check if cursor is approaching the bottom of the viewport
    const isCursorNearBottom = (editor: Editor): boolean => {
        const { view } = editor;
        const { state } = view;
        const { selection } = state;

        // Get the DOM coordinates of the cursor
        const coords = view.coordsAtPos(selection.from);

        // Find the scrollable container
        const container = view.dom.closest(".overflow-auto");

        if (container && coords) {
            const containerRect = container.getBoundingClientRect();
            const cursorRelativePosition = coords.top - containerRect.top;
            // Scroll if cursor is in the bottom of the viewport (before it leaves)
            const threshold = containerRect.height * 0.75;

            return cursorRelativePosition > threshold;
        }

        return false;
    };

    // Helper function to scroll cursor into view smoothly
    const scrollCursorIntoView = (
        editor: Editor,
        forceScroll: boolean = false
    ) => {
        // If not forcing scroll, check if cursor is near the bottom of viewport
        if (!forceScroll && !isCursorNearBottom(editor)) return;

        // Wait for the opacity animation to complete (0.01s)
        setTimeout(() => {
            const { view } = editor;
            const { state } = view;
            const { selection } = state;

            // Get the DOM coordinates of the cursor
            const coords = view.coordsAtPos(selection.from);

            // Find the scrollable container
            const container = view.dom.closest(".overflow-auto");

            if (container && coords) {
                const containerRect = container.getBoundingClientRect();
                const scrollTop = container.scrollTop;

                // Calculate the position to scroll to
                const targetScrollTop =
                    coords.top -
                    containerRect.top +
                    scrollTop -
                    containerRect.height * (isIOS() ? 0.33 : 0.85);

                container.scrollTo({
                    top: targetScrollTop,
                    behavior: "auto",
                });
            }
        }, 20); // Slightly longer than the 0.01s animation
    };

    const editor = useEditor({
        extensions: syncExtension
            ? [...editorExtensions, syncExtension]
            : editorExtensions,
        content: initialContent ?? { type: "doc", content: [] },
        editorProps: {
            attributes: {
                class: "outline-none min-h-full text-lg md:text-xl leading-relaxed input--focused",
            },
        },
        editable: !isLocked,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            editor.commands.focus("start");
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
        onFocus: ({ editor }) => {
            scrollCursorIntoView(editor, true);
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
                <div className="flex h-full max-h-full overflow-auto">
                    <div
                        className={cn(
                            "input--focused mx-auto w-full max-w-3xl flex-1 cursor-text",
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
                                "min-h-full w-full p-4 md:pb-16",
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
