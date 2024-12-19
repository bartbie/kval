import * as api from "@libs/api";
// TODO: remove this mock later

const otherUsers: ({ _id: string } & api.UserInfo)[] = [
    {
        _id: "2",
        firstName: "Other",
        lastName: "Smth",
        age: 20,
        bio: "other 2",
        instruments: ["piano"],
        genres: ["jazz"],
    },
    {
        _id: "3",
        firstName: "Third",
        lastName: "Bober",
        age: 30,
        bio: "other 3",
        instruments: ["piano", "bass"],
        genres: ["jazz", "rock"],
    },
];

const ensembles: api.Ensemble[] = [];

let user = {
    _id: "1",
    email: "mock@mock.com",
    password: "mock123456",
    firstName: "Mock",
    lastName: "Mocking",
    age: 18,
    bio: "",
    instruments: [] as string[],
    genres: [] as string[],
    ensembles: [] as string[],
};

const updateUser = (data: Partial<typeof user>) => {
    user = {
        ...user,
        ...data,
    };
};

const setUser = (nuser: typeof user) => {
    user = nuser;
};

const getUser = () => user;

export const mock = {
    ensembles,
    getUser,
    setUser,
    updateUser,
    otherUsers,
};
