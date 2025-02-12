import { CheckCircle2Icon } from "lucide-react";
import db from "@/services/db";

interface Props {
  searchParams: Promise<{ code: string; formId: string }>;
}

export default async function EmailConnectorPage(props: Props) {
  const { code, formId: craftId } = (await props.searchParams);

  const connection = await db.emailConnection.findFirst({
    where: {
      confirmationCode: code,
      craft: {
        some: {
          id: craftId,
        },
      },
    },
  });

  if (!connection) {
    throw new Error("Invalid confirmation code");
  }

  await db.emailConnection.update({
    where: {
      id: connection.id,
    },
    data: {
      confirmedAt: new Date(),
    },
  });

  return (
    <div className="fixed top-0 left-0 size-full flex items-center justify-center bg-accent">
      <div className="p-4 bg-background rounded shadow-md">
        <CheckCircle2Icon
          className="text-emerald-500 animate-pulse"
          size={48}
        />
        <h1 className="text-2xl font-bold">Email connection confirmed!</h1>
        <p className="mt-2">
          Your email has been successfully connected to your form.
          <br />
          You can now close this window.
        </p>
      </div>
    </div>
  );
}
