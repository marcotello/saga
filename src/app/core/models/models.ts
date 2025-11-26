export interface User {
    id: number;
    username: string;
    name: string;
    lastName: string;
    email: string;
    bio?: string | null;
    role: string;
    profilePicture: string;
  }