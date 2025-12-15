const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔄 Intentando conectar a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    const result = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`📊 Usuarios en la base de datos: ${result.rows[0].count}`);
    
    await client.end();
    console.log('✅ Conexión cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

testConnection();
