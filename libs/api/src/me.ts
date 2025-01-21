import { ensembleSchema } from "ensemble";
import { uuidSchema } from "id";
import { emailSchema, userInfoSchema } from "user";
import { z } from "zod";

export const ensembleFullSchema = ensembleSchema.extend({
    members: z.array(userInfoSchema),
});

export type EnsembleFull = z.infer<typeof ensembleFullSchema>;

export const updateMeSchema = userInfoSchema
    .omit({ _id: true, bio: true })
    .extend({
        bio: z.string(),
    })
    .partial()
    .strip();
export type UpdateMe = z.infer<typeof updateMeSchema>;

export const meWithEnsemblesIdsSchema = userInfoSchema.extend({
    ensembles: z.array(uuidSchema),
});
export type MeWithEnsemblesIds = z.infer<typeof meWithEnsemblesIdsSchema>;

export const meWithEnsemblesSchema = userInfoSchema.extend({
    ensembles: z.array(ensembleSchema),
});
export type MeWithEnsembles = z.infer<typeof meWithEnsemblesSchema>;

export const meWithEnsemblesFullSchema = userInfoSchema.extend({
    ensembles: z.array(ensembleFullSchema),
});
export type MeWithEnsemblesFull = z.infer<typeof meWithEnsemblesFullSchema>;

export const userViewSchema = userInfoSchema.extend({
    ensembles: z.array(ensembleSchema),
});
export type UserView = z.infer<typeof userViewSchema>;

export const userViewWithEmailSchema = userViewSchema.extend({
    email: emailSchema,
});

export type UserViewWithEmail = z.infer<typeof userViewWithEmailSchema>;
