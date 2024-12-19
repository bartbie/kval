import { z } from "zod";

export const uuidSchema = z.string().uuid("Id is not a valid UUID");

export const withIdSchema = z.object({
    _id: uuidSchema,
});

export const mkWithId = withIdSchema.merge;

export type WithId<T> = z.infer<typeof withIdSchema> & T;
