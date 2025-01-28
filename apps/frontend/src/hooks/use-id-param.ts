import { useParams } from "react-router";

export const useIdParam = () => {
    const { id } = useParams();
    if (!id) {
        throw Error("No id found from param!");
    }
    return { id };
};
