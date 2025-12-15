require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query("SELECT u.email, u.nombre, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE r.nombre = 'Administrador' LIMIT 3"))
  .then(res => {
    console.log('👤 Usuarios Administradores:');
    res.rows.forEach(u => console.log(`  - ${u.nombre} (${u.email})`));
    return client.end();
  })
  .catch(err => {
    console.error('Error:', err.message);
    client.end();
  });
