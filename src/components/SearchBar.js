import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginBottom: "20px" }}>
      <input type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: "8px", width: "300px" }} />
    </form>
  );
}
