export interface BookDetail {
    id: number;
    name: string;
    author: string;
    coverImage: string;
    description: string;
    pages: number;
    progressPercentage: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    shelves: { id: number; name: string }[];
    inLibrary: boolean;
}
