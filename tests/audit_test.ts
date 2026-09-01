// Automated End-to-End API and Business Logic Test Suite
const BASE_URL = 'http://localhost:3000/api';

async function runAuditTests() {
  console.log('🚀 Memulai Full Functional Audit Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Test GET /api/leads
    console.log('1. Testing Leads API:');
    const resLeads = await fetch(`${BASE_URL}/leads`);
    const jsonLeads = await resLeads.json();
    assert(resLeads.status === 200 && jsonLeads.success === true, 'GET /api/leads mengembalikan 200 OK & success');
    assert(Array.isArray(jsonLeads.data), 'GET /api/leads mengembalikan array data lead');

    // 2. Test POST /api/leads (Create Lead)
    console.log('\n2. Testing Create Lead (CREATE):');
    const newLeadPayload = {
      name: 'Audit Test Customer ' + Date.now(),
      phone: '081234567899',
      city: 'Jakarta',
      source: 'WhatsApp',
      productId: 'Produk A — Starter Plan',
      status: 'Warm',
      initialNotes: 'Customer dari automated audit test',
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpTime: '11:00',
    };
    const resCreate = await fetch(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLeadPayload),
    });
    const jsonCreate = await resCreate.json();
    assert((resCreate.status === 200 || resCreate.status === 201) && jsonCreate.success === true, 'POST /api/leads berhasil membuat lead baru');
    const createdId = jsonCreate.data?.id;
    assert(typeof createdId === 'string', `Lead ID terbuat: ${createdId}`);

    // 3. Test GET /api/leads/[id] (Read Lead Detail)
    console.log('\n3. Testing Read Lead Detail (READ):');
    const resDetail = await fetch(`${BASE_URL}/leads/${createdId}`);
    const jsonDetail = await resDetail.json();
    assert(resDetail.status === 200 && jsonDetail.success === true, 'GET /api/leads/[id] mengembalikan detail lead');
    assert(jsonDetail.data?.name === newLeadPayload.name, 'Detail nama sesuai dengan data yang disimpan');

    // 4. Test PUT /api/leads/[id] (Update Lead & Status Change)
    console.log('\n4. Testing Update Lead (UPDATE):');
    const updatePayload = {
      name: newLeadPayload.name + ' (Updated)',
      status: 'Hot',
      initialNotes: 'Updated catatan audit',
    };
    const resUpdate = await fetch(`${BASE_URL}/leads/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    const jsonUpdate = await resUpdate.json();
    assert(resUpdate.status === 200 && jsonUpdate.success === true, 'PUT /api/leads/[id] berhasil update lead');
    assert(jsonUpdate.data?.status === 'Hot', 'Status lead berhasil berubah menjadi Hot');

    // 5. Test POST /api/leads/[id]/follow-ups (Add Follow Up)
    console.log('\n5. Testing Log Follow Up (FOLLOW-UP):');
    const fuPayload = {
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      method: 'WhatsApp',
      result: 'Siap Membeli',
      notes: 'Customer setuju proposal penawaran',
      oldStatus: 'Hot',
      newStatus: 'Closing',
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpTime: '15:00',
    };
    const resFU = await fetch(`${BASE_URL}/leads/${createdId}/follow-ups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fuPayload),
    });
    const jsonFU = await resFU.json();
    assert((resFU.status === 200 || resFU.status === 201) && jsonFU.success === true, 'POST /api/leads/[id]/follow-ups berhasil mencatat follow up');

    // Verify detail reflects follow-up
    const resDetailAfterFU = await fetch(`${BASE_URL}/leads/${createdId}`);
    const jsonDetailAfterFU = await resDetailAfterFU.json();
    assert(jsonDetailAfterFU.data?.followUps?.length > 0, 'Riwayat follow-up muncul pada detail lead');
    assert(jsonDetailAfterFU.data?.status === 'Closing', 'Status lead otomatis terupdate menjadi Closing');

    // 6. Test GET /api/follow-ups/summary
    console.log('\n6. Testing Follow-up Summary:');
    const resFUSummary = await fetch(`${BASE_URL}/follow-ups/summary`);
    const jsonFUSummary = await resFUSummary.json();
    assert(resFUSummary.status === 200 && jsonFUSummary.success === true, 'GET /api/follow-ups/summary mengembalikan summary');

    // 7. Test DELETE /api/leads/[id] (Delete Lead)
    console.log('\n7. Testing Delete Lead (DELETE):');
    const resDelete = await fetch(`${BASE_URL}/leads/${createdId}`, {
      method: 'DELETE',
    });
    const jsonDelete = await resDelete.json();
    assert(resDelete.status === 200 && jsonDelete.success === true, 'DELETE /api/leads/[id] berhasil menghapus lead');

    // Verify soft delete: GET should return 404
    const resVerifyDelete = await fetch(`${BASE_URL}/leads/${createdId}`);
    assert(resVerifyDelete.status === 404, 'Lead yang dihapus tidak ditemukan lagi (404)');

    // 8. Test Profile API
    console.log('\n8. Testing Profile API:');
    const resProfile = await fetch(`${BASE_URL}/profile`);
    const jsonProfile = await resProfile.json();
    assert(resProfile.status === 200 && jsonProfile.success === true, 'GET /api/profile mengembalikan profile data');
    assert(jsonProfile.data?.name === 'Budi Sales', 'Profile name adalah "Budi Sales"');

    // Update Profile
    const resUpdateProfile = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Budi Sales',
        email: 'budi.sales@perusahaan.co.id',
        phone: '081288991234',
        role: 'Sales',
        monthlyTarget: 25,
      }),
    });
    const jsonUpdateProfile = await resUpdateProfile.json();
    assert(resUpdateProfile.status === 200 && jsonUpdateProfile.data?.monthlyTarget === 25, 'PUT /api/profile berhasil update target');

    // 9. Test Reports & Masters API
    console.log('\n9. Testing Reports & Master Data APIs:');
    const resCities = await fetch(`${BASE_URL}/cities`);
    const jsonCities = await resCities.json();
    assert(resCities.status === 200 && jsonCities.data?.length > 0, 'GET /api/cities mengembalikan master kota');

    const resProducts = await fetch(`${BASE_URL}/products`);
    const jsonProducts = await resProducts.json();
    assert(resProducts.status === 200 && jsonProducts.data?.length > 0, 'GET /api/products mengembalikan master produk');

    const resRepDash = await fetch(`${BASE_URL}/reports/dashboard`);
    assert(resRepDash.status === 200, 'GET /api/reports/dashboard 200 OK');

    const resRepPerf = await fetch(`${BASE_URL}/reports/performance`);
    assert(resRepPerf.status === 200, 'GET /api/reports/performance 200 OK');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n=========================================');
  console.log(`📊 HASIL TEST: ${passed} PASS, ${failed} FAIL`);
  console.log('=========================================\n');
  if (failed > 0) process.exit(1);
}

runAuditTests();
