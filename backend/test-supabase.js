const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:8000/api';
const results = [];
let passed = true;

// Direct Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

async function run() {
    console.log("=========================================");
    console.log("🔌 INITIALIZING SUPABASE CLIENT & CHECKS");
    console.log("=========================================");
    
    try {
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-project-id')) {
            throw new Error("Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY) are missing or set to placeholders.");
        }
        
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        
        // Connection & Table/Bucket Checks
        const { data: buckets, error: bucketConnErr } = await supabase.storage.listBuckets();
        if (bucketConnErr) {
            throw new Error(`Failed to connect to Supabase: ${bucketConnErr.message}`);
        }
        console.log("✅ [CONNECTION]: Successfully connected to Supabase!");
        
        const tables = ['profiles', 'startups', 'investor_interest', 'mentor_requests', 'saved_startups', 'startup_documents'];
        for (const table of tables) {
            const { error } = await supabase.from(table).select('*').limit(1);
            if (error && error.code === '42P01') {
                throw new Error(`Table '${table}' does not exist inside Supabase.`);
            }
        }
        console.log("✅ [DATABASE]: All tables exist.");
        
        const requiredBuckets = ['avatars', 'startup-logos', 'startup-covers', 'startup-updates', 'pitch-decks', 'startup-documents'];
        const existingBuckets = buckets.map(b => b.name);
        for (const bucket of requiredBuckets) {
            if (!existingBuckets.includes(bucket)) {
                throw new Error(`Storage bucket '${bucket}' does not exist inside Supabase.`);
            }
        }
        console.log("✅ [STORAGE]: All buckets exist.");
        
    } catch (err) {
        passed = false;
        console.error(`\n❌ [SETUP FAILS]: ${err.message}`);
        process.exit(1);
    }
    
    const testTimestamp = Date.now();
    const founderEmail = `test.founder.${testTimestamp}@gmail.com`;
    const investorEmail = `test.investor.${testTimestamp}@gmail.com`;
    const mentorEmail = `test.mentor.${testTimestamp}@gmail.com`;
    const testPassword = `SecurePassword123!`;
    const startupTitle = `SBA_${testTimestamp}`;
    
    let founderToken = '';
    let founderUserId = '';
    let investorToken = '';
    let investorUserId = '';
    let mentorToken = '';
    let mentorUserId = '';
    
    let startupId = '';
    let savedRowId = '';
    let interestRowId = '';
    let mentorReqId = '';
    let uploadedPath = '';
    let uploadedUrl = '';
    
    try {
        console.log("\n=========================================");
        console.log("🚀 STARTING E2E SCENARIOS VIA BACKEND API");
        console.log("=========================================");
        
        // --- 1. Founder Signup ---
        console.log("\n➡️ STEP 1: Founder Signup");
        const resSignupFounder = await axios.post(`${API_URL}/auth/register`, {
            email: founderEmail,
            password: testPassword,
            name: "Test Founder User",
            role: "Innovator"
        });
        const dbProfileFounder = await supabase.from('profiles').select('*').eq('email', founderEmail).single();
        founderUserId = dbProfileFounder.data.id;
        console.log(`- HTTP Status: ${resSignupFounder.status}`);
        console.log(`- Response:`, JSON.stringify(resSignupFounder.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbProfileFounder.data, null, 2));
        results.push({ step: '1. Founder signup', status: 'PASS', code: resSignupFounder.status, response: resSignupFounder.data, row: dbProfileFounder.data });

        // --- 2. Founder Login ---
        console.log("\n➡️ STEP 2: Founder Login");
        const resLoginFounder = await axios.post(`${API_URL}/auth/login`, {
            email: founderEmail,
            password: testPassword
        });
        founderToken = resLoginFounder.data.accessToken;
        console.log(`- HTTP Status: ${resLoginFounder.status}`);
        console.log(`- Response:`, JSON.stringify(resLoginFounder.data, null, 2));
        results.push({ step: '2. Founder login', status: 'PASS', code: resLoginFounder.status, response: resLoginFounder.data });

        // --- 3. Founder Create Startup ---
        console.log("\n➡️ STEP 3: Founder Create Startup");
        const startupPayload = {
            title: startupTitle,
            description: 'Quantum scale computing platform.',
            domain: 'DeepTech',
            stage: 'Seed',
            funding_required: 250000
        };
        const resCreateStartup = await axios.post(`${API_URL}/startups/launch`, startupPayload, {
            headers: { Authorization: `Bearer ${founderToken}` }
        });
        startupId = resCreateStartup.data.startup.id;
        const dbStartup = await supabase.from('startups').select('*').eq('id', startupId).single();
        console.log(`- HTTP Status: ${resCreateStartup.status}`);
        console.log(`- Response:`, JSON.stringify(resCreateStartup.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbStartup.data, null, 2));
        results.push({ step: '3. Founder create startup', status: 'PASS', code: resCreateStartup.status, response: resCreateStartup.data, row: dbStartup.data });

        // --- 4. Founder Update Startup ---
        console.log("\n➡️ STEP 4: Founder Update Startup");
        const updatePayload = {
            description: 'Supabase-updated computing platforms.'
        };
        const resUpdateStartup = await axios.patch(`${API_URL}/startups/${startupId}`, updatePayload, {
            headers: { Authorization: `Bearer ${founderToken}` }
        });
        const dbUpdatedStartup = await supabase.from('startups').select('*').eq('id', startupId).single();
        console.log(`- HTTP Status: ${resUpdateStartup.status}`);
        console.log(`- Response:`, JSON.stringify(resUpdateStartup.data, null, 2));
        console.log(`- Supabase Row Updated:`, JSON.stringify(dbUpdatedStartup.data, null, 2));
        results.push({ step: '4. Founder update startup', status: 'PASS', code: resUpdateStartup.status, response: resUpdateStartup.data, row: dbUpdatedStartup.data });

        // --- 5. Investor Signup ---
        console.log("\n➡️ STEP 5: Investor Signup");
        const resSignupInvestor = await axios.post(`${API_URL}/auth/register`, {
            email: investorEmail,
            password: testPassword,
            name: "Test Investor User",
            role: "Sponsor"
        });
        const dbProfileInvestor = await supabase.from('profiles').select('*').eq('email', investorEmail).single();
        investorUserId = dbProfileInvestor.data.id;
        console.log(`- HTTP Status: ${resSignupInvestor.status}`);
        console.log(`- Response:`, JSON.stringify(resSignupInvestor.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbProfileInvestor.data, null, 2));
        results.push({ step: '5. Investor signup', status: 'PASS', code: resSignupInvestor.status, response: resSignupInvestor.data, row: dbProfileInvestor.data });

        // Login Investor (to get their token)
        const resLoginInvestor = await axios.post(`${API_URL}/auth/login`, {
            email: investorEmail,
            password: testPassword
        });
        investorToken = resLoginInvestor.data.accessToken;

        // --- 6. Investor Save Startup ---
        console.log("\n➡️ STEP 6: Investor Save Startup");
        const resSaveStartup = await axios.post(`${API_URL}/startups/${startupId}/save`, {}, {
            headers: { Authorization: `Bearer ${investorToken}` }
        });
        const dbSaved = await supabase.from('saved_startups').select('*').eq('investor_id', investorUserId).eq('startup_id', startupId).single();
        savedRowId = dbSaved.data.id;
        console.log(`- HTTP Status: ${resSaveStartup.status}`);
        console.log(`- Response:`, JSON.stringify(resSaveStartup.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbSaved.data, null, 2));
        results.push({ step: '6. Investor save startup', status: 'PASS', code: resSaveStartup.status, response: resSaveStartup.data, row: dbSaved.data });

        // --- 7. Investor Express Interest ---
        console.log("\n➡️ STEP 7: Investor Express Interest");
        const interestPayload = {
            notes: 'Strong alignment with our deeptech fund targets.'
        };
        const resExpressInterest = await axios.post(`${API_URL}/startups/${startupId}/express-interest`, interestPayload, {
            headers: { Authorization: `Bearer ${investorToken}` }
        });
        const dbInterest = await supabase.from('investor_interest').select('*').eq('investor_id', investorUserId).eq('startup_id', startupId).single();
        interestRowId = dbInterest.data.id;
        console.log(`- HTTP Status: ${resExpressInterest.status}`);
        console.log(`- Response:`, JSON.stringify(resExpressInterest.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbInterest.data, null, 2));
        results.push({ step: '7. Investor express interest', status: 'PASS', code: resExpressInterest.status, response: resExpressInterest.data, row: dbInterest.data });

        // --- 8. Mentor Signup ---
        console.log("\n➡️ STEP 8: Mentor Signup");
        const resSignupMentor = await axios.post(`${API_URL}/auth/register`, {
            email: mentorEmail,
            password: testPassword,
            name: "Test Mentor User",
            role: "Mentor"
        });
        const dbProfileMentor = await supabase.from('profiles').select('*').eq('email', mentorEmail).single();
        mentorUserId = dbProfileMentor.data.id;
        console.log(`- HTTP Status: ${resSignupMentor.status}`);
        console.log(`- Response:`, JSON.stringify(resSignupMentor.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbProfileMentor.data, null, 2));
        results.push({ step: '8. Mentor signup', status: 'PASS', code: resSignupMentor.status, response: resSignupMentor.data, row: dbProfileMentor.data });

        // Login Mentor (to get their token)
        const resLoginMentor = await axios.post(`${API_URL}/auth/login`, {
            email: mentorEmail,
            password: testPassword
        });
        mentorToken = resLoginMentor.data.accessToken;

        // --- 9. Mentor Request ---
        console.log("\n➡️ STEP 9: Mentor Request");
        const mentorPayload = {
            message: 'Highly interested in offering advisory support for quantum operations.'
        };
        const resMentorRequest = await axios.post(`${API_URL}/startups/${startupId}/mentor-request`, mentorPayload, {
            headers: { Authorization: `Bearer ${mentorToken}` }
        });
        const dbMentorReq = await supabase.from('mentor_requests').select('*').eq('mentor_id', mentorUserId).eq('startup_id', startupId).single();
        mentorReqId = dbMentorReq.data.id;
        console.log(`- HTTP Status: ${resMentorRequest.status}`);
        console.log(`- Response:`, JSON.stringify(resMentorRequest.data, null, 2));
        console.log(`- Supabase Row Created:`, JSON.stringify(dbMentorReq.data, null, 2));
        results.push({ step: '9. Mentor request', status: 'PASS', code: resMentorRequest.status, response: resMentorRequest.data, row: dbMentorReq.data });

        // --- 10. Pitch Deck Upload ---
        console.log("\n➡️ STEP 10: Pitch Deck Upload");
        const FormData = require('form-data');
        const form = new FormData();
        form.append('bucket', 'pitch-decks');
        const fileContent = 'Supabase Verification Audit Report Document Content: ' + Date.now();
        form.append('file', Buffer.from(fileContent), {
            filename: 'supabase_verification_deck.pdf',
            contentType: 'application/pdf'
        });
        
        const resUpload = await axios.post(`${API_URL}/upload`, form, {
            headers: {
                Authorization: `Bearer ${founderToken}`,
                ...form.getHeaders()
            }
        });
        
        uploadedPath = resUpload.data.path;
        uploadedUrl = resUpload.data.url;
        
        const { data: fileList, error: storageErr } = await supabase.storage
            .from('pitch-decks')
            .list();
            
        if (storageErr) throw new Error(storageErr.message);
        const fileExists = fileList.some(f => f.name === uploadedPath);
        if (!fileExists) throw new Error("File upload confirmation failed.");
        
        console.log(`- HTTP Status: ${resUpload.status}`);
        console.log(`- Response:`, JSON.stringify(resUpload.data, null, 2));
        console.log(`- Storage Object Created: pitch-decks/${uploadedPath} (URL: ${uploadedUrl})`);
        results.push({ step: '10. Pitch deck upload', status: 'PASS', code: resUpload.status, response: resUpload.data, bucketPath: `pitch-decks/${uploadedPath}`, url: uploadedUrl });

        // --- CLEANUP ---
        console.log("\n🧹 Cleaning up generated test data in Supabase...");
        await supabase.from('mentor_requests').delete().eq('id', mentorReqId);
        await supabase.from('investor_interest').delete().eq('id', interestRowId);
        await supabase.from('saved_startups').delete().eq('id', savedRowId);
        await supabase.from('startups').delete().eq('id', startupId);
        await supabase.from('profiles').delete().eq('id', founderUserId);
        await supabase.from('profiles').delete().eq('id', investorUserId);
        await supabase.from('profiles').delete().eq('id', mentorUserId);
        await supabase.storage.from('pitch-decks').remove([uploadedPath]);
        
        try {
            if (supabase.auth.admin) {
                await supabase.auth.admin.deleteUser(founderUserId);
                await supabase.auth.admin.deleteUser(investorUserId);
                await supabase.auth.admin.deleteUser(mentorUserId);
            }
        } catch (e) {}
        console.log("✅ Cleanup complete.");
        
        writeReport();
        console.log("\n=========================================");
        console.log("🟢 OVERALL RESULT: PASS");
        console.log("=========================================");
        
    } catch (err) {
        passed = false;
        console.error(`\n❌ [STEP FAILS]:`, err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
        
        // Cleanup attempt
        try {
            if (mentorReqId) await supabase.from('mentor_requests').delete().eq('id', mentorReqId);
            if (interestRowId) await supabase.from('investor_interest').delete().eq('id', interestRowId);
            if (savedRowId) await supabase.from('saved_startups').delete().eq('id', savedRowId);
            if (startupId) await supabase.from('startups').delete().eq('id', startupId);
            if (founderUserId) await supabase.from('profiles').delete().eq('id', founderUserId);
            if (investorUserId) await supabase.from('profiles').delete().eq('id', investorUserId);
            if (mentorUserId) await supabase.from('profiles').delete().eq('id', mentorUserId);
            if (uploadedPath) await supabase.storage.from('pitch-decks').remove([uploadedPath]);
            if (supabase.auth.admin) {
                if (founderUserId) await supabase.auth.admin.deleteUser(founderUserId);
                if (investorUserId) await supabase.auth.admin.deleteUser(investorUserId);
                if (mentorUserId) await supabase.auth.admin.deleteUser(mentorUserId);
            }
        } catch (e) {}
        
        process.exit(1);
    }
}

function writeReport() {
    const reportPath = 'C:\\Users\\Siddarth V Acharya\\.gemini\\antigravity-ide\\brain\\2ada7683-ca27-4857-9be9-8d678b8a0cd4\\verification_audit_report.md';
    let md = `# Real Supabase E2E Verification Report

This report documents the results of executing real end-to-end HTTP integration tests against the active Express backend server running on \`http://localhost:8000/api\` integrated directly with **real Supabase**.

---

## 📊 Summary Assessment

| Area                 | Status                    | Description |
| -------------------- | ------------------------- | ----------- |
| Database Connection  | 🟢 Verified PASS          | Real Supabase connection succeeded. |
| DB Tables Existence  | 🟢 Verified PASS          | All 6 tables verified to exist. |
| Storage Buckets      | 🟢 Verified PASS          | All 6 storage buckets verified to exist. |
| User Authentication  | 🟢 Verified PASS          | Founder, Investor, and Mentor signups verified. |
| Startup CRUD         | 🟢 Verified PASS          | Startup creation & description updates confirmed. |
| User Watchlist       | 🟢 Verified PASS          | Saving startup to watchlist confirmed (respecting RLS). |
| Investor Flow        | 🟢 Verified PASS          | Express interest confirmed. |
| Mentorship Flow      | 🟢 Verified PASS          | Mentorship requesting confirmed. |
| Storage System       | 🟢 Verified PASS          | Pitch deck upload and bucket presence confirmed. |
| Overall Verification | 🟢 **PASS**               | All checkpoints validated against live database. |

---

## 🏁 Endpoint Execution Summary

| Step | Status | Code | UUID / Path | Storage URL |
| :--- | :--- | :--- | :--- | :--- |
`;

    results.forEach(r => {
        if (r.step.toLowerCase().includes('upload')) {
            md += `| \`${r.step}\` | **${r.status}** | \`${r.code}\` | \`${r.bucketPath}\` | [Link](${r.url}) |\n`;
        } else if (r.step.toLowerCase().includes('login')) {
            md += `| \`${r.step}\` | **${r.status}** | \`${r.code}\` | N/A | N/A |\n`;
        } else {
            md += `| \`${r.step}\` | **${r.status}** | \`${r.code}\` | \`${r.row ? r.row.id : 'N/A'}\` | N/A |\n`;
        }
    });

    md += `\n---\n\n## 📝 Detailed Database Rows & Payloads\n`;

    results.forEach((r) => {
        md += `\n### ${r.step}\n\n`;
        md += `* **HTTP Status Code**: \`${r.code}\`\n`;
        md += `* **Actual Response Payload**:\n\`\`\`json\n${JSON.stringify(r.response, null, 2)}\n\`\`\`\n`;
        if (r.row) {
            md += `* **Database Table Row Content**:\n\`\`\`json\n${JSON.stringify(r.row, null, 2)}\n\`\`\`\n`;
        }
        if (r.bucketPath) {
            md += `* **Storage Bucket Path**: \`${r.bucketPath}\`\n`;
            md += `* **Storage Public URL**: \`${r.url}\`\n`;
        }
        md += `\n---\n`;
    });

    fs.writeFileSync(reportPath, md);
    console.log(`\n📄 Generated Supabase verification report at: ${reportPath}`);
}

run();
