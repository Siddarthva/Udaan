import { useStartupStore } from "@/store/startupStore";

export const useStartup = () => {
    const startups = useStartupStore((state) => state.startups);
    const currentStartup = useStartupStore((state) => state.currentStartup);
    const isLoading = useStartupStore((state) => state.isLoading);
    const error = useStartupStore((state) => state.error);
    const fetchStartups = useStartupStore((state) => state.fetchStartups);
    const fetchStartupDetails = useStartupStore((state) => state.fetchStartupDetails);
    const createStartup = useStartupStore((state) => state.createStartup);
    const updateStartup = useStartupStore((state) => state.updateStartup);
    const addMember = useStartupStore((state) => state.addMember);
    const removeMember = useStartupStore((state) => state.removeMember);
    const uploadPitchDeck = useStartupStore((state) => state.uploadPitchDeck);

    return {
        startups,
        currentStartup,
        isLoading,
        error,
        fetchStartups,
        fetchStartupDetails,
        createStartup,
        updateStartup,
        addMember,
        removeMember,
        uploadPitchDeck
    };
};
