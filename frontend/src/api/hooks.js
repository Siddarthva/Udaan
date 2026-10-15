import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { startupApi, investorApi, followApi, notificationsApi, messagesApi, requestsApi, aiApi, communityApi, activityApi } from "./api";

// Activity Feed Hook
export function useActivityFeedQuery() {
    return useQuery({
        queryKey: ["activity_feed"],
        queryFn: () => activityApi.fetchAll(),
        refetchInterval: 60000
    });
}

// Community Hooks
export function useCommunityMembersQuery(filters = {}) {
    return useQuery({
        queryKey: ["community", filters],
        queryFn: () => communityApi.fetchMembers(filters)
    });
}

export function useCommunityMemberQuery(id) {
    return useQuery({
        queryKey: ["community_member", id],
        queryFn: () => communityApi.fetchMember(id),
        enabled: !!id
    });
}

// AI Assistant Hooks
export function useGenerateBioMutation() {
    return useMutation({
        mutationFn: (data) => aiApi.generateBio(data)
    });
}

export function useGenerateDescriptionMutation() {
    return useMutation({
        mutationFn: (data) => aiApi.generateStartupDescription(data)
    });
}

export function useGenerateNamesMutation() {
    return useMutation({
        mutationFn: (data) => aiApi.generateStartupNames(data)
    });
}

export function useGeneratePitchMutation() {
    return useMutation({
        mutationFn: (data) => aiApi.generateElevatorPitch(data)
    });
}

// Startups Hooks
export function useStartupsQuery(filters = {}) {
    return useQuery({
        queryKey: ["startups", filters],
        queryFn: () => startupApi.fetchAll(filters)
    });
}

export function useTrendingStartupsQuery() {
    return useQuery({
        queryKey: ["startups_trending"],
        queryFn: () => startupApi.fetchTrending()
    });
}

export function useStartupAnalyticsQuery(id) {
    return useQuery({
        queryKey: ["startup_analytics", id],
        queryFn: () => startupApi.fetchAnalytics(id),
        enabled: !!id
    });
}

export function useStartupDetailQuery(id) {
    return useQuery({
        queryKey: ["startup", id],
        queryFn: () => startupApi.fetchById(id),
        enabled: !!id
    });
}

export function useLaunchStartupMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => startupApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups"] });
        }
    });
}

export function useInvestStartupMutation() {
    return useMutation({
        mutationFn: ({ id, data }) => startupApi.invest(id, data),
        // Funding is a demo simulation: nothing is persisted, so there is no server state to refresh.
    });
}

export function useUpdateStartupMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => startupApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["startup", id] });
            queryClient.invalidateQueries({ queryKey: ["startups"] });
        }
    });
}

// Unified Requests Hooks
export function useUnifiedRequestsQuery(status) {
    return useQuery({
        queryKey: ["requests", status],
        queryFn: () => requestsApi.fetchAll(status)
    });
}

export function useAcceptUnifiedRequestMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => requestsApi.accept(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({ queryKey: ["message_requests"] });
        }
    });
}

export function useRejectUnifiedRequestMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => requestsApi.reject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            queryClient.invalidateQueries({ queryKey: ["message_requests"] });
        }
    });
}

// Watchlist Hooks
export function useWatchlistQuery() {
    return useQuery({
        queryKey: ["watchlist"],
        queryFn: () => investorApi.fetchWatchlist()
    });
}

export function useToggleSaveMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (startupId) => investorApi.toggleSave(startupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        }
    });
}

// Messages & Requests Hooks
export function useConversationsQuery() {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: () => messagesApi.fetchConversations(),
        refetchInterval: 15000
    });
}

export function useMarkConversationReadMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (conversationId) => messagesApi.markRead(conversationId),
        onSuccess: (_, conversationId) => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
        }
    });
}

export function useMessageRequestsQuery() {
    return useQuery({
        queryKey: ["message_requests"],
        queryFn: () => messagesApi.fetchMessageRequests(),
        refetchInterval: 15000
    });
}

export function useUpdateRequestStatusMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, action }) => messagesApi.updateRequestStatus(id, { action: action || status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["message_requests"] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
    });
}

export function useMessagesQuery(conversationId) {
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => messagesApi.fetchHistory(conversationId),
        enabled: !!conversationId,
        refetchInterval: 5000
    });
}

export function useSendMessageMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => messagesApi.sendMessage(data),
        onSuccess: (_, variables) => {
            if (variables.conversation_id) {
                queryClient.invalidateQueries({ queryKey: ["messages", variables.conversation_id] });
            }
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
    });
}

// Follow Hooks
export function useFollowersQuery() {
    return useQuery({
        queryKey: ["followers"],
        queryFn: () => followApi.fetchFollowers()
    });
}

export function useFollowingQuery() {
    return useQuery({
        queryKey: ["following"],
        queryFn: () => followApi.fetchFollowing()
    });
}

export function useFollowUserMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => followApi.followUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["following"] });
            queryClient.invalidateQueries({ queryKey: ["followers"] });
            queryClient.invalidateQueries({ queryKey: ["community"] });
            queryClient.invalidateQueries({ queryKey: ["community_member"] });
        }
    });
}

export function useUnfollowUserMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => followApi.unfollowUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["following"] });
            queryClient.invalidateQueries({ queryKey: ["followers"] });
            queryClient.invalidateQueries({ queryKey: ["community"] });
            queryClient.invalidateQueries({ queryKey: ["community_member"] });
        }
    });
}

// Notifications Hooks
export function useNotificationsQuery() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationsApi.fetchAll(),
        refetchInterval: 30000
    });
}

export function useMarkNotificationsReadMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationsApi.markRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
}

export function useMarkNotificationReadMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => notificationsApi.markSingleRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
}

// Startup Updates Hooks
export function useStartupUpdatesQuery(startupId) {
    return useQuery({
        queryKey: ["startup_updates", startupId],
        queryFn: () => startupApi.fetchUpdates(startupId),
        enabled: !!startupId
    });
}

export function useCreateStartupUpdateMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ startupId, data }) => startupApi.createUpdate(startupId, data),
        onSuccess: (_, { startupId }) => {
            queryClient.invalidateQueries({ queryKey: ["startup_updates", startupId] });
        }
    });
}
