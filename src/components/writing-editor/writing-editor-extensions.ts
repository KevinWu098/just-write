import Strike from "@tiptap/extension-strike";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";

export const writingEditorExtensions = [
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
