"use client";

import { useState } from "react";
import SearchList from "./components/List";
import SearchForm from "./components/SearchForm";

function SearchPage() {
  const [searchForm, setSearchForm] = useState({});

  return (
    <div>
      <SearchForm searchForm={searchForm} setSearchForm={setSearchForm} />
      <SearchList searchForm={searchForm} />
    </div>
  );
}

export default SearchPage;
