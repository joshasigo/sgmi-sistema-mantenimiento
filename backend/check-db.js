// Script para verificar el esquema de la base de datos
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos\n');

    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tablas en la base de datos:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Verificar columnas de ordenes_trabajo
    console.log('\n📊 Columnas de ordenes_trabajo:');
    const columnsOrdenes = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ordenes_trabajo'
      ORDER BY ordinal_position;
    `);

    columnsOrdenes.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Verificar columnas de inventario
    console.log('\n📦 Columnas de inventario:');
    const columnsInventario = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'inventario'
      ORDER BY ordinal_position;
    `);

    columnsInventario.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Verificar columnas de usuarios
    console.log('\n👥 Columnas de usuarios:');
    const columnsUsuarios = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position;
    `);

    columnsUsuarios.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Contar registros
    console.log('\n📈 Conteo de registros:');
    const countOrdenes = await client.query('SELECT COUNT(*) FROM ordenes_trabajo');
    console.log(`  - Órdenes de trabajo: ${countOrdenes.rows[0].count}`);

    const countInventario = await client.query('SELECT COUNT(*) FROM inventario');
    console.log(`  - Items inventario: ${countInventario.rows[0].count}`);

    const countUsuarios = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`  - Usuarios: ${countUsuarios.rows[0].count}`);

    await client.end();
    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

checkDatabase();
