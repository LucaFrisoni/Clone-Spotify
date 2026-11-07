"use client";
import useDebounce from "@/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import qs from "query-string";
import Input from "../Input";

const SearchInput = () => {
  const router = useRouter();
  const currentTitle = useSearchParams().get("title") ?? "";
  const [value, setValue] = useState<string>(currentTitle);
  const debouncedValue = useDebounce<string>(value, 300);

  useEffect(() => {
    if (debouncedValue === currentTitle) {
      return;
    }

    const query = {
      title: debouncedValue,
    };
    const url = qs.stringifyUrl({
      url: "/search",
      query: query,
    });

    router.replace(url)
  }, [currentTitle,debouncedValue,router]);

  return <Input placeholder="What song do you want to listen to ?" value={value} onChange={(e)=>{ setValue(e.target.value)}}/>;
};

export default SearchInput;
