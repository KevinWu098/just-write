import { queryOptions } from "@tanstack/react-query";

import { getDocument } from "@/app/_actions/documents";

export function getDocumentOptions(id: string) {
    return queryOptions({
        queryKey: ["document", id],
        queryFn: async () => await getDocument(id),
    });
}
