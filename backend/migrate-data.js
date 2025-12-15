const { PrismaClient } = require('@prisma/client');

// Base de datos ANTIGUA (origen)
const prismaOld = new PrismaClient({
  datasourceUrl: 'postgresql://neondb_owner:npg_xaUQJw1mAC4r@ep-fragrant-sky-ah6b1g8k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

// Base de datos NUEVA (destino)
const prismaNew = new PrismaClient({
  datasourceUrl: 'postgresql://neondb_owner:npg_xle3fqcEZ8aD@ep-wandering-paper-aexjyi6w-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de datos...\n');

    // Probar conexión
    console.log('🔌 Probando conexión a base de datos antigua...');
    await prismaOld.$connect();
    console.log('✅ Conectado a DB antigua\n');
    
    console.log('🔌 Probando conexión a base de datos nueva...');
    await prismaNew.$connect();
    console.log('✅ Conectado a DB nueva\n');

    // 1. Limpiar datos de seed en la nueva DB (skip si no hay datos)
    console.log('🧹 Limpiando datos de seed en la nueva base de datos...');
    try {
      await prismaNew.$executeRawUnsafe('TRUNCATE TABLE "ordenes_trabajo" CASCADE');
      await prismaNew.$executeRawUnsafe('TRUNCATE TABLE "inventario" CASCADE');
      await prismaNew.$executeRawUnsafe('TRUNCATE TABLE "proyectos" CASCADE');
      await prismaNew.$executeRawUnsafe('TRUNCATE TABLE "usuarios" CASCADE');
      await prismaNew.$executeRawUnsafe('TRUNCATE TABLE "roles" CASCADE');
      console.log('✅ Datos de seed eliminados\n');
    } catch (e) {
      console.log('⚠️  Tablas ya están vacías o no existen\n');
    }

    // 2. Migrar Roles
    console.log('📋 Migrando Roles...');
    const roles = await prismaOld.$queryRaw`SELECT * FROM roles`;
    for (const role of roles) {
      await prismaNew.$executeRaw`
        INSERT INTO roles (id, nombre, descripcion, permisos, created_at, updated_at)
        VALUES (${role.id}, ${role.nombre}, ${role.descripcion}, ${role.permisos}::jsonb, ${role.created_at}, ${role.updated_at})
      `;
    }
    console.log(`✅ ${roles.length} roles migrados\n`);

    // 3. Migrar Usuarios
    console.log('👥 Migrando Usuarios...');
    const users = await prismaOld.$queryRaw`SELECT * FROM usuarios`;
    for (const user of users) {
      await prismaNew.$executeRaw`
        INSERT INTO usuarios (id, nombre, email, password_hash, rol_id, departamento, estado, ultimo_acceso, refresh_token, created_at, updated_at)
        VALUES (${user.id}::uuid, ${user.nombre}, ${user.email}, ${user.password_hash}, ${user.rol_id}, ${user.departamento}, ${user.estado}::\"EstadoUsuario\", ${user.ultimo_acceso}, ${user.refresh_token}, ${user.created_at}, ${user.updated_at})
      `;
    }
    console.log(`✅ ${users.length} usuarios migrados\n`);

    // 4. Migrar Proyectos
    console.log('🏭 Migrando Proyectos...');
    const projects = await prismaOld.$queryRaw`SELECT * FROM proyectos`;
    for (const project of projects) {
      // El schema nuevo requiere campo 'cuenta' que no existe en la DB antigua
      const cuenta = `SGMI-2025-${String(Math.random()).substring(2, 8)}`;
      await prismaNew.$executeRaw`
        INSERT INTO proyectos (id, nombre, cuenta, descripcion, estado, created_at, updated_at)
        VALUES (${project.id}, ${project.nombre}, ${cuenta}, ${project.descripcion}, ${project.estado}, ${project.created_at}, ${project.updated_at})
      `;
    }
    console.log(`✅ ${projects.length} proyectos migrados\n`);

    // 5. Migrar Inventario (solo campos que existen en ambas DBs)
    console.log('📦 Migrando Items de Inventario...');
    const inventory = await prismaOld.$queryRaw`SELECT * FROM inventario`;
    for (const item of inventory) {
      // Solo migrar campos que existen en la nueva DB
      await prismaNew.$executeRaw`
        INSERT INTO inventario (id, codigo, nombre, categoria, unidad_medida, cantidad_actual, cantidad_minima, precio_unitario, ubicacion_almacen, proveedor, estado, created_at, updated_at)
        VALUES (${item.id}, ${item.codigo}, ${item.nombre}, ${item.categoria}, ${item.unidad_medida}::\"UnidadMedida\", ${item.cantidad_actual}, ${item.cantidad_minima}, ${item.precio_unitario}, ${item.ubicacion_almacen}, ${item.proveedor}, ${item.estado}::\"EstadoItem\", ${item.created_at}, ${item.updated_at})
      `;
    }
    console.log(`✅ ${inventory.length} items de inventario migrados\n`);

    // 6. Migrar Órdenes de Trabajo
    console.log('📝 Migrando Órdenes de Trabajo...');
    const orders = await prismaOld.$queryRaw`SELECT * FROM ordenes_trabajo`;
    for (const order of orders) {
      await prismaNew.$executeRaw`
        INSERT INTO ordenes_trabajo (id, numero_orden, proyecto_id, tipo_mantenimiento, prioridad, titulo, descripcion, equipo_maquina, ubicacion, tecnico_asignado_id, supervisor_id, estado, fecha_programada, fecha_inicio, fecha_finalizacion, tiempo_estimado, tiempo_real, notas_tecnico, observaciones, created_at, updated_at)
        VALUES (${order.id}, ${order.numero_orden}, ${order.proyecto_id}, ${order.tipo_mantenimiento}::\"TipoMantenimiento\", ${order.prioridad}::\"PrioridadOrden\", ${order.titulo}, ${order.descripcion}, ${order.equipo_maquina}, ${order.ubicacion}, ${order.tecnico_asignado_id}::uuid, ${order.supervisor_id}::uuid, ${order.estado}::\"EstadoOrden\", ${order.fecha_programada}, ${order.fecha_inicio}, ${order.fecha_finalizacion}, ${order.tiempo_estimado}, ${order.tiempo_real}, ${order.notas_tecnico}, ${order.observaciones}, ${order.created_at}, ${order.updated_at})
      `;
    }
    console.log(`✅ ${orders.length} órdenes de trabajo migradas\n`);

    console.log('🎉 ¡Migración completada exitosamente!\n');
    
    console.log('📊 Resumen:');
    console.log(`   • ${roles.length} roles`);
    console.log(`   • ${users.length} usuarios`);
    console.log(`   • ${projects.length} proyectos`);
    console.log(`   • ${inventory.length} items de inventario`);
    console.log(`   • ${orders.length} órdenes de trabajo`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await prismaOld.$disconnect();
    await prismaNew.$disconnect();
  }
}

migrateData()
  .then(() => {
    console.log('\n✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
