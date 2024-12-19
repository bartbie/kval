import * as api from "@libs/api";
import { err, ok, Result } from "@libs/shared";
import { mock } from "./mock";
import { z } from "zod";

export const getMyDataFull = async (): Promise<api.MeWithEnsemblesFull> => {
    const user = mock.getUser();
    return api.meWithEnsemblesFullSchema.parse(user);
};

export const getAllEnsembles = async (): Promise<api.EnsembleFull[]> => {
    return mock.ensembles.map((e) => ({
        ...e,
        members: mock.otherUsers.filter((u) =>
            e.members.map((id) => id).includes(u._id),
        ),
    }));
};

export const getUserView = async (id: string): Promise<api.UserView | null> => {
    const user = mock.otherUsers.find((u) => u._id === id) ?? null;
    return user && api.userViewSchema.parse(user);
};

export const getAllUsers = async (): Promise<api.UserInfo[]> => {
    const all = mock.otherUsers;
    return z.array(api.userInfoSchema).parse(all);
};

const findEnsemble = async (id: string) =>
    (await getAllEnsembles()).find((x) => x._id === id);
let counter = 0;

export const createNewEnsemble = async (
    ensemble: api.NewEnsemble,
): Promise<api.EnsembleFull> => {
    const user = mock.getUser();
    const id = `added-${counter}`;
    mock.ensembles.push({
        ...ensemble,
        _id: id,
        createdBy: user._id,
        members: [user._id],
    });
    counter += 1;
    const final = await findEnsemble(id);
    if (final == undefined) {
        throw new Error("This shouldn't happen");
    }
    return final;
};

export const joinEnsemble = async (
    id: string,
): Promise<Result<api.EnsembleFull, string>> => {
    const ensemble = mock.ensembles.find((e) => e._id === id);
    if (ensemble == undefined) {
        return err("Such Ensemble doesn't exist");
    }
    const user = mock.getUser();
    const already = user.ensembles.includes(ensemble._id);
    {
        const sanityCheck = ensemble.members.includes(ensemble._id);
        if (already != sanityCheck) {
            throw new Error("This shouldn't happen");
        }
    }
    const final = async () => {
        const full = (await getAllEnsembles()).find(
            (x) => x._id === ensemble._id,
        )!;
        return ok(full);
    };
    if (already) {
        return await final();
    }
    ensemble.members.push(user._id);
    user.ensembles.push(ensemble._id);
    return await final();
};
