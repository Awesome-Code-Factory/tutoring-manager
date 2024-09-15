import type { StrictOmit } from "@/type-utils/strict-omit";
import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export const SubmitButton = ({
  children = "Submit",
  ...props
}: StrictOmit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "type"
>) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} {...props}>
      {children}
    </Button>
  );
};
