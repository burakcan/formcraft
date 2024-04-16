import { createApi } from "unsplash-js";

export const unsplash = createApi({
  apiUrl: `${process.env.NEXT_PUBLIC_URL}/api/unsplash`,
});
