const http = require('http');

const loginReq = http.request('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const loginRes = JSON.parse(data);
      const token = loginRes.data?.accessToken || loginRes.accessToken;
      if (!token) throw new Error('No token: ' + data);
      
      http.get('http://localhost:8080/api/v1/ho-so-thanh-tra?page=0&size=2', {
        headers: { 'Authorization': 'Bearer ' + token }
      }, (res2) => {
        let data2 = '';
        res2.on('data', c => data2 += c);
        res2.on('end', () => console.log('API RESPONSE:', JSON.stringify(JSON.parse(data2), null, 2)));
      });
    } catch (e) {
      console.log('Login failed:', e.message);
    }
  });
});

loginReq.write(JSON.stringify({ username: 'cb_thanhtra', password: '123' })); // standard test user
loginReq.end();
