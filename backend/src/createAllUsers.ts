import prisma from './config/database.js';
import bcrypt from 'bcryptjs';

async function createAllUsers() {
  try {
    console.log('👥 Creando usuarios para todos los roles...\n');

    // Obtener todos los roles
    const roles = await prisma.rol.findMany();
    const adminRole = roles.find(r => r.nombre === 'Administrador');
    const supervisorRole = roles.find(r => r.nombre === 'Supervisor');
    const tecnicoRole = roles.find(r => r.nombre === 'Técnico');
    const visualizadorRole = roles.find(r => r.nombre === 'Visualizador');

    if (!adminRole || !supervisorRole || !tecnicoRole || !visualizadorRole) {
      console.error('❌ Error: No se encontraron todos los roles necesarios');
      return;
    }

    const passwordHash = await bcrypt.hash('Admin2025!', 10);

    // Verificar si ya existen usuarios
    const existingUsers = await prisma.usuario.findMany({
      select: { email: true }
    });
    const existingEmails = new Set(existingUsers.map(u => u.email));

    const usuarios = [
      // ADMINISTRADORES
      {
        nombre: 'David Felipe Trejos Miranda',
        email: 'david.trejos@sgmi.com',
        rolId: adminRole.id,
        departamento: 'Administración'
      },
      {
        nombre: 'Josha Stevens Basto Sáenz',
        email: 'josha.basto@sgmi.com',
        rolId: adminRole.id,
        departamento: 'Administración'
      },
      {
        nombre: 'María García López',
        email: 'maria.garcia@sgmi.com',
        rolId: adminRole.id,
        departamento: 'Administración'
      },
      // SUPERVISORES
      {
        nombre: 'Carlos Mendoza Ramírez',
        email: 'carlos.mendoza@sgmi.com',
        rolId: supervisorRole.id,
        departamento: 'Mantenimiento'
      },
      {
        nombre: 'Ana Patricia Ruiz Santos',
        email: 'ana.ruiz@sgmi.com',
        rolId: supervisorRole.id,
        departamento: 'Operaciones'
      },
      {
        nombre: 'Roberto Silva Contreras',
        email: 'roberto.silva@sgmi.com',
        rolId: supervisorRole.id,
        departamento: 'Producción'
      },
      // TÉCNICOS
      {
        nombre: 'Juan Carlos López Torres',
        email: 'juan.lopez@sgmi.com',
        rolId: tecnicoRole.id,
        departamento: 'Mantenimiento Mecánico'
      },
      {
        nombre: 'Pedro Martínez Gómez',
        email: 'pedro.martinez@sgmi.com',
        rolId: tecnicoRole.id,
        departamento: 'Mantenimiento Eléctrico'
      },
      {
        nombre: 'Luis Fernando Hernández',
        email: 'luis.hernandez@sgmi.com',
        rolId: tecnicoRole.id,
        departamento: 'Mantenimiento Preventivo'
      },
      {
        nombre: 'Diego Alejandro Castro',
        email: 'diego.castro@sgmi.com',
        rolId: tecnicoRole.id,
        departamento: 'Mantenimiento Predictivo'
      },
      {
        nombre: 'Jorge Alberto Morales',
        email: 'jorge.morales@sgmi.com',
        rolId: tecnicoRole.id,
        departamento: 'Instrumentación'
      },
      // VISUALIZADORES
      {
        nombre: 'Sandra Milena Pérez',
        email: 'sandra.perez@sgmi.com',
        rolId: visualizadorRole.id,
        departamento: 'Auditoría'
      },
      {
        nombre: 'Carolina Vargas Díaz',
        email: 'carolina.vargas@sgmi.com',
        rolId: visualizadorRole.id,
        departamento: 'Calidad'
      },
      {
        nombre: 'Andrés Felipe Rojas',
        email: 'andres.rojas@sgmi.com',
        rolId: visualizadorRole.id,
        departamento: 'Seguridad Industrial'
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const userData of usuarios) {
      if (existingEmails.has(userData.email)) {
        console.log(`⏭️  Usuario ya existe: ${userData.email}`);
        skipped++;
        continue;
      }

      const user = await prisma.usuario.create({
        data: {
          ...userData,
          passwordHash,
          estado: 'ACTIVO'
        },
        include: {
          rol: true
        }
      });

      console.log(`✅ ${user.rol.nombre}: ${user.nombre}`);
      console.log(`   📧 ${user.email}`);
      console.log(`   🏢 ${user.departamento}\n`);
      created++;
    }

    console.log('\n🎉 Proceso completado!');
    console.log(`   ✅ Creados: ${created} usuarios`);
    console.log(`   ⏭️  Omitidos: ${skipped} usuarios (ya existían)`);
    console.log('\n📋 Contraseña para todos los usuarios: Admin2025!');
    console.log('\n👥 Resumen por rol:');
    console.log(`   🔴 Administradores: 3 usuarios`);
    console.log(`   🟠 Supervisores: 3 usuarios`);
    console.log(`   🟢 Técnicos: 5 usuarios`);
    console.log(`   🔵 Visualizadores: 3 usuarios`);
    console.log(`   📊 Total: 14 usuarios\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAllUsers();
