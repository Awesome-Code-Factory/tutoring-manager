"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";

export const PreviewButton = () => {
  return (
    <Button
      onClick={() => toast.success("Congrats!, The button has been clicked")}
    >
      Click Me!
    </Button>
  );
};
