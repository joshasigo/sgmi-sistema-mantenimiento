// Probar endpoints de órdenes e inventario
const axios = require('axios');

const BASE_URL = 'https://sgmi-backend.onrender.com/api';

async function testEndpoints() {
  try {
    console.log('🔐 Obteniendo token...\n');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@sgmi.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido\n');

    // Test Órdenes
    console.log('📋 Probando Órdenes de Trabajo...');
    try {
      const ordenesRes = await axios.get(`${BASE_URL}/ordenes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Órdenes OK - Total:', ordenesRes.data.ordenes?.length || 0);
      if (ordenesRes.data.ordenes?.length > 0) {
        const orden = ordenesRes.data.ordenes[0];
        console.log('Ejemplo:', {
          id: orden.id,
          equipo: orden.equipo,
          tipo: orden.tipo,
          estado: orden.estado,
          tecnico: orden.tecnicoAsignado?.nombre
        });
      }
    } catch (error) {
      console.log('❌ Error en Órdenes:');
      console.log('Status:', error.response?.status);
      console.log('Mensaje:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('Datos completos:', JSON.stringify(error.response.data, null, 2));
      }
    }

    console.log('\n📦 Probando Inventario...');
    try {
      const inventarioRes = await axios.get(`${BASE_URL}/inventario`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Inventario OK - Total:', inventarioRes.data.items?.length || 0);
      if (inventarioRes.data.items?.length > 0) {
        const item = inventarioRes.data.items[0];
        console.log('Ejemplo:', {
          id: item.id,
          nombre: item.nombre,
          codigo: item.codigo,
          cantidad: item.cantidad
        });
      }
    } catch (error) {
      console.log('❌ Error en Inventario:');
      console.log('Status:', error.response?.status);
      console.log('Mensaje:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.log('Datos completos:', JSON.stringify(error.response.data, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testEndpoints();
