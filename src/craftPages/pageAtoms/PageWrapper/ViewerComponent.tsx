import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useAnswerMutation } from "@/hooks/useAnswerMutation";
import { useHasScroll } from "@/hooks/useHasScroll";
import { usePageChangeReason } from "@/hooks/usePageChangeReason";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";
import { cn } from "@/lib/utils";
import { PageNavigationViewer } from "../PageNavigation";
import { craftPageDefinitions } from "@/craftPages";

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
  const endScreenSubmitted = useRef(false);
  const { page } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);
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

    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }

    onAnswer(page.id, data.value);

    mutation.mutate({
      [page.id]: {
        value: data.value,
        meta: {},
      },
    });
  });

  useEffect(() => {
    if (page.type === "end_screen" && !endScreenSubmitted.current) {
      requestAnimationFrame(() => {
        mutation.mutate({
          end_screen: {
            value: true,
            meta: {},
          },
        });
      });

      endScreenSubmitted.current = true;
    }
  }, [page.type, mutation]);

  const hasScroll = useHasScroll(formRef, [page], innerWrapperRef);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        id={formDomId}
        className={cn(
          "size-full flex flex-col items-center px-4 py-24 sm:p-16 break-before-all overflow-y-auto",
          { "justify-center": !hasScroll }
        )}
        ref={formRef}
      >
        <div
          ref={innerWrapperRef}
          className={cn(
            "max-w-screen-md w-full mx-auto",
            props.innerWrapperClassName
          )}
        >
          {page.type === "end_screen" && mutation.status === "pending" && (
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
