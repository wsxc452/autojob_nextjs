"use client";

import { useState } from "react";
import RecordList from "./components/List";
import SearchForm from "./components/SearchForm";

function RecordPage() {
  const [searchForm, setSearchForm] = useState({});

  return (
    <div>
      <SearchForm searchForm={searchForm} setSearchForm={setSearchForm} />
      <RecordList searchForm={searchForm} isReferrer={true} />
    </div>
  );
}

export default RecordPage;
