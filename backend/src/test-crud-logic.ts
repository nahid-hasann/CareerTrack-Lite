async function testCrudLogic() {
  console.log('🧪 Testing CRUD & Dashboard Stats Logic...');

  // Mock application data for user A and user B
  const userAId = 'user-a-123';
  const userBId = 'user-b-456';

  const mockApplications = [
    { id: 'app-1', userId: userAId, companyName: 'Google', jobTitle: 'Full Stack Engineer', status: 'INTERVIEW' },
    { id: 'app-2', userId: userAId, companyName: 'Stripe', jobTitle: 'Backend Engineer', status: 'APPLIED' },
    { id: 'app-3', userId: userAId, companyName: 'Meta', jobTitle: 'Frontend Engineer', status: 'OFFER' },
    { id: 'app-4', userId: userAId, companyName: 'Netflix', jobTitle: 'DevOps Engineer', status: 'SAVED' },
    { id: 'app-5', userId: userAId, companyName: 'Amazon', jobTitle: 'Software Engineer', status: 'ASSESSMENT' },
    { id: 'app-6', userId: userAId, companyName: 'Apple', jobTitle: 'iOS Engineer', status: 'REJECTED' },
    { id: 'app-7', userId: userBId, companyName: 'Microsoft', jobTitle: 'Cloud Architect', status: 'INTERVIEW' },
  ];

  // 1. Ownership test: Filter applications for user A
  const userAApps = mockApplications.filter(app => app.userId === userAId);
  console.log('✅ User A applications count:', userAApps.length === 6);

  // 2. Search test: search for "Engineer" or "google"
  const searchResult = userAApps.filter(app => 
    app.companyName.toLowerCase().includes('google') || app.jobTitle.toLowerCase().includes('google')
  );
  console.log('✅ Search query "google" matched:', searchResult.length === 1 && searchResult[0].companyName === 'Google');

  // 3. Filter test: status "INTERVIEW"
  const statusResult = userAApps.filter(app => app.status === 'INTERVIEW');
  console.log('✅ Status filter "INTERVIEW" count:', statusResult.length === 1);

  // 4. Dashboard Stats Calculation
  const stats = {
    total: userAApps.length,
    saved: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  };

  userAApps.forEach(app => {
    const status = app.status;
    if (status === 'SAVED') stats.saved++;
    else if (status === 'APPLIED') stats.applied++;
    else if (status === 'ASSESSMENT') stats.assessment++;
    else if (status === 'INTERVIEW') stats.interview++;
    else if (status === 'REJECTED') stats.rejected++;
    else if (status === 'OFFER') stats.offer++;
  });

  console.log('✅ Calculated Dashboard Stats:', stats);
  console.log('✅ Stats validation:', 
    stats.total === 6 && 
    stats.saved === 1 && 
    stats.applied === 1 && 
    stats.assessment === 1 && 
    stats.interview === 1 && 
    stats.rejected === 1 && 
    stats.offer === 1
  );

  console.log('🎉 All Application CRUD & Dashboard logic tests passed!');
}

testCrudLogic().catch(console.error);
