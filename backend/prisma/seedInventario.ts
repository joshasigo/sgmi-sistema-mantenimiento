import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando items de inventario adicionales...');

  const items = [
    {
      nombre: 'Rodamiento SKF 6205',
      codigo: 'ROD-6205',
      categoria: 'Rodamientos',
      cantidad: 25,
      ubicacion: 'Almacén A - Estante 3',
      proveedor: 'SKF Colombia',
      stockMinimo: 10,
    },
    {
      nombre: 'Sello Mecánico 25mm',
      codigo: 'SEL-025',
      categoria: 'Sellos',
      cantidad: 15,
      ubicacion: 'Almacén A - Estante 5',
      proveedor: 'John Crane',
      stockMinimo: 8,
    },
    {
      nombre: 'Aceite Hidráulico ISO 68',
      codigo: 'ACE-H68',
      categoria: 'Lubricantes',
      cantidad: 200,
      ubicacion: 'Bodega Lubricantes',
      proveedor: 'Mobil',
      stockMinimo: 50,
    },
    {
      nombre: 'Filtro de Aire P550588',
      codigo: 'FIL-A588',
      categoria: 'Filtros',
      cantidad: 12,
      ubicacion: 'Almacén B - Estante 2',
      proveedor: 'Donaldson',
      stockMinimo: 5,
    },
    {
      nombre: 'Correa en V B-120',
      codigo: 'COR-B120',
      categoria: 'Transmisión',
      cantidad: 8,
      ubicacion: 'Almacén A - Estante 7',
      proveedor: 'Gates',
      stockMinimo: 4,
    },
    {
      nombre: 'Válvula Solenoide 24V',
      codigo: 'VAL-S24',
      categoria: 'Válvulas',
      cantidad: 6,
      ubicacion: 'Almacén B - Estante 1',
      proveedor: 'ASCO',
      stockMinimo: 3,
    },
    {
      nombre: 'Empaque de Bomba 2"',
      codigo: 'EMP-B02',
      categoria: 'Empaques',
      cantidad: 20,
      ubicacion: 'Almacén A - Estante 4',
      proveedor: 'Garlock',
      stockMinimo: 10,
    },
    {
      nombre: 'Cable Eléctrico 12 AWG',
      codigo: 'CAB-E12',
      categoria: 'Eléctricos',
      cantidad: 150,
      ubicacion: 'Bodega Eléctrica',
      proveedor: 'Procables',
      stockMinimo: 50,
    },
    {
      nombre: 'Grasa Litio EP-2',
      codigo: 'GRA-L02',
      categoria: 'Lubricantes',
      cantidad: 80,
      ubicacion: 'Bodega Lubricantes',
      proveedor: 'Shell',
      stockMinimo: 30,
    },
    {
      nombre: 'Manómetro 0-160 PSI',
      codigo: 'MAN-160',
      categoria: 'Instrumentos',
      cantidad: 10,
      ubicacion: 'Almacén B - Estante 3',
      proveedor: 'Ashcroft',
      stockMinimo: 4,
    },
    {
      nombre: 'Disco de Acoplamiento 150mm',
      codigo: 'DIS-A150',
      categoria: 'Acoples',
      cantidad: 5,
      ubicacion: 'Almacén A - Estante 6',
      proveedor: 'Lovejoy',
      stockMinimo: 2,
    },
    {
      nombre: 'Termopar Tipo K',
      codigo: 'TER-TK',
      categoria: 'Instrumentos',
      cantidad: 8,
      ubicacion: 'Almacén B - Estante 4',
      proveedor: 'Omega',
      stockMinimo: 3,
    },
    {
      nombre: 'Resorte de Válvula 50mm',
      codigo: 'RES-V50',
      categoria: 'Resortes',
      cantidad: 30,
      ubicacion: 'Almacén A - Estante 2',
      proveedor: 'Lee Spring',
      stockMinimo: 15,
    },
    {
      nombre: 'Relay 24VDC 10A',
      codigo: 'REL-2410',
      categoria: 'Eléctricos',
      cantidad: 18,
      ubicacion: 'Bodega Eléctrica',
      proveedor: 'Schneider Electric',
      stockMinimo: 8,
    },
    {
      nombre: 'Manguera Hidráulica 1/2"',
      codigo: 'MAN-H05',
      categoria: 'Mangueras',
      cantidad: 45,
      ubicacion: 'Almacén B - Estante 5',
      proveedor: 'Parker',
      stockMinimo: 20,
    },
  ];

  for (const itemData of items) {
    await prisma.itemInventario.create({
      data: itemData
    });
    console.log(`✅ Item ${itemData.codigo} creado`);
  }

  console.log('✨ Items de inventario creados exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear items:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
