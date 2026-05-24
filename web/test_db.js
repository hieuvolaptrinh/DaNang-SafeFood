const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_JTXH9DNq3Fwv@ep-cool-bread-ao4jwz0n-pooler.c-2.ap-southeast-1.aws.neon.tech/danang_safefood?sslmode=require',
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT COUNT(*) FROM ho_so_thanh_tra WHERE nhanxetchung LIKE '%__SAFEFOOD_CHECKLIST__%'");
  console.log('Count:', res.rows[0].count);
  await client.end();
}

run();
