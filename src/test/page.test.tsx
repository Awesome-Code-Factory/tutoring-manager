import type { ReactNode } from "react";
import Home from "../app/page";

const content = Home();

content satisfies ReactNode;

// @ts-expect-error it should not be of type undefined
content satisfies undefined;
