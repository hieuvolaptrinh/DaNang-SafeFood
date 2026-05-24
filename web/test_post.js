const http = require('http');

const req = http.request('http://localhost:8080/api/v1/ho-so-thanh-tra', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // We don't have auth token easily accessible here, wait.
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});

req.on('error', console.error);

req.write(JSON.stringify({
  facilityId: '1',
  inspectionTime: '2026-05-24T10:00:00',
  conclusion: 'pass',
  checklist: { test: 'pass' },
  generalComment: 'Test from script'
}));

req.end();
