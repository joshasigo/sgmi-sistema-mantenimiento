import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando órdenes de trabajo adicionales...');

  // Buscar usuarios para asignar
  const usuarios = await prisma.usuario.findMany({
    where: {
      rol: {
        nombre: {
          in: ['Técnico', 'Supervisor']
        }
      }
    }
  });

  const adminUser = await prisma.usuario.findFirst({
    where: {
      rol: { nombre: 'Administrador' }
    }
  });

  if (!adminUser || usuarios.length === 0) {
    console.error('No hay usuarios disponibles. Ejecuta el seed principal primero.');
    return;
  }

  // Generar fechas variadas
  const hoy = new Date();
  const fechas = [
    new Date(2024, 11, 1), // Dic 1, 2024
    new Date(2024, 11, 5),
    new Date(2024, 11, 10),
    new Date(2024, 11, 15),
    new Date(2024, 11, 20),
    new Date(2024, 11, 25),
    new Date(2024, 11, 28),
    new Date(2025, 0, 5), // Ene 5, 2025
    new Date(2025, 0, 10),
    new Date(2025, 0, 15),
  ];

  const ordenes = [
    {
      id: 'OT-016',
      equipo: 'Bomba Centrífuga B-15',
      tipo: 'PREVENTIVO',
      prioridad: 'MEDIA',
      estado: 'COMPLETADA',
      descripcion: 'Inspección mensual de rodamientos y sellos mecánicos. Verificar vibración y temperatura de operación.',
      progreso: 100,
      fechaInicio: fechas[0],
      fechaFin: fechas[1],
    },
    {
      id: 'OT-017',
      equipo: 'Transportador de Banda TB-08',
      tipo: 'CORRECTIVO',
      prioridad: 'ALTA',
      estado: 'EN_PROGRESO',
      descripcion: 'Reemplazo de banda transportadora dañada en sector norte. Ajuste de tensión y alineación de rodillos.',
      progreso: 65,
      fechaInicio: fechas[2],
      fechaFin: null,
    },
    {
      id: 'OT-018',
      equipo: 'Válvula de Control VC-22',
      tipo: 'PREVENTIVO',
      prioridad: 'BAJA',
      estado: 'PENDIENTE',
      descripcion: 'Calibración de válvula de control. Verificar actuador neumático y posicionador.',
      progreso: 0,
      fechaInicio: fechas[7],
      fechaFin: null,
    },
    {
      id: 'OT-019',
      equipo: 'Motor Eléctrico ME-45',
      tipo: 'PREDICTIVO',
      prioridad: 'MEDIA',
      estado: 'EN_PROGRESO',
      descripcion: 'Análisis termográfico y medición de corrientes. Inspección de aislamiento eléctrico del bobinado.',
      progreso: 40,
      fechaInicio: fechas[3],
      fechaFin: null,
    },
    {
      id: 'OT-020',
      equipo: 'Sistema HVAC Zona A',
      tipo: 'CORRECTIVO',
      prioridad: 'CRITICA',
      estado: 'EN_PROGRESO',
      descripcion: 'Falla en compresor de aire acondicionado. Reemplazo de compresor y recarga de refrigerante.',
      progreso: 80,
      fechaInicio: fechas[4],
      fechaFin: null,
    },
    {
      id: 'OT-021',
      equipo: 'Tanque de Almacenamiento TK-12',
      tipo: 'PREVENTIVO',
      prioridad: 'ALTA',
      estado: 'PENDIENTE',
      descripcion: 'Inspección interna de tanque. Evaluación de corrosión y limpieza de sedimentos.',
      progreso: 0,
      fechaInicio: fechas[8],
      fechaFin: null,
    },
    {
      id: 'OT-022',
      equipo: 'Elevador Montacargas EC-03',
      tipo: 'PREVENTIVO',
      prioridad: 'ALTA',
      estado: 'COMPLETADA',
      descripcion: 'Inspección mensual de cables, poleas y sistemas de seguridad. Lubricación de guías.',
      progreso: 100,
      fechaInicio: fechas[5],
      fechaFin: fechas[6],
    },
    {
      id: 'OT-023',
      equipo: 'Caldera Industrial CI-01',
      tipo: 'PREVENTIVO',
      prioridad: 'CRITICA',
      estado: 'EN_PROGRESO',
      descripcion: 'Mantenimiento anual de caldera. Limpieza de tubos, inspección de válvulas de seguridad y análisis de agua.',
      progreso: 55,
      fechaInicio: fechas[1],
      fechaFin: null,
    },
    {
      id: 'OT-024',
      equipo: 'Reductor de Velocidad RV-18',
      tipo: 'CORRECTIVO',
      prioridad: 'MEDIA',
      estado: 'PENDIENTE',
      descripcion: 'Cambio de aceite y reemplazo de sellos. Verificar desgaste de engranajes.',
      progreso: 0,
      fechaInicio: fechas[9],
      fechaFin: null,
    },
    {
      id: 'OT-025',
      equipo: 'Panel Eléctrico PE-07',
      tipo: 'PREDICTIVO',
      prioridad: 'ALTA',
      estado: 'EN_PROGRESO',
      descripcion: 'Inspección termográfica de conexiones eléctricas. Medición de aislamientos y prueba de breakers.',
      progreso: 30,
      fechaInicio: fechas[2],
      fechaFin: null,
    },
  ];

  for (const ordenData of ordenes) {
    // Asignar técnico aleatorio
    const tecnicoAsignado = usuarios[Math.floor(Math.random() * usuarios.length)];
    
    await prisma.ordenTrabajo.create({
      data: {
        ...ordenData,
        tecnicoAsignadoId: tecnicoAsignado.id,
        creadoPorId: adminUser.id,
      }
    });
    console.log(`✅ Orden ${ordenData.id} creada`);
  }

  console.log('✨ Órdenes de trabajo creadas exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear órdenes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
