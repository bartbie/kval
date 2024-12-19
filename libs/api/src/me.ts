import { ensembleSchema } from "ensemble";
import { uuidSchema } from "id";
import { userInfoSchema } from "user";
import { z } from "zod";

export const updateMeSchema = userInfoSchema.partial().strip();
export type UpdateMe = z.infer<typeof updateMeSchema>;

export const meWithEnsemblesIdsSchema = updateMeSchema.extend({
    ensembles: z.array(uuidSchema),
});

export const ensembleFullSchema = ensembleSchema.extend({
    members: z.array(userInfoSchema),
});

export const meWithEnsemblesFullSchema = updateMeSchema.extend({
    ensembles: z.array(ensembleFullSchema),
});
export type MeWithEnsemblesIds = z.infer<typeof meWithEnsemblesIdsSchema>;
export type MeWithEnsemblesFull = z.infer<typeof meWithEnsemblesFullSchema>;
