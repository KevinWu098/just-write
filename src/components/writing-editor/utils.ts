import type { Editor } from "@tiptap/react";

import { isIOS } from "@/lib/utils";

export const isCursorNearBottom = (editor: Editor): boolean => {
    const { view } = editor;
    const { state } = view;
    const { selection } = state;

    const coords = view.coordsAtPos(selection.from);
    const container = view.dom.closest(".overflow-auto");

    if (container && coords) {
        const containerRect = container.getBoundingClientRect();
        const cursorRelativePosition = coords.top - containerRect.top;

        const threshold = containerRect.height * (isIOS() ? 0.25 : 0.75);

        return cursorRelativePosition > threshold;
    }

    return false;
};

export const scrollCursorIntoView = (
    editor: Editor,
    forceScroll: boolean = false
) => {
    if (!forceScroll && !isCursorNearBottom(editor)) {
        return;
    }

    setTimeout(() => {
        const { view } = editor;
        const { state } = view;
        const { selection } = state;

        const coords = view.coordsAtPos(selection.from);
        const container = view.dom.closest(".overflow-auto");

        if (container && coords) {
            const containerRect = container.getBoundingClientRect();
            const scrollTop = container.scrollTop;

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
    }, 20); // Slightly longer than the 0.05s animation in `globals.css`
};
