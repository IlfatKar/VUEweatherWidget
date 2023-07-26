import { IDescriptionItem } from "@/shared/types";

export type ArrayOfMaxItems =
  | [IDescriptionItem]
  | [IDescriptionItem, IDescriptionItem]
  | [IDescriptionItem, IDescriptionItem, IDescriptionItem]
  | [IDescriptionItem, IDescriptionItem, IDescriptionItem, IDescriptionItem];
