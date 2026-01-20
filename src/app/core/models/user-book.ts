export interface UserBook {
    id: number;
    name: string;
    author: string;
    coverImage: string;
    progressPercentage: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    genreId: number;
    status: string;
    shelves: { id: number; name: string }[];
}