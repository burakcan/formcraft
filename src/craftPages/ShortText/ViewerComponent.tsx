"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaButtonViewer } from "../atoms/CtaButton";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import { shortTextViewerSchema, type ShortText } from "./schema";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

interface Props {
  page: ShortText;
}

const formSchema = z.object({
  value: shortTextViewerSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function ShortTextViewer(props: Props) {
  const onAnswer = useViewCraftStore((state) => state.onAnswer);
  const { page } = props;
  const formDomId = useId();
  const form = useForm<FormValues>({
    defaultValues: { value: "" },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onAnswer(page.id, data.value);
  });

  return (
    <Form {...form}>
      <PageWrapperViewer innerWrapperClassName="max-w-screen-md mx-auto">
        <BaseContentViewer page={page} />
        <div className="w-full pt-2">
          <form onSubmit={handleSubmit} id={formDomId}>
            <FormField
              control={form.control}
              name="value"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Input
                      {...field}
                      className={cn(
                        "text-xl h-14 border-b-4 border-craft-answers focus-visible:ring-craft-answers",
                        { "border-destructive": fieldState.error }
                      )}
                      placeholder="Type your answer here..."
                    />
                    {fieldState.error && (
                      <div className="text-craft-description text-sm mt-1">
                        {fieldState.error.message}
                      </div>
                    )}
                  </>
                );
              }}
            />
          </form>
        </div>
        <div className="w-full py-2">
          <CtaButtonViewer
            type="submit"
            page={page}
            icon={CheckIcon}
            form={formDomId}
          />
          <span className="ml-2 text-sm whitespace-nowrap">
            or press <kbd>Enter</kbd>
          </span>
        </div>
      </PageWrapperViewer>
    </Form>
  );
}
