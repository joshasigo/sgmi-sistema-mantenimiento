// Script para probar todos los endpoints del backend en producción
const axios = require('axios');

const BASE_URL = 'https://sgmi-backend.onrender.com/api';
let token = '';

async function testBackend() {
  console.log('🧪 PROBANDO BACKEND EN PRODUCCIÓN');
  console.log('URL:', BASE_URL);
  console.log('='.repeat(60));

  try {
    // 1. Test de Login
    console.log('\n1️⃣ Test de Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@sgmi.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success) {
      token = loginResponse.data.token;
      console.log('✅ Login exitoso');
      console.log('Usuario:', loginResponse.data.user.nombre);
      console.log('Rol:', loginResponse.data.user.rol);
    } else {
      console.log('❌ Login falló');
      return;
    }

    // 2. Test de Dashboard Stats
    console.log('\n2️⃣ Test de Dashboard Stats...');
    try {
      const dashboardResponse = await axios.get(`${BASE_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Dashboard Stats OK');
      console.log('Stats:', JSON.stringify(dashboardResponse.data.stats, null, 2));
    } catch (error) {
      console.log('❌ Dashboard Stats falló:', error.response?.data || error.message);
    }

    // 3. Test de Órdenes de Trabajo
    console.log('\n3️⃣ Test de Órdenes de Trabajo...');
    try {
      const ordenesResponse = await axios.get(`${BASE_URL}/ordenes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Órdenes OK');
      console.log('Total órdenes:', ordenesResponse.data.ordenes?.length || 0);
      if (ordenesResponse.data.ordenes?.length > 0) {
        console.log('Primera orden:', ordenesResponse.data.ordenes[0].id);
      }
    } catch (error) {
      console.log('❌ Órdenes falló:', error.response?.data || error.message);
    }

    // 4. Test de Inventario
    console.log('\n4️⃣ Test de Inventario...');
    try {
      const inventarioResponse = await axios.get(`${BASE_URL}/inventario`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Inventario OK');
      console.log('Total items:', inventarioResponse.data.items?.length || 0);
      if (inventarioResponse.data.items?.length > 0) {
        console.log('Primer item:', inventarioResponse.data.items[0].nombre);
      }
    } catch (error) {
      console.log('❌ Inventario falló:', error.response?.data || error.message);
    }

    // 5. Test de Usuarios
    console.log('\n5️⃣ Test de Usuarios...');
    try {
      const usuariosResponse = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Usuarios OK');
      console.log('Total usuarios:', usuariosResponse.data.users?.length || 0);
    } catch (error) {
      console.log('❌ Usuarios falló:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Pruebas completadas');

  } catch (error) {
    console.error('\n❌ ERROR GENERAL:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testBackend();
