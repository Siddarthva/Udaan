import { useMentorStore } from "@/store/mentorStore";

export const useMentor = () => {
    const requests = useMentorStore((state) => state.requests);
    const isLoading = useMentorStore((state) => state.isLoading);
    const error = useMentorStore((state) => state.error);
    const sendMentorshipRequest = useMentorStore((state) => state.sendMentorshipRequest);
    const fetchMentorRequests = useMentorStore((state) => state.fetchMentorRequests);
    const updateRequestStatus = useMentorStore((state) => state.updateRequestStatus);

    return {
        requests,
        isLoading,
        error,
        sendMentorshipRequest,
        fetchMentorRequests,
        updateRequestStatus
    };
};
