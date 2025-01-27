import type * as API from "@libs/api";
import { err, Result } from "@libs/shared";
import { api } from "./_client";

export const get = async (): Promise<Result<API.MeWithEnsembles, string>> => {
    return await api.get("/me");
};

export const update = async (data: API.UpdateMe): Promise<Result<API.MeWithEnsembles, string>> => {
    return await api.patch("/me", data);
};