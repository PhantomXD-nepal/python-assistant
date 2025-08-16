"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("topic", term);
    } else {
      params.delete("topic");
    }

    // Reset to first page when searching
    params.delete("page");

    router.replace(`?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search your companions..."
        defaultValue={searchParams.get("topic")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 w-80 bg-white border-gray-300 max-sm:w-full"
      />
    </div>
  );
};

export default SearchInput;
