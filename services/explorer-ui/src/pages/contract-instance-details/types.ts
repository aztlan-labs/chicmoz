import { z } from "zod";
import { DetailItem } from "~/components/info-display/key-value-display";

export type tabId = "verifiedDeployment" | "contactDetails";

export const tabIds = ["verifiedDeployment", "contactDetails"] as const;

export const tabIdSchema = z.enum(tabIds);
export type TabId = z.infer<typeof tabIdSchema>;

export const tabSchema = z.object({
  id: tabIdSchema,
  label: z.string(),
});
export type Tab = z.infer<typeof tabSchema>;

export const verifiedDeploymentTabs: Tab[] = [
  { id: "verifiedDeployment", label: "Verified deployment" },
  { id: "contactDetails", label: "Contact details" },
];

export interface VerifiedDeploymentData {
  deployer: { data: DetailItem[] };
  salt: { data: DetailItem[] };
  publicKeys: { data: DetailItem[] };
  args: { data: DetailItem[] };
}
export interface ContactDetailsData {
  appWebsiteUrl: { data: DetailItem[] };
  externalUrls: { data: DetailItem[] };
  creatorName: { data: DetailItem[] };
  contact: { data: DetailItem[] };
}
