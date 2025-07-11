import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { invalidateCraftsListingQuery } from "./useCraftsListingQuery";

export function useDuplicateCraftMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/form/${id}/duplicate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: (data: FormCraft.Craft) => {
      invalidateCraftsListingQuery(queryClient);

      toast.success("Form duplicated successfully!", {
        action: {
          label: "View",
          onClick: () => {
            router.push(`/form/${data.id}/edit`);
          },
        },
      });
    },
  });

  return mutation;
}
