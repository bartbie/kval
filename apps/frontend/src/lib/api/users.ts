import type * as API from "@libs/api";
import { err, Result } from "@libs/shared";
import { api } from "./_client";

type AResult<T, E = string> = Promise<Result<T, E>>;

export const getAll = async (): AResult<API.UserView[], never> => {
    return await api.get(`/users`);
};

export const get = async (id: string): AResult<API.UserView> => {
    return await api.get(`/users/${id}`);
};
