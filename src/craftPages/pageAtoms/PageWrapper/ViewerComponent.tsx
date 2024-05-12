import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { PageNavigationViewer } from "../PageNavigation";
import { Form } from "@/components/ui/form";
import { craftPageDefinitions } from "@/craftPages";
import { useAnswerMutation } from "@/hooks/useAnswerMutation";
import { useHasScroll } from "@/hooks/useHasScroll";
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

export type FormValues<T extends FormCraft.CraftPage> = {
  value: z.infer<
    ReturnType<(typeof craftPageDefinitions)[T["type"]]["getViewerSchema"]>
  >;
};

interface ChildProps<T extends FormCraft.CraftPage> {
  form: ReturnType<typeof useForm<FormValues<T>>>;
  formDomId: string;
}

interface Props<T extends FormCraft.CraftPage> {
  innerWrapperClassName?: string;
  page: T;
  children: (props: ChildProps<T>) => React.ReactNode;
}

export function PageWrapperViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { page } = props;
  const ref = useRef<HTMLFormElement>(null);
  const { setReason: setPageChangeReson } = usePageChangeReason();
  const { onAnswer, submissionId, answers } = useViewCraftStore((state) => ({
    onAnswer: state.onAnswer,
    submissionId: state.submissionId,
    answers: state.answers,
  }));
  const mutation = useAnswerMutation(submissionId, page.id);
  const pageDefinition = craftPageDefinitions[page.type];
  const formDomId = `form_${page.id.replaceAll("-", "")}`;

  const getViewerSchema = pageDefinition.getViewerSchema as (
    page: T
  ) => ReturnType<typeof pageDefinition.getViewerSchema>;

  const answerSchema = getViewerSchema(page);

  const formSchema = z.object({
    value: answerSchema,
  });

  const form = useForm<FormValues<T>>({
    defaultValues: {
      value: answers[page.id]?.value,
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    setPageChangeReson("answer");

    requestAnimationFrame(() => {
      onAnswer(page.id, data.value);
    });

    mutation.mutate({
      [page.id]: {
        value: data.value,
        meta: {},
      },
    });
  });

  useEffect(() => {
    if (page.type === "end_screen" && mutation.isIdle) {
      mutation.mutate({
        end_screen: {
          value: true,
          meta: {},
        },
        ...answers,
      });
    }
  }, [page.type, answers, mutation]);

  const hasScroll = useHasScroll(ref, [page]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        id={formDomId}
        className={cn(
          "size-full flex flex-col items-center px-4 py-24 sm:p-16 break-before-all overflow-y-auto",
          { "justify-center": !hasScroll }
        )}
        ref={ref}
      >
        <div
          className={cn(
            "max-w-screen-md w-full mx-auto",
            props.innerWrapperClassName
          )}
        >
          {page.type === "end_screen" && mutation.isPending && (
            <div className="text-center mx-auto flex gap-4 items-center justify-center text-craft-title">
              <Loader2 className="size-8 animate-spin" />
              <div className="font-semibold text-sm">
                Submitting your answers...
              </div>
            </div>
          )}
          {(page.type !== "end_screen" || !mutation.isPending) &&
            props.children({ form, formDomId })}
        </div>
      </form>
      {page.type !== "end_screen" && <PageNavigationViewer form={formDomId} />}
    </Form>
  );
}
