export interface SearchResultBook {
    id: number;
    name: string;
    author: string;
    coverImage: string;
    description: string;
    status: string;
    shelves: { id: number; name: string }[];
    inLibrary: boolean;
}
