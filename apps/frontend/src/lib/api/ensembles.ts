import type * as API from "@libs/api";
import { err, Result } from "@libs/shared";
import { api } from "./_client";

type AResult<T, E = string> = Promise<Result<T, E>>;

export const getAll = async (): AResult<API.EnsembleFull[], never> => {
    return await api.get(`/ensembles`);
};

export const get = async (id: string): AResult<API.EnsembleFull> => {
    return await api.get(`/ensembles/${id}`);
};

export const join = async (id: string): AResult<API.EnsembleFull> => {
    return await api.post(`/ensembles/${id}/join`);
};

export const leave = async (id: string): AResult<API.EnsembleFull> => {
    return await api.post(`/ensembles/${id}/leave`);
};

export const disband = async (id: string): AResult<void> => {
    return await api.delete(`/ensembles/${id}`);
};

export const create = async (
    id: string,
    data: API.NewEnsemble,
): AResult<API.Ensemble> => {
    return await api.post(`/ensembles/${id}`, data);
};

export const edit = async (
    id: string,
    data: API.UpdateEnsemble,
): AResult<API.EnsembleFull> => {
    return await api.patch(`/ensembles/${id}`, data);
};
