import { mkWithId, uuidSchema } from "id";
import { z } from "zod";

const ensembleBase = z.object({
    name: z.string().min(1),
    genres: z.array(z.string()),
    bio: z.string().default(""),
});

export const newEnsembleSchema = ensembleBase.strip();

const ensembleCreatedSchema = mkWithId(newEnsembleSchema).extend({
    createdBy: uuidSchema,
});

export const ensembleSchema = ensembleCreatedSchema.extend({
    members: z.array(uuidSchema),
});

export const updateEnsembleSchema = ensembleBase
    .omit({ bio: true })
    .extend({ bio: z.string() })
    .partial()
    .strip();

export type NewEnsemble = z.infer<typeof newEnsembleSchema>;
export type Ensemble = z.infer<typeof ensembleSchema>;
export type UpdateEnsemble = z.infer<typeof updateEnsembleSchema>;
