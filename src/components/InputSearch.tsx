import { useState } from "react";
import IconButton from "./IconButton";

export default function InputSearch({
  onSearch,
}: {
  onSearch: (value: string | null) => void;
}) {
  const [search, setSearch] = useState<string | null>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  return (
    <div className="flex items-center pr-2 w-full h-12 bg-white rounded-[12px] border-[#D1D5E4] border-[1px] max-w-[360px]">
      <input
        value={search || ""}
        type="text"
        placeholder="Buscar"
        className="w-full h-full px-4 bg-transparent border-none focus:outline-none"
        onChange={(e) => {
          setSearch(e.target.value);
          setSubmitted(false);
        }}
      />
      {!submitted && (
        <IconButton
          icon="search"
          onClick={() => {
            onSearch(search || "");
            setSubmitted(true);
          }}
        />
      )}
      {submitted && (
        <IconButton
          icon="close"
          onClick={() => {
            onSearch(null);
            setSubmitted(false);
            setSearch(null);
          }}
        />
      )}
    </div>
  );
}
