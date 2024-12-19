import { ensembleSchema } from "ensemble";
import { uuidSchema } from "id";
import { userInfoSchema } from "user";
import { z } from "zod";

export const ensembleFullSchema = ensembleSchema.extend({
    members: z.array(userInfoSchema),
});

export type EnsembleFull = z.infer<typeof ensembleFullSchema>;

export const updateMeSchema = userInfoSchema.partial().strip();
export type UpdateMe = z.infer<typeof updateMeSchema>;

export const meWithEnsemblesIdsSchema = userInfoSchema.extend({
    ensembles: z.array(uuidSchema),
});
export type MeWithEnsemblesIds = z.infer<typeof meWithEnsemblesIdsSchema>;

export const meWithEnsemblesFullSchema = userInfoSchema.extend({
    ensembles: z.array(ensembleFullSchema),
});
export type MeWithEnsemblesFull = z.infer<typeof meWithEnsemblesFullSchema>;

export const userViewSchema = userInfoSchema.extend({
    ensembles: z.array(ensembleSchema),
});
export type UserView = z.infer<typeof userViewSchema>;
