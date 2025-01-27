import UnloggedHeader from "../components/headers/UnloggedHeader";

export default () => {
    return (
        <>
            <UnloggedHeader />
            <main className="min-h-[calc(100vh-8rem)] grid place-items-center">
                <div>
                    <h1 className="text-3xl font-bold underline">
                        Welcome to Musik Sampsil!
                    </h1>
                    <h2 className="">Connect with other musicians.</h2>
                </div>
            </main>
        </>
    );
};
