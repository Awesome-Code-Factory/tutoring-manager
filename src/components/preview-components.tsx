"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import type { User } from "@/db/schema";

export const PreviewButton = () => {
  return (
    <Button
      onClick={() => toast.success("Congrats!, The button has been clicked")}
    >
      Click Me!
    </Button>
  );
};
