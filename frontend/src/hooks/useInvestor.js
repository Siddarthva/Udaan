import { useInvestorStore } from "@/store/investorStore";

export const useInvestor = () => {
    const watchlist = useInvestorStore((state) => state.watchlist);
    const interests = useInvestorStore((state) => state.interests);
    const isLoading = useInvestorStore((state) => state.isLoading);
    const error = useInvestorStore((state) => state.error);
    const fetchWatchlist = useInvestorStore((state) => state.fetchWatchlist);
    const toggleSaveStartup = useInvestorStore((state) => state.toggleSaveStartup);
    const expressInterest = useInvestorStore((state) => state.expressInterest);
    const fetchInvestorInterests = useInvestorStore((state) => state.fetchInvestorInterests);

    return {
        watchlist,
        interests,
        isLoading,
        error,
        fetchWatchlist,
        toggleSaveStartup,
        expressInterest,
        fetchInvestorInterests
    };
};
