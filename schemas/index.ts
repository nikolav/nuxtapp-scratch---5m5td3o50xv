import { z } from "zod";

export const schemaHasTitleNonempty = z.object({
  title: z.string().min(1),
});

