/* eslint-disable @next/next/no-img-element */
import { debounce } from "lodash";
import { CheckIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { BackgroundImage } from "@/lib/craftPageConfig/theming";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { unsplash } from "@/services/unsplash";

type SearchResults = Awaited<
  ReturnType<typeof unsplash.search.getPhotos>
>["response"];

interface Props {
  currentValue?: BackgroundImage;
  onImageSelect: (backgroundImage: BackgroundImage) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function UnsplashTab(props: Props) {
  const { onImageSelect, onCancel, onSave, currentValue } = props;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const debounced = debounce(
      async () => {
        if (!search) return;

        setLoading(true);

        const result = await unsplash.search.getPhotos({
          query: search,
          page: page,
          perPage: 16,
        });

        if (!result.response) return;

        setSearchResults(result.response);
        setLoading(false);
      },
      500,
      {
        leading: false,
        trailing: true,
      }
    );

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [page, search]);

  return (
    <TabsContent value="unsplash" asChild>
      <div>
        <div className="flex justify-stretch gap-2">
          <div className="relative flex-1">
            <Input
              autoFocus
              placeholder="Search Unsplash"
              value={search}
              onChange={handleInputChange}
            />
            <SearchIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 size-4" />
          </div>
          <div className="flex-none flex gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Accept
              <CheckIcon className="ml-2 size-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-9rem)]">
          {loading && (
            <div className="grid grid-cols-4 gap-2 py-4 px-1">
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 bg-gray-200 animate-pulse rounded-md border"
                ></div>
              ))}
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-4 gap-2 py-4 px-1">
              {searchResults?.results.map((photo) => (
                <figure
                  className={cn(
                    "group relative h-32 overflow-hidden bg-gray-200 cursor-pointer rounded-md border",
                    {
                      ["ring-2"]: currentValue?.url === photo.urls.full,
                    }
                  )}
                  onClick={() =>
                    onImageSelect({
                      url: photo.urls.full,
                      blurHash: photo.blur_hash,
                      attribution: {
                        name: photo.user.name,
                        url: photo.user.links.html,
                      },
                    })
                  }
                  key={photo.id}
                  style={{
                    backgroundImage: `url(${photo.urls.small})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    src={photo.urls.small}
                    alt={
                      photo.alt_description || photo.description || "Unsplash"
                    }
                    className="hidden"
                  />
                  <figcaption className="hidden group-hover:block absolute bottom-0 left-0 right-0 p-2 text-white bg-black bg-opacity-40 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    <a
                      href={photo.user.links.html}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {photo.user.name}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          {Number(searchResults?.total_pages) > 1 && (
            <Pagination className="cursor-default">
              <PaginationContent>
                {page !== 1 && (
                  <PaginationItem onClick={() => setPage(page - 1)}>
                    <PaginationPrevious />
                  </PaginationItem>
                )}
                {page !== searchResults?.total_pages && (
                  <PaginationItem onClick={() => setPage(page + 1)}>
                    <PaginationNext />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </ScrollArea>
      </div>
    </TabsContent>
  );
}
