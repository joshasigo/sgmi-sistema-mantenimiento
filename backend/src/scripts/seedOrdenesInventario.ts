import prisma from '../config/database';

async function seedOrdenesInventario() {
  console.log('🌱 Creando órdenes de trabajo e inventario...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.itemInventario.deleteMany({});
  await prisma.ordenTrabajo.deleteMany({});
  console.log('✅ Datos limpiados');

  // Obtener usuarios para asignar órdenes
  const usuarios = await prisma.usuario.findMany({
    include: { rol: true }
  });

  const tecnicos = usuarios.filter(u => u.rol.nombre === 'Técnico');
  const admin = usuarios.find(u => u.rol.nombre === 'Administrador');

  if (!admin) {
    console.error('❌ No se encontró un administrador');
    return;
  }

  // Crear órdenes de trabajo
  const ordenes = await Promise.all([
    prisma.ordenTrabajo.create({
      data: {
        id: 'OT-001',
        equipo: 'Compresor Principal A1',
        tipo: 'PREVENTIVO',
        prioridad: 'ALTA',
        estado: 'EN_PROGRESO',
        descripcion: 'Mantenimiento preventivo trimestral del compresor principal',
        tecnicoAsignadoId: tecnicos[0]?.id,
        progreso: 45,
        fechaInicio: new Date('2025-12-10'),
        creadoPorId: admin.id
      }
    }),
    prisma.ordenTrabajo.create({
      data: {
        id: 'OT-002',
        equipo: 'Bomba Hidráulica B2',
        tipo: 'CORRECTIVO',
        prioridad: 'CRITICA',
        estado: 'PENDIENTE',
        descripcion: 'Fuga detectada en el sello mecánico, requiere reemplazo urgente',
        tecnicoAsignadoId: tecnicos[1]?.id,
        progreso: 0,
        creadoPorId: admin.id
      }
    }),
    prisma.ordenTrabajo.create({
      data: {
        id: 'OT-003',
        equipo: 'Motor Eléctrico C3',
        tipo: 'PREDICTIVO',
        prioridad: 'MEDIA',
        estado: 'COMPLETADA',
        descripcion: 'Análisis de vibraciones y temperatura del motor',
        tecnicoAsignadoId: tecnicos[2]?.id,
        progreso: 100,
        fechaInicio: new Date('2025-12-05'),
        fechaFin: new Date('2025-12-08'),
        creadoPorId: admin.id
      }
    }),
    prisma.ordenTrabajo.create({
      data: {
        id: 'OT-004',
        equipo: 'Sistema HVAC Zona Norte',
        tipo: 'PREVENTIVO',
        prioridad: 'BAJA',
        estado: 'PENDIENTE',
        descripcion: 'Limpieza de filtros y revisión de ductos',
        progreso: 0,
        creadoPorId: admin.id
      }
    }),
    prisma.ordenTrabajo.create({
      data: {
        id: 'OT-005',
        equipo: 'Transformador Principal T1',
        tipo: 'CORRECTIVO',
        prioridad: 'ALTA',
        estado: 'EN_PROGRESO',
        descripcion: 'Sobrecalentamiento detectado, revisión de conexiones',
        tecnicoAsignadoId: tecnicos[3]?.id,
        progreso: 65,
        fechaInicio: new Date('2025-12-12'),
        creadoPorId: admin.id
      }
    })
  ]);

  console.log(`✅ ${ordenes.length} órdenes de trabajo creadas`);

  // Crear items de inventario
  const inventario = await Promise.all([
    prisma.itemInventario.create({
      data: {
        nombre: 'Rodamiento SKF 6205',
        codigo: 'ROD-SKF-6205',
        categoria: 'Rodamientos',
        cantidad: 45,
        ubicacion: 'Estante A-12',
        proveedor: 'SKF Colombia',
        stockMinimo: 10
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Sello Mecánico 35mm',
        codigo: 'SEL-MEC-35',
        categoria: 'Sellos',
        cantidad: 8,
        ubicacion: 'Estante B-05',
        proveedor: 'John Crane',
        stockMinimo: 5
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Filtro de Aire HEPA H13',
        codigo: 'FIL-HEPA-H13',
        categoria: 'Filtros',
        cantidad: 25,
        ubicacion: 'Bodega Principal',
        proveedor: 'Camfil',
        stockMinimo: 8
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Aceite Hidráulico ISO 68',
        codigo: 'ACE-HID-68',
        categoria: 'Lubricantes',
        cantidad: 120,
        ubicacion: 'Cuarto de Lubricantes',
        proveedor: 'Mobil',
        stockMinimo: 30
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Correa en V A-50',
        codigo: 'COR-V-A50',
        categoria: 'Correas',
        cantidad: 3,
        ubicacion: 'Estante C-18',
        proveedor: 'Gates',
        stockMinimo: 5
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Sensor de Temperatura PT100',
        codigo: 'SEN-TEMP-PT100',
        categoria: 'Sensores',
        cantidad: 12,
        ubicacion: 'Estante D-22',
        proveedor: 'Omega Engineering',
        stockMinimo: 4
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Fusible 32A Tipo NH',
        codigo: 'FUS-NH-32A',
        categoria: 'Eléctricos',
        cantidad: 35,
        ubicacion: 'Panel Eléctrico',
        proveedor: 'Schneider Electric',
        stockMinimo: 10
      }
    }),
    prisma.itemInventario.create({
      data: {
        nombre: 'Válvula Solenoide 1/2"',
        codigo: 'VAL-SOL-12',
        categoria: 'Válvulas',
        cantidad: 7,
        ubicacion: 'Estante E-30',
        proveedor: 'Parker',
        stockMinimo: 3
      }
    })
  ]);

  console.log(`✅ ${inventario.length} items de inventario creados`);
  console.log('✨ Datos de prueba creados exitosamente!');
}

seedOrdenesInventario()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
