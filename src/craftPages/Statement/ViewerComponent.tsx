"use client";

import { ChevronRight } from "lucide-react";
import { FormField } from "@/components/ui/form";
import { BaseContentViewer } from "../pageAtoms/BaseContent";
import { CtaSectionViewer } from "../pageAtoms/CtaSection";
import { PageWrapperViewer } from "../pageAtoms/PageWrapper";
import type { Statement } from "./schema";

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
