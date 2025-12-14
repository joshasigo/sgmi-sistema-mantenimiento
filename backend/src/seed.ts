import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ==================== CREAR ROLES ====================
  console.log('📝 Creando roles...');
  
  const roles = await Promise.all([
    prisma.rol.upsert({
      where: { nombre: 'Administrador' },
      update: {},
      create: {
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema',
        permisos: {
          ordenes: { crear: true, editar: true, eliminar: true, ver: true },
          usuarios: { crear: true, editar: true, eliminar: true, ver: true },
          inventario: { crear: true, editar: true, ver: true },
          reportes: { generar: true, exportar: true }
        }
      }
    }),
    prisma.rol.upsert({
      where: { nombre: 'Supervisor' },
      update: {},
      create: {
        nombre: 'Supervisor',
        descripcion: 'Supervisor de mantenimiento',
        permisos: {
          ordenes: { crear: true, editar: true, eliminar: true, ver: true },
          usuarios: { crear: false, editar: false, eliminar: false, ver: true },
          inventario: { crear: true, editar: true, ver: true },
          reportes: { generar: true, exportar: true }
        }
      }
    }),
    prisma.rol.upsert({
      where: { nombre: 'Técnico' },
      update: {},
      create: {
        nombre: 'Técnico',
        descripcion: 'Técnico de mantenimiento',
        permisos: {
          ordenes: { crear: true, editar: true, eliminar: false, ver: true },
          usuarios: { crear: false, editar: false, eliminar: false, ver: false },
          inventario: { crear: false, editar: false, ver: true },
          reportes: { generar: true, exportar: false }
        }
      }
    }),
    prisma.rol.upsert({
      where: { nombre: 'Visualizador' },
      update: {},
      create: {
        nombre: 'Visualizador',
        descripcion: 'Solo lectura',
        permisos: {
          ordenes: { crear: false, editar: false, eliminar: false, ver: true },
          usuarios: { crear: false, editar: false, eliminar: false, ver: false },
          inventario: { crear: false, editar: false, ver: true },
          reportes: { generar: true, exportar: false }
        }
      }
    })
  ]);

  console.log(`✅ ${roles.length} roles creados\n`);

  // ==================== CREAR USUARIOS ====================
  console.log('👥 Creando usuarios de prueba...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const usuarios = await Promise.all([
    prisma.usuario.upsert({
      where: { email: 'admin@sgmi.com' },
      update: {},
      create: {
        nombre: 'Carlos Mendoza',
        email: 'admin@sgmi.com',
        passwordHash,
        rolId: 1, // Administrador
        departamento: 'Administración',
        estado: 'ACTIVO'
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'supervisor@sgmi.com' },
      update: {},
      create: {
        nombre: 'Ana Martínez',
        email: 'supervisor@sgmi.com',
        passwordHash,
        rolId: 2, // Supervisor
        departamento: 'Mantenimiento',
        estado: 'ACTIVO'
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'tecnico@sgmi.com' },
      update: {},
      create: {
        nombre: 'Juan Pérez',
        email: 'tecnico@sgmi.com',
        passwordHash,
        rolId: 3, // Técnico
        departamento: 'Mantenimiento',
        estado: 'ACTIVO'
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'maria.garcia@sgmi.com' },
      update: {},
      create: {
        nombre: 'María García',
        email: 'maria.garcia@sgmi.com',
        passwordHash,
        rolId: 3, // Técnico
        departamento: 'Producción',
        estado: 'ACTIVO'
      }
    })
  ]);

  console.log(`✅ ${usuarios.length} usuarios creados\n`);

  // ==================== CREAR PROYECTOS ====================
  console.log('🏭 Creando proyectos...');

  const proyectos = await Promise.all([
    prisma.proyecto.upsert({
      where: { id: 'PROJ-001' },
      update: {},
      create: {
        id: 'PROJ-001',
        nombre: 'Industrias ACME S.A.',
        cuenta: 'SGMI-2025-001',
        descripcion: 'Planta de manufactura principal',
        estado: true
      }
    }),
    prisma.proyecto.upsert({
      where: { id: 'PROJ-002' },
      update: {},
      create: {
        id: 'PROJ-002',
        nombre: 'Manufactura XYZ Ltda.',
        cuenta: 'SGMI-2025-002',
        descripcion: 'Planta de procesamiento',
        estado: true
      }
    })
  ]);

  console.log(`✅ ${proyectos.length} proyectos creados\n`);

  // ==================== CREAR INVENTARIO ====================
  console.log('📦 Creando items de inventario...');

  const inventario = await Promise.all([
    prisma.itemInventario.create({
      data: {
        nombre: 'Rodamiento SKF 6205',
        codigo: 'ROD-SKF-6205',
        categoria: 'Rodamientos',
        cantidad: 15,
        ubicacion: 'Almacén A - Estante 3',
        proveedor: 'SKF Industrial',
        stockMinimo: 5
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Filtro de Aceite',
        codigo: 'FIL-ACE-001',
        categoria: 'Filtros',
        cantidad: 30,
        ubicacion: 'Almacén B - Estante 1',
        proveedor: 'Filtros XYZ',
        stockMinimo: 10
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Correa en V',
        codigo: 'COR-V-8X1200',
        categoria: 'Correas',
        cantidad: 8,
        ubicacion: 'Almacén A - Estante 5',
        proveedor: 'Transmisiones ABC',
        stockMinimo: 3
      }
    })
  ]);

  console.log(`✅ ${inventario.length} items de inventario creados\n`);

  console.log('🎉 Seed completado exitosamente!\n');
  console.log('📋 Usuarios de prueba creados:');
  console.log('   • admin@sgmi.com / password123 (Administrador)');
  console.log('   • supervisor@sgmi.com / password123 (Supervisor)');
  console.log('   • tecnico@sgmi.com / password123 (Técnico)');
  console.log('   • maria.garcia@sgmi.com / password123 (Técnico)\n');
}

seed()
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
