import { z } from "zod";

export type tabId =
  | "contractVersions"
  | "contractInstances"
  | "privateFunctions"
  | "unconstrainedFunctions";

export const tabIds = [
  "contractVersions",
  "contractInstances",
  "privateFunctions",
  "unconstrainedFunctions",
] as const;

export const tabIdSchema = z.enum(tabIds);
export type TabId = z.infer<typeof tabIdSchema>;

export const tabSchema = z.object({
  id: tabIdSchema,
  label: z.string(),
});
export type Tab = z.infer<typeof tabSchema>;

export const contractClassTabs: Tab[] = [
  { id: "contractVersions", label: "Versions" },
  { id: "contractInstances", label: "Instances" },
  { id: "privateFunctions", label: "Private functions" },
  { id: "unconstrainedFunctions", label: "Unconstrained functions" },
];
