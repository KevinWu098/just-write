import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Button({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof BaseButton>) {
    return (
        <BaseButton className={cn("cursor-pointer", className)} {...props} />
    );
}

