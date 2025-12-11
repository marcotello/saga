export interface MonthlyBook {
  month: string;
  booksRead: number;
}

export interface UserStatistics {
  userId: number;
  readBooks: number;
  totalPages: number;
  monthlyBooks: MonthlyBook[];
}

