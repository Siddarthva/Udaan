/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. Drop old tables if they exist to clear space
    await knex.schema.dropTableIfExists('messages');
    await knex.schema.dropTableIfExists('conversations');
    await knex.schema.dropTableIfExists('investments');
    await knex.schema.dropTableIfExists('mentorship_requests');
    await knex.schema.dropTableIfExists('startup_members');
    await knex.schema.dropTableIfExists('startup_documents');
    await knex.schema.dropTableIfExists('saved_startups');
    await knex.schema.dropTableIfExists('mentor_requests');
    await knex.schema.dropTableIfExists('investor_interest');
    await knex.schema.dropTableIfExists('startups');
    await knex.schema.dropTableIfExists('projects');
    await knex.schema.dropTableIfExists('users');

    // 2. Create users table
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('role').notNullable(); // e.g. Innovator, Sponsor, Mentor, Admin
        table.string('name').notNullable();
        table.string('avatar_url').nullable();
        table.text('bio').nullable();
        table.jsonb('skills').nullable();
        table.string('linkedin_url').nullable();
        table.string('whatsapp_number').nullable();
        table.jsonb('contact_links').nullable();
        table.boolean('verified').defaultTo(false);
        table.text('refresh_token').nullable();
        table.timestamps(true, true); // Adds created_at and updated_at
        
        table.index('email');
    });

    // 3. Create startups table
    await knex.schema.createTable('startups', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.string('domain').notNullable(); // AgriTech, HealthTech, etc.
        table.string('stage').notNullable(); // Idea, MVP, Seed, Scale
        table.decimal('funding_required', 15, 2).defaultTo(0);
        table.decimal('raised', 15, 2).defaultTo(0);
        table.string('pitch_deck_url').nullable();
        table.jsonb('image_urls').nullable();
        table.timestamps(true, true);

        table.index('owner_id');
        table.index('domain');
        table.index('stage');
    });

    // 4. Create startup_members table
    await knex.schema.createTable('startup_members', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE').notNullable();
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').nullable();
        table.string('name').notNullable();
        table.string('role').notNullable(); // e.g. CTO, Co-Founder
        table.string('avatar_url').nullable();
        table.timestamps(true, true);

        table.index('startup_id');
    });

    // 5. Create mentor_requests table
    await knex.schema.createTable('mentor_requests', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('mentor_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE').notNullable();
        table.text('message').notNullable();
        table.string('status').defaultTo('pending').notNullable(); // pending, accepted, rejected
        table.timestamps(true, true);

        table.index(['mentor_id', 'startup_id']);
        table.unique(['mentor_id', 'startup_id']);
    });

    // 6. Create investor_interest table
    await knex.schema.createTable('investor_interest', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('investor_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE').notNullable();
        table.text('notes').nullable();
        table.string('status').defaultTo('expressed').notNullable(); // expressed, etc.
        table.timestamps(true, true);

        table.index(['investor_id', 'startup_id']);
        table.unique(['investor_id', 'startup_id']);
    });

    // 7. Create startup_documents table
    await knex.schema.createTable('startup_documents', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE').notNullable();
        table.string('name').notNullable();
        table.string('file_url').notNullable();
        table.string('file_type').notNullable(); // e.g. pitch_deck, financials, other
        table.timestamps(true, true);

        table.index('startup_id');
    });

    // 8. Create saved_startups table
    await knex.schema.createTable('saved_startups', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.uuid('startup_id').references('id').inTable('startups').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);

        table.index(['user_id', 'startup_id']);
        table.unique(['user_id', 'startup_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('saved_startups');
    await knex.schema.dropTableIfExists('startup_documents');
    await knex.schema.dropTableIfExists('investor_interest');
    await knex.schema.dropTableIfExists('mentor_requests');
    await knex.schema.dropTableIfExists('startup_members');
    await knex.schema.dropTableIfExists('startups');
    await knex.schema.dropTableIfExists('users');
};
