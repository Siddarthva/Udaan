const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { fake, start, stop, api, signup } = require('./helpers/harness');

before(start);
after(stop);
beforeEach(() => fake.reset());

const startupPayload = { title: 'Lunar Core', description: 'Moon mining', domain: 'DeepTech', stage: 'MVP', funding_required: 50 };

describe('unauthorized access', () => {
    test('every protected route rejects anonymous callers with 401', async () => {
        const routes = [
            ['GET', '/community'], ['GET', '/startups'], ['GET', '/startups/trending'], ['GET', '/follow/following'],
            ['GET', '/follow/followers'], ['GET', '/notifications'], ['GET', '/messages/conversations'],
            ['GET', '/messages/requests'], ['GET', '/startups/relations/mentor-requests'], ['POST', '/startups/launch'],
            ['GET', '/requests']
        ];
        for (const [method, path] of routes) {
            const res = await api(method, path);
            assert.equal(res.status, 401, `${method} ${path}`);
        }
    });
});

describe('community + follows', () => {
    test('empty database yields an empty list, not an error', async () => {
        const me = await signup();
        const res = await api('GET', '/community', { token: me.token });
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.members, []);
    });

    test('lists real profiles, excludes self, hides email/phone, supports role filter and search', async () => {
        const me = await signup('INNOVATOR');
        const mentor = await signup('MENTOR', { full_name: 'Asha Rao', username: 'asha_mentor' });
        await signup('SPONSOR', { full_name: 'Ravi Kumar', username: 'ravi_fund' });
        await api('PATCH', '/auth/profile', { token: mentor.token, body: { college: 'IISc', whatsapp_number: '+911234567890' } });

        const all = await api('GET', '/community', { token: me.token });
        assert.equal(all.body.members.length, 2);
        assert.ok(all.body.members.every((m) => m.id !== me.id));
        assert.ok(all.body.members.every((m) => m.email === undefined && m.whatsapp_number === undefined));

        const mentors = await api('GET', '/community?role=mentor', { token: me.token });
        assert.deepEqual(mentors.body.members.map((m) => m.username), ['asha_mentor']);

        const byName = await api('GET', '/community/search?q=ravi', { token: me.token });
        assert.deepEqual(byName.body.members.map((m) => m.username), ['ravi_fund']);

        const byCollege = await api('GET', '/community?college=iisc', { token: me.token });
        assert.equal(byCollege.body.members.length, 1);

        assert.equal((await api('GET', '/community?role=wizard', { token: me.token })).status, 400);
    });

    test('follow / duplicate follow / unfollow persist in follows and drive is_following + counts', async () => {
        const a = await signup();
        const b = await signup('MENTOR');
        const f1 = await api('POST', `/follow/user/${b.id}`, { token: a.token });
        assert.equal(f1.status, 201);
        const f2 = await api('POST', `/follow/user/${b.id}`, { token: a.token });
        assert.equal(f2.status, 200);
        assert.equal(fake.tables.follows.length, 1);
        assert.equal(fake.tables.notifications.filter((n) => n.type === 'new_follower').length, 1);

        const list = await api('GET', '/community', { token: a.token });
        const row = list.body.members.find((m) => m.id === b.id);
        assert.equal(row.is_following, true);
        assert.equal(row.followers_count, 1);

        const following = await api('GET', '/follow/following', { token: a.token });
        assert.deepEqual(following.body.following.users.map((u) => u.id), [b.id]);
        const followers = await api('GET', '/follow/followers', { token: b.token });
        assert.deepEqual(followers.body.followers.map((u) => u.id), [a.id]);

        assert.equal((await api('DELETE', `/follow/user/${b.id}`, { token: a.token })).status, 200);
        assert.equal(fake.tables.follows.length, 0);
    });

    test('rejects self-follow, invalid ids and unknown users', async () => {
        const a = await signup();
        assert.equal((await api('POST', `/follow/user/${a.id}`, { token: a.token })).status, 400);
        assert.equal((await api('POST', '/follow/user/not-a-uuid', { token: a.token })).status, 400);
        assert.equal((await api('POST', '/follow/user/11111111-1111-4111-8111-111111111111', { token: a.token })).status, 404);
    });

    test('database failures surface as 500, never as an empty list', async () => {
        const me = await signup();
        fake.failNext('profiles', 'select', { code: '42703', message: 'column does not exist' });
        const res = await api('GET', '/community', { token: me.token });
        assert.equal(res.status, 500);
    });
});

describe('startups', () => {
    test('only innovators can launch; founder_id comes from the session, not the body', async () => {
        const inn = await signup('INNOVATOR');
        const sponsor = await signup('SPONSOR');
        const denied = await api('POST', '/startups/launch', { token: sponsor.token, body: startupPayload });
        assert.equal(denied.status, 403);

        const res = await api('POST', '/startups/launch', { token: inn.token, body: { ...startupPayload, founder_id: sponsor.id } });
        assert.equal(res.status, 201);
        assert.equal(res.body.startup.owner_id, inn.id);
        assert.equal(fake.tables.startups[0].founder_id, inn.id);
        assert.equal(fake.tables.startups[0].stage, 'mvp');
        assert.equal(fake.tables.startup_members.length, 1, 'founder membership row');
        assert.equal(res.body.startup.funding_received, 0);
    });

    test('validates launch payload', async () => {
        const inn = await signup();
        assert.equal((await api('POST', '/startups/launch', { token: inn.token, body: { title: '' } })).status, 400);
        assert.equal((await api('POST', '/startups/launch', { token: inn.token, body: { ...startupPayload, stage: 'galaxy' } })).status, 400);
        assert.equal((await api('POST', '/startups/launch', { token: inn.token, body: { ...startupPayload, funding_required: -5 } })).status, 400);
    });

    test('owner=me lists only the caller\'s startups; others see everything; empty state is []', async () => {
        const a = await signup();
        const b = await signup();
        assert.deepEqual((await api('GET', '/startups?owner=me', { token: a.token })).body.startups, []);
        await api('POST', '/startups/launch', { token: a.token, body: startupPayload });
        await api('POST', '/startups/launch', { token: b.token, body: { ...startupPayload, title: 'Other' } });
        const mine = await api('GET', '/startups?owner=me', { token: a.token });
        assert.equal(mine.body.startups.length, 1);
        assert.equal(mine.body.startups[0].owner_id, a.id);
        assert.equal((await api('GET', '/startups', { token: a.token })).body.startups.length, 2);
        const search = await api('GET', '/startups?search=other&domain=DeepTech&stage=MVP', { token: a.token });
        assert.deepEqual(search.body.startups.map((s) => s.title), ['Other']);
    });

    test('ownership is enforced on update, members and updates; 404 for unknown startup', async () => {
        const owner = await signup();
        const intruder = await signup();
        const created = await api('POST', '/startups/launch', { token: owner.token, body: startupPayload });
        const id = created.body.startup.id;

        assert.equal((await api('PATCH', `/startups/${id}`, { token: intruder.token, body: { title: 'Hijack' } })).status, 403);
        const ok = await api('PATCH', `/startups/${id}`, { token: owner.token, body: { title: 'Lunar Core 2', funding_required: 75 } });
        assert.equal(ok.status, 200);
        assert.equal(ok.body.startup.title, 'Lunar Core 2');
        assert.equal(fake.tables.startups[0].funding_required, 75);

        // funding_received can never be changed through the update endpoint
        await api('PATCH', `/startups/${id}`, { token: owner.token, body: { funding_received: 999999 } });
        assert.equal(fake.tables.startups[0].funding_received, 0);

        assert.equal((await api('POST', `/startups/${id}/members`, { token: intruder.token, body: { username: intruder.username, role: 'CTO' } })).status, 403);
        assert.equal((await api('GET', '/startups/22222222-2222-4222-8222-222222222222', { token: owner.token })).status, 404);
        assert.equal((await api('GET', '/startups/bad-id', { token: owner.token })).status, 400);
    });

    test('team members are real users added by username; duplicates 409; founder cannot be removed', async () => {
        const owner = await signup();
        const dev = await signup('MENTOR', { username: 'dev_person' });
        const id = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;

        assert.equal((await api('POST', `/startups/${id}/members`, { token: owner.token, body: { username: 'ghost_user', role: 'CTO' } })).status, 404);
        const added = await api('POST', `/startups/${id}/members`, { token: owner.token, body: { username: 'dev_person', role: 'CTO' } });
        assert.equal(added.status, 201);
        assert.equal(added.body.member.user_id, dev.id);
        assert.equal((await api('POST', `/startups/${id}/members`, { token: owner.token, body: { username: 'dev_person', role: 'CTO' } })).status, 409);

        const details = await api('GET', `/startups/${id}`, { token: owner.token });
        assert.equal(details.body.startup.members.length, 2);
        const founderRow = fake.tables.startup_members.find((m) => m.user_id === owner.id);
        assert.equal((await api('DELETE', `/startups/${id}/members/${founderRow.id}`, { token: owner.token })).status, 400);
        assert.equal((await api('DELETE', `/startups/${id}/members/${added.body.member.id}`, { token: owner.token })).status, 200);
    });

    test('startup updates: team can post, others cannot; author/owner can delete', async () => {
        const owner = await signup();
        const other = await signup();
        const id = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;
        assert.equal((await api('POST', `/startups/${id}/updates`, { token: other.token, body: { content: 'spam' } })).status, 403);
        const posted = await api('POST', `/startups/${id}/updates`, { token: owner.token, body: { content: 'Shipped v1' } });
        assert.equal(posted.status, 201);
        assert.equal((await api('GET', `/startups/${id}/updates`, { token: other.token })).body.updates.length, 1);
        assert.equal((await api('DELETE', `/startups/updates/${posted.body.update.id}`, { token: other.token })).status, 403);
        assert.equal((await api('DELETE', `/startups/updates/${posted.body.update.id}`, { token: owner.token })).status, 200);
    });

    test('saved startups toggle and persist', async () => {
        const owner = await signup();
        const sponsor = await signup('SPONSOR');
        const id = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;
        assert.deepEqual((await api('GET', '/startups/relations/saved', { token: sponsor.token })).body.saved, []);
        assert.equal((await api('POST', `/startups/${id}/save`, { token: sponsor.token })).body.saved, true);
        assert.equal(fake.tables.saved_startups.length, 1);
        assert.equal((await api('GET', '/startups/relations/saved', { token: sponsor.token })).body.saved[0].id, id);
        assert.equal((await api('POST', `/startups/${id}/save`, { token: sponsor.token })).body.saved, false);
        assert.equal(fake.tables.saved_startups.length, 0);
    });

    test('trending uses real engagement counts only', async () => {
        const owner = await signup();
        const sponsor = await signup('SPONSOR');
        const a = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;
        await api('POST', '/startups/launch', { token: owner.token, body: { ...startupPayload, title: 'Quiet' } });
        await api('POST', `/startups/${a}/save`, { token: sponsor.token });
        const res = await api('GET', '/startups/trending', { token: owner.token });
        assert.equal(res.body.startups[0].id, a);
        assert.deepEqual(res.body.startups[0].metrics, { saved: 1, interests: 0, mentor_requests: 0 });
        assert.equal(res.body.startups[0].metrics.trending_score, undefined);
    });
});

describe('sponsor interest + mentorship', () => {
    async function setup() {
        const owner = await signup('INNOVATOR');
        const sponsor = await signup('SPONSOR');
        const mentor = await signup('MENTOR');
        const id = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;
        return { owner, sponsor, mentor, id };
    }

    test('only sponsors express interest; persisted once; founder sees it and is notified', async () => {
        const { owner, sponsor, mentor, id } = await setup();
        assert.equal((await api('POST', `/startups/${id}/express-interest`, { token: mentor.token, body: { message: 'hi' } })).status, 403);
        const ok = await api('POST', `/startups/${id}/express-interest`, { token: sponsor.token, body: { message: 'Keen to invest' } });
        assert.equal(ok.status, 201);
        assert.equal((await api('POST', `/startups/${id}/express-interest`, { token: sponsor.token, body: {} })).status, 409);
        assert.equal(fake.tables.investor_interest.length, 1);
        assert.equal((await api('POST', `/startups/${id}/express-interest`, { token: owner.token, body: {} })).status, 403);

        const mine = await api('GET', '/startups/relations/interests', { token: sponsor.token });
        assert.equal(mine.body.interests.length, 1);
        const received = await api('GET', '/startups/relations/interests', { token: owner.token });
        assert.equal(received.body.interests[0].requester_id, sponsor.id);
        assert.equal(fake.tables.notifications.filter((n) => n.user_id === owner.id).length, 1);
    });

    test('mentor request lifecycle: send, dedupe, owner-only decision, single decision', async () => {
        const { owner, sponsor, mentor, id } = await setup();
        assert.equal((await api('POST', `/startups/${id}/mentor-request`, { token: sponsor.token, body: { message: 'x' } })).status, 403);
        const sent = await api('POST', `/startups/${id}/mentor-request`, { token: mentor.token, body: { message: 'I can help' } });
        assert.equal(sent.status, 201);
        assert.equal(sent.body.request.status, 'pending');
        assert.equal((await api('POST', `/startups/${id}/mentor-request`, { token: mentor.token, body: {} })).status, 409);

        const ownerView = await api('GET', '/startups/relations/mentor-requests', { token: owner.token });
        assert.equal(ownerView.body.requests.length, 1);
        assert.equal(ownerView.body.requests[0].startup_title, 'Lunar Core');

        const rid = sent.body.request.id;
        assert.equal((await api('PATCH', `/startups/relations/mentor-requests/${rid}`, { token: mentor.token, body: { status: 'accepted' } })).status, 403);
        const stranger = await signup('INNOVATOR');
        assert.equal((await api('PATCH', `/startups/relations/mentor-requests/${rid}`, { token: stranger.token, body: { status: 'accepted' } })).status, 403);
        assert.equal((await api('PATCH', `/startups/relations/mentor-requests/${rid}`, { token: owner.token, body: { status: 'maybe' } })).status, 400);
        const accepted = await api('PATCH', `/startups/relations/mentor-requests/${rid}`, { token: owner.token, body: { status: 'accepted' } });
        assert.equal(accepted.status, 200);
        assert.equal(accepted.body.request.status, 'accepted');
        assert.equal((await api('PATCH', `/startups/relations/mentor-requests/${rid}`, { token: owner.token, body: { status: 'rejected' } })).status, 409);
        assert.ok(fake.tables.notifications.some((n) => n.user_id === mentor.id && n.type === 'request_accepted'));
    });
});

describe('funding simulation', () => {
    test('returns a labelled simulation and never changes funding totals or persists a transaction', async () => {
        const owner = await signup();
        const sponsor = await signup('SPONSOR');
        const id = (await api('POST', '/startups/launch', { token: owner.token, body: startupPayload })).body.startup.id;
        const body = { amount: 10, payment_method: 'upi', accepted_terms: true };

        assert.equal((await api('POST', `/startups/${id}/invest`, { token: owner.token, body })).status, 403);
        assert.equal((await api('POST', `/startups/${id}/invest`, { token: sponsor.token, body: { ...body, accepted_terms: false } })).status, 400);
        assert.equal((await api('POST', `/startups/${id}/invest`, { token: sponsor.token, body: { ...body, amount: -1 } })).status, 400);

        const before = JSON.stringify(fake.tables);
        const res = await api('POST', `/startups/${id}/invest`, { token: sponsor.token, body });
        assert.equal(res.status, 200);
        assert.equal(res.body.transaction.simulated, true);
        assert.equal(res.body.transaction.persisted, false);
        assert.match(res.body.transaction.reference, /^SIM-/);
        assert.equal(JSON.stringify(fake.tables), before, 'no table was modified');
        assert.equal(fake.tables.startups[0].funding_received, 0);
    });
});

describe('messaging lifecycle', () => {
    test('request -> accept -> conversation + initial message -> send -> read', async () => {
        const a = await signup('INNOVATOR');
        const b = await signup('MENTOR');

        // gate: no conversation, no messaging
        assert.equal((await api('POST', '/messages/send', { token: a.token, body: { receiver_id: b.id, message: 'hello' } })).status, 403);

        const created = await api('POST', '/requests', { token: a.token, body: { receiver_id: b.id, type: 'general', initial_message: 'Hi there' } });
        assert.equal(created.status, 201);
        assert.equal((await api('POST', '/requests', { token: a.token, body: { receiver_id: b.id, type: 'general' } })).status, 409);

        const inbox = await api('GET', '/messages/requests', { token: b.token });
        assert.equal(inbox.body.requests.length, 1);
        assert.equal(inbox.body.requests[0].sender_name, a.full_name);
        assert.deepEqual((await api('GET', '/messages/requests', { token: a.token })).body.requests, []);

        const rid = created.body.request.id;
        assert.equal((await api('PATCH', `/requests/${rid}/accept`, { token: a.token })).status, 403, 'sender cannot accept');

        const accepted = await api('PATCH', `/messages/request/${rid}`, { token: b.token, body: { action: 'accept' } });
        assert.equal(accepted.status, 200);
        assert.equal(accepted.body.request.status, 'accepted');
        const convId = accepted.body.conversation.id;
        assert.equal(fake.tables.conversations.length, 1);
        assert.equal(fake.tables.messages.length, 1);
        assert.equal(fake.tables.messages[0].message, 'Hi there');

        // repeated clicks / both endpoints cannot create duplicates
        assert.equal((await api('PATCH', `/requests/${rid}/accept`, { token: b.token })).status, 409);
        assert.equal((await api('PATCH', `/messages/request/${rid}`, { token: b.token, body: { action: 'accept' } })).status, 409);
        assert.equal(fake.tables.conversations.length, 1);
        assert.equal(fake.tables.messages.length, 1);

        const sent = await api('POST', '/messages/send', { token: b.token, body: { conversation_id: convId, message: 'Welcome!' } });
        assert.equal(sent.status, 201);
        assert.equal(sent.body.message.is_read, false);
        assert.equal((await api('POST', '/messages/send', { token: a.token, body: { receiver_id: b.id, message: 'via receiver' } })).status, 201);
        assert.equal(fake.tables.conversations.length, 1);

        const convsA = await api('GET', '/messages/conversations', { token: a.token });
        assert.equal(convsA.body.conversations.length, 1);
        assert.equal(convsA.body.conversations[0].recipient.id, b.id);
        assert.equal(convsA.body.conversations[0].unread_count, 1);
        assert.equal(convsA.body.conversations[0].last_message, 'via receiver');

        const history = await api('GET', `/messages/${convId}`, { token: a.token });
        assert.deepEqual(history.body.messages.map((m) => m.message), ['Hi there', 'Welcome!', 'via receiver']);

        assert.equal((await api('PATCH', `/messages/${convId}/read`, { token: a.token })).status, 200);
        const afterRead = await api('GET', '/messages/conversations', { token: a.token });
        assert.equal(afterRead.body.conversations[0].unread_count, 0);
        const convsB = await api('GET', '/messages/conversations', { token: b.token });
        assert.equal(convsB.body.conversations[0].unread_count, 2, "b's unread (a's two messages) is untouched by a reading");

        assert.ok(fake.tables.notifications.some((n) => n.user_id === a.id && n.type === 'request_accepted'));
    });

    test('reject path creates no conversation and cannot be re-answered', async () => {
        const a = await signup();
        const b = await signup();
        const rid = (await api('POST', '/requests', { token: a.token, body: { receiver_id: b.id, type: 'general', initial_message: 'yo' } })).body.request.id;
        const rejected = await api('PATCH', `/requests/${rid}/reject`, { token: b.token });
        assert.equal(rejected.status, 200);
        assert.equal(rejected.body.request.status, 'rejected');
        assert.equal(fake.tables.conversations.length, 0);
        assert.equal((await api('PATCH', `/requests/${rid}/accept`, { token: b.token })).status, 409);
        assert.equal((await api('GET', '/messages/requests', { token: b.token })).body.requests.length, 0);
    });

    test('non-participants cannot read, send to, or mark-read a conversation', async () => {
        const a = await signup();
        const b = await signup();
        const outsider = await signup();
        const rid = (await api('POST', '/requests', { token: a.token, body: { receiver_id: b.id, type: 'general' } })).body.request.id;
        const convId = (await api('PATCH', `/requests/${rid}/accept`, { token: b.token })).body.conversation.id;

        assert.equal((await api('GET', `/messages/${convId}`, { token: outsider.token })).status, 403);
        assert.equal((await api('POST', '/messages/send', { token: outsider.token, body: { conversation_id: convId, message: 'x' } })).status, 403);
        assert.equal((await api('PATCH', `/messages/${convId}/read`, { token: outsider.token })).status, 403);
        assert.equal((await api('GET', '/messages/not-a-uuid', { token: a.token })).status, 400);
        assert.equal((await api('GET', '/messages/33333333-3333-4333-8333-333333333333', { token: a.token })).status, 404);
    });

    test('validates request & message payloads; dedicated workflows are not duplicated', async () => {
        const a = await signup();
        const b = await signup();
        assert.equal((await api('POST', '/requests', { token: a.token, body: { receiver_id: 'nope', type: 'general' } })).status, 400);
        assert.equal((await api('POST', '/requests', { token: a.token, body: { receiver_id: a.id, type: 'general' } })).status, 400);
        assert.equal((await api('POST', '/requests', { token: a.token, body: { receiver_id: b.id, type: 'mentorship' } })).status, 400);
        assert.equal((await api('POST', '/messages/send', { token: a.token, body: { conversation_id: '44444444-4444-4444-8444-444444444444', message: '   ' } })).status, 400);
        assert.equal((await api('POST', '/messages/send', { token: a.token, body: { message: 'x' } })).status, 400);
    });

    test('empty states: no conversations, no requests', async () => {
        const a = await signup();
        assert.deepEqual((await api('GET', '/messages/conversations', { token: a.token })).body.conversations, []);
        assert.deepEqual((await api('GET', '/messages/requests', { token: a.token })).body.requests, []);
    });
});

describe('notifications', () => {
    test('list is scoped to the user, unread count, mark one / mark all', async () => {
        const a = await signup();
        const b = await signup();
        const empty = await api('GET', '/notifications', { token: a.token });
        assert.deepEqual(empty.body.notifications, []);
        assert.equal(empty.body.unread_count, 0);

        await api('POST', `/follow/user/${a.id}`, { token: b.token });
        const c = await signup();
        await api('POST', `/follow/user/${a.id}`, { token: c.token });

        const list = await api('GET', '/notifications', { token: a.token });
        assert.equal(list.body.notifications.length, 2);
        assert.equal(list.body.unread_count, 2);
        assert.equal(list.body.notifications[0].actor_name != null, true);
        assert.equal((await api('GET', '/notifications', { token: b.token })).body.notifications.length, 0);

        const nid = list.body.notifications[0].id;
        assert.equal((await api('PATCH', `/notifications/${nid}/read`, { token: b.token })).status, 404, "cannot touch someone else's notification");
        assert.equal((await api('PATCH', `/notifications/${nid}/read`, { token: a.token })).status, 200);
        assert.equal((await api('GET', '/notifications', { token: a.token })).body.unread_count, 1);
        assert.equal((await api('POST', '/notifications/read', { token: a.token })).status, 200);
        assert.equal((await api('GET', '/notifications', { token: a.token })).body.unread_count, 0);
        assert.equal((await api('PATCH', '/notifications/bad/read', { token: a.token })).status, 400);
    });
});

describe('public member profile', () => {
    test('returns a real public profile with counts; 404 / 400 for unknown or invalid ids', async () => {
        const a = await signup();
        const b = await signup('MENTOR');
        await api('POST', `/follow/user/${b.id}`, { token: a.token });
        const res = await api('GET', `/community/${b.id}`, { token: a.token });
        assert.equal(res.status, 200);
        assert.equal(res.body.member.username, b.username);
        assert.equal(res.body.member.followers_count, 1);
        assert.equal(res.body.member.is_following, true);
        assert.equal(res.body.member.email, undefined);
        assert.equal((await api('GET', '/community/55555555-5555-4555-8555-555555555555', { token: a.token })).status, 404);
        assert.equal((await api('GET', '/community/nope', { token: a.token })).status, 400);
    });
});
