import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { isIOS } from "@/lib/utils";

export interface BottomSpacerOptions {
    lines: number;
    onlyIOS: boolean;
    onlyWhenFocused: boolean;
}

export const BottomSpacer = Extension.create<BottomSpacerOptions>({
    name: "bottomSpacer",

    addOptions() {
        return {
            lines: 5,
            onlyIOS: false,
            onlyWhenFocused: false,
        };
    },

    addProseMirrorPlugins() {
        const { editor } = this;
        const options = this.options;

        return [
            new Plugin({
                key: new PluginKey("bottomSpacer"),
                props: {
                    decorations: (state) => {
                        // Check conditions
                        if (options.onlyIOS && !isIOS()) {
                            return DecorationSet.empty;
                        }

                        if (options.onlyWhenFocused && !editor.isFocused) {
                            return DecorationSet.empty;
                        }

                        const spacer = document.createElement("div");
                        spacer.style.height = `${options.lines * 3.3125}em`;
                        spacer.style.pointerEvents = "auto";
                        spacer.style.opacity = "0";
                        spacer.style.cursor = "text";

                        // Handle clicks on the spacer to focus at the end
                        spacer.addEventListener("mousedown", (e) => {
                            e.preventDefault();
                            editor.view.dom.blur();
                            editor.commands.focus("end");
                        });

                        return DecorationSet.create(state.doc, [
                            Decoration.widget(state.doc.content.size, spacer, {
                                side: 1,
                            }),
                        ]);
                    },
                },
            }),
        ];
    },
});
