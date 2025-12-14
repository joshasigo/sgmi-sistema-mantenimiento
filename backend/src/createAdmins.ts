import prisma from './config/database.js';
import bcrypt from 'bcryptjs';

async function createAdmins() {
  try {
    console.log('🔐 Creando usuarios administradores...\n');

    // Obtener el rol de Administrador
    const adminRole = await prisma.rol.findFirst({
      where: { nombre: 'Administrador' }
    });

    if (!adminRole) {
      console.error('❌ Error: No se encontró el rol de Administrador');
      return;
    }

    // Usuario 1: David Felipe Trejos Miranda
    const password1 = await bcrypt.hash('Admin2025!', 10);
    const user1 = await prisma.usuario.create({
      data: {
        nombre: 'David Felipe Trejos Miranda',
        email: 'david.trejos@sgmi.com',
        passwordHash: password1,
        rolId: adminRole.id,
        departamento: 'Administración',
        estado: 'ACTIVO'
      }
    });
    console.log('✅ Usuario creado: David Felipe Trejos Miranda');
    console.log(`   📧 Email: ${user1.email}`);
    console.log(`   🔑 Contraseña: Admin2025!`);
    console.log(`   👤 Rol: Administrador\n`);

    // Usuario 2: Josha Stevens Basto Sáenz
    const password2 = await bcrypt.hash('Admin2025!', 10);
    const user2 = await prisma.usuario.create({
      data: {
        nombre: 'Josha Stevens Basto Sáenz',
        email: 'josha.basto@sgmi.com',
        passwordHash: password2,
        rolId: adminRole.id,
        departamento: 'Administración',
        estado: 'ACTIVO'
      }
    });
    console.log('✅ Usuario creado: Josha Stevens Basto Sáenz');
    console.log(`   📧 Email: ${user2.email}`);
    console.log(`   🔑 Contraseña: Admin2025!`);
    console.log(`   👤 Rol: Administrador\n`);

    console.log('🎉 ¡Usuarios administradores creados exitosamente en Neon!');
    console.log('\n📋 Resumen de credenciales:');
    console.log('   1. david.trejos@sgmi.com / Admin2025!');
    console.log('   2. josha.basto@sgmi.com / Admin2025!');

  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('❌ Error: Ya existe un usuario con ese email');
    } else {
      console.error('❌ Error al crear usuarios:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmins();
