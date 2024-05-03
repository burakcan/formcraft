"use client";

import { ChevronRight } from "lucide-react";
import { BaseContentViewer } from "../atoms/BaseContent";
import { CtaSectionViewer } from "../atoms/CtaSection";
import { PageWrapperViewer } from "../atoms/PageWrapper";
import type { Statement } from "./schema";
import { FormField } from "@/components/ui/form";

interface Props {
  page: Statement;
}

export function StatementViewer(props: Props) {
  const { page } = props;

  return (
    <PageWrapperViewer page={page}>
      {({ form, formDomId }) => (
        <>
          <BaseContentViewer page={page} />
          <FormField
            control={form.control}
            name="value"
            defaultValue={true}
            render={() => <></>}
          />
          <CtaSectionViewer
            type="submit"
            page={page}
            icon={ChevronRight}
            form={formDomId}
          />
        </>
      )}
    </PageWrapperViewer>
  );
}
