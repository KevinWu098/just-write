"use client";

import { memo, useEffect } from "react";

import { Strike } from "@tiptap/extension-strike";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

import { EditorToolbar } from "./editor-toolbar";

interface WritingEditorProps {
    isLocked: boolean;
    onContentChange: (content: string, wordCount: number) => void;
}

export const WritingEditor = memo(function WritingEditor({
    isLocked,
    onContentChange,
}: WritingEditorProps) {
    const editor = useEditor({
        extensions: [
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
                        "Mod-Shift-s": () =>
                            this.editor.commands.toggleStrike(),
                    };
                },
            }),
            Underline,
            Typography.configure({
                oneHalf: false,
                oneQuarter: false,
                threeQuarters: false,
                emDash: true,
                ellipsis: true,
                openDoubleQuote: true,
                closeDoubleQuote: true,
                openSingleQuote: true,
                closeSingleQuote: true,
                leftArrow: true,
                rightArrow: true,
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "outline-none min-h-full text-lg md:text-xl leading-relaxed",
            },
        },
        editable: !isLocked,
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            editor.commands.focus("end");
        },
        onUpdate: ({ editor }) => {
            const text = editor.getText();
            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
            onContentChange(text, wordCount);
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(!isLocked);
        }
    }, [isLocked, editor]);

    useEffect(() => {
        if (!isLocked && editor) {
            editor.commands.focus("end");
        }
    }, [isLocked, editor]);

    if (!editor) {
        return (
            <div className="flex flex-1 flex-col">
                <div className="bg-background/80 border-border sticky top-[65px] z-10 border-b backdrop-blur-sm">
                    <div className="mx-auto max-w-3xl px-4 py-2">
                        <div className="h-9" />
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <div className="min-h-full text-lg leading-relaxed opacity-50 outline-none md:text-xl">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-1 flex-col">
            <div className="sticky top-[65px] z-10">
                <EditorToolbar
                    editor={editor}
                    isLocked={isLocked}
                />
            </div>
            <div className="mx-auto w-full max-w-3xl flex-1 p-4 md:p-6 lg:p-8">
                <EditorContent
                    editor={editor}
                    className={cn(
                        isLocked && "cursor-not-allowed opacity-75 select-none"
                    )}
                    style={{
                        fontFeatureSettings: "'liga' 1, 'calt' 1",
                        WebkitFontSmoothing: "antialiased",
                    }}
                />
            </div>
        </div>
    );
});
