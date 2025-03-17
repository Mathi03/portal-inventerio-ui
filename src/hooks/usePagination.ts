import { useState } from "react";

export default function usePagination() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(20);
  return {
    page,
    limit,
    setPage,
    setLimit,
  };
}
