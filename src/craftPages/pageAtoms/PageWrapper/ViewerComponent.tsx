import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { craftPageDefinitions } from "@/craftPages";
import { useAnswerMutation } from "@/hooks/useAnswerMutation";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

type FormValues<T extends FormCraft.CraftPage> = {
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
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onAnswer(page.id, data.value);

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

  const hasScroll =
    (ref.current?.scrollHeight || 0) > (ref.current?.clientHeight || 0);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        id={formDomId}
        className={cn(
          "size-full flex flex-col items-center p-16 break-before-all overflow-y-auto",
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
          {props.children({ form, formDomId })}
        </div>
      </form>
    </Form>
  );
}
