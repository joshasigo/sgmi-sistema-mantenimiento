const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAllTables() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos\n');

    // 1. Ver todas las tablas
    console.log('📋 TABLAS EN LA BASE DE DATOS:');
    console.log('='.repeat(60));
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    // 2. Contar registros en cada tabla
    console.log('\n📊 CONTEO DE REGISTROS:');
    console.log('='.repeat(60));
    
    const countUsuarios = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`  Usuarios: ${countUsuarios.rows[0].count}`);

    const countRoles = await client.query('SELECT COUNT(*) FROM roles');
    console.log(`  Roles: ${countRoles.rows[0].count}`);

    const countOrdenes = await client.query('SELECT COUNT(*) FROM ordenes_trabajo');
    console.log(`  Órdenes de trabajo: ${countOrdenes.rows[0].count}`);

    const countInventario = await client.query('SELECT COUNT(*) FROM inventario');
    console.log(`  Inventario: ${countInventario.rows[0].count}`);

    const countProyectos = await client.query('SELECT COUNT(*) FROM proyectos');
    console.log(`  Proyectos: ${countProyectos.rows[0].count}`);

    const countNovedades = await client.query('SELECT COUNT(*) FROM novedades');
    console.log(`  Novedades: ${countNovedades.rows[0].count}`);

    // 3. Ver estructura de ordenes_trabajo
    console.log('\n🔧 ESTRUCTURA DE ordenes_trabajo:');
    console.log('='.repeat(60));
    const ordenesColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ordenes_trabajo'
      ORDER BY ordinal_position;
    `);
    ordenesColumns.rows.forEach(row => {
      console.log(`  ${row.column_name.padEnd(25)} ${row.data_type.padEnd(25)} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 4. Ver datos de ejemplo de órdenes
    console.log('\n📝 EJEMPLO DE ÓRDENES (primeras 3):');
    console.log('='.repeat(60));
    const ordenesEjemplo = await client.query(`
      SELECT id, equipo, tipo, prioridad, estado, descripcion, progreso 
      FROM ordenes_trabajo 
      LIMIT 3
    `);
    ordenesEjemplo.rows.forEach(orden => {
      console.log(`  ID: ${orden.id}`);
      console.log(`  Equipo: ${orden.equipo}`);
      console.log(`  Tipo: ${orden.tipo} | Prioridad: ${orden.prioridad} | Estado: ${orden.estado}`);
      console.log(`  Progreso: ${orden.progreso}%`);
      console.log(`  Descripción: ${orden.descripcion || '(sin descripción)'}`);
      console.log('  ---');
    });

    // 5. Ver estructura de inventario
    console.log('\n📦 ESTRUCTURA DE inventario:');
    console.log('='.repeat(60));
    const inventarioColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'inventario'
      ORDER BY ordinal_position;
    `);
    inventarioColumns.rows.forEach(row => {
      console.log(`  ${row.column_name.padEnd(25)} ${row.data_type.padEnd(25)} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 6. Ver datos de ejemplo de inventario
    console.log('\n📝 EJEMPLO DE INVENTARIO (primeros 5):');
    console.log('='.repeat(60));
    const inventarioEjemplo = await client.query(`
      SELECT id, nombre, codigo, categoria, cantidad, stock_minimo, ubicacion 
      FROM inventario 
      LIMIT 5
    `);
    inventarioEjemplo.rows.forEach(item => {
      console.log(`  ID: ${item.id} | Código: ${item.codigo}`);
      console.log(`  Nombre: ${item.nombre}`);
      console.log(`  Categoría: ${item.categoria || '(sin categoría)'}`);
      console.log(`  Cantidad: ${item.cantidad} | Stock mínimo: ${item.stock_minimo}`);
      console.log(`  Ubicación: ${item.ubicacion || '(sin ubicación)'}`);
      console.log('  ---');
    });

    // 7. Verificar roles y usuarios de ejemplo
    console.log('\n👥 ROLES DISPONIBLES:');
    console.log('='.repeat(60));
    const roles = await client.query('SELECT id, nombre FROM roles ORDER BY id');
    roles.rows.forEach(rol => {
      console.log(`  ID: ${rol.id} - ${rol.nombre}`);
    });

    console.log('\n👤 USUARIOS DE EJEMPLO (primeros 3):');
    console.log('='.repeat(60));
    const usuarios = await client.query(`
      SELECT u.id, u.nombre, u.email, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      LIMIT 3
    `);
    usuarios.rows.forEach(user => {
      console.log(`  ${user.nombre} (${user.email})`);
      console.log(`  Rol: ${user.rol_nombre}`);
      console.log(`  ID: ${user.id}`);
      console.log('  ---');
    });

    await client.end();
    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Detalles completos:', error);
    await client.end();
    process.exit(1);
  }
}

checkAllTables();
