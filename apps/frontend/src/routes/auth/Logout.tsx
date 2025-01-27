import { useAuth } from "@/lib/auth";

export default () => {
    useAuth().logout();
    return <></>; };
