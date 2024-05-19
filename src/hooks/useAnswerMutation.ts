import { useMutation } from "@tanstack/react-query";

export function useAnswerMutation(submissionId?: string, pageId?: string) {
  const mutation = useMutation({
    mutationKey: ["answer", submissionId, pageId],
    mutationFn: async (data: FormCraft.CraftSubmissionData) => {
      if (!submissionId) {
        return;
      }

      const response = await fetch(`/api/submission/${submissionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log("Error submitting answer", response);
        throw new Error("Network response was not ok");
      }

      return response.json();
    },

    scope: {
      id: submissionId || "preview",
    },
  });

  return mutation;
}
