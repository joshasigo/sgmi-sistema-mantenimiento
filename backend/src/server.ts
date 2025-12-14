import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import ordenRoutes from './routes/orden.routes';
import inventarioRoutes from './routes/inventario.routes';
import reportesRoutes from './routes/reportes.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_PROD_URL || 'https://joshasigo.github.io'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== RUTAS ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SGMI Backend API funcionando correctamente',
    timestamp: new Date().toISOString(),
    mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'production'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🏭 SGMI Backend API                                  ║
  ║   Sistema de Gestión de Mantenimiento Industrial      ║
  ║                                                        ║
  ║   🚀 Servidor: http://localhost:${PORT}                   ║
  ║   📊 Health: http://localhost:${PORT}/api/health          ║
  ║   🔧 Modo: ${process.env.NODE_ENV || 'development'}                    ║
  ║   🎭 Demo: ${process.env.DEMO_MODE === 'true' ? 'Activo' : 'Inactivo'}                        ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
