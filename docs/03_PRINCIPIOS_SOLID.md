# ⚡ Principios SOLID - SGMI
## Sistema de Gestión de Mantenimiento Industrial

**Proyecto:** SGMI  
**Fecha:** Diciembre 2025

---

## 📋 Tabla de Contenido

1. [S - Single Responsibility Principle](#s---single-responsibility-principle)
2. [O - Open/Closed Principle](#o---openclosed-principle)
3. [L - Liskov Substitution Principle](#l---liskov-substitution-principle)
4. [I - Interface Segregation Principle](#i---interface-segregation-principle)
5. [D - Dependency Inversion Principle](#d---dependency-inversion-principle)

---

## 🔴 S - Single Responsibility Principle
**"Una clase debe tener una, y solo una, razón para cambiar"**

### ❌ Mal Ejemplo (Violación)

```typescript
// ❌ Clase con múltiples responsabilidades
class Usuario {
  nombre: string;
  email: string;
  
  // Responsabilidad 1: Validación
  validarEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
  
  // Responsabilidad 2: Persistencia
  guardarEnBD(): void {
    // Lógica de base de datos
    db.usuarios.insert(this);
  }
  
  // Responsabilidad 3: Notificaciones
  enviarEmailBienvenida(): void {
    // Lógica de envío de emails
    emailService.send(this.email, 'Bienvenido');
  }
}
```

### ✅ Buen Ejemplo (Cumplimiento en SGMI)

```typescript
// ✅ Cada clase tiene UNA responsabilidad

// 1️⃣ RESPONSABILIDAD: Modelo de datos
// backend/src/types/models.ts
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rolId: number;
  departamento?: string;
}

// 2️⃣ RESPONSABILIDAD: Validación
// backend/src/validators/userValidator.ts
export class UserValidator {
  static validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  static validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }
  
  static validateCreateDTO(data: CreateUsuarioDTO): ValidationResult {
    const errors: string[] = [];
    
    if (!data.nombre) errors.push('Nombre es requerido');
    if (!this.validateEmail(data.email)) errors.push('Email inválido');
    if (!this.validatePassword(data.password)) errors.push('Password débil');
    
    return { isValid: errors.length === 0, errors };
  }
}

// 3️⃣ RESPONSABILIDAD: Persistencia
// backend/src/repositories/userRepository.ts
export class UserRepository {
  async findById(id: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { id } });
  }
  
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    return await prisma.usuario.create({ data });
  }
  
  async update(id: string, data: UpdateUsuarioDTO): Promise<Usuario> {
    return await prisma.usuario.update({ where: { id }, data });
  }
}

// 4️⃣ RESPONSABILIDAD: Lógica de negocio
// backend/src/services/userService.ts
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
  
  async createUser(data: CreateUsuarioDTO): Promise<Usuario> {
    // Validar datos
    const validation = UserValidator.validateCreateDTO(data);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    // Guardar usuario
    const usuario = await this.userRepository.create({
      ...data,
      passwordHash
    });
    
    // Enviar email de bienvenida
    await this.emailService.sendWelcome(usuario.email, usuario.nombre);
    
    return usuario;
  }
}

// 5️⃣ RESPONSABILIDAD: Envío de emails
// backend/src/services/emailService.ts
export class EmailService {
  async sendWelcome(email: string, nombre: string): Promise<void> {
    await this.send({
      to: email,
      subject: 'Bienvenido a SGMI',
      template: 'welcome',
      data: { nombre }
    });
  }
  
  private async send(options: EmailOptions): Promise<void> {
    // Lógica de envío con nodemailer
  }
}
```

### Ventajas en SGMI
✅ **Mantenibilidad**: Cambiar validación no afecta persistencia  
✅ **Testabilidad**: Cada clase se testea independientemente  
✅ **Reutilización**: UserValidator se usa en múltiples lugares

---

## 🟢 O - Open/Closed Principle
**"Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación"**

### ❌ Mal Ejemplo (Violación)

```typescript
// ❌ Modificar código existente para agregar nuevos reportes
class ReportGenerator {
  generate(tipo: string, data: any) {
    if (tipo === 'PDF') {
      // Generar PDF
    } else if (tipo === 'Excel') {
      // Generar Excel
    } else if (tipo === 'CSV') {
      // ⚠️ Para agregar CSV, modifico la clase existente
    }
  }
}
```

### ✅ Buen Ejemplo (Cumplimiento en SGMI)

```typescript
// ✅ Extensible sin modificar código existente

// 1️⃣ Interfaz base (cerrada para modificación)
// backend/src/interfaces/IReportGenerator.ts
export interface IReportGenerator {
  generate(data: ReportData): Promise<Buffer | string>;
  getContentType(): string;
}

// 2️⃣ Implementaciones (abiertas para extensión)
// backend/src/services/reports/PDFReportGenerator.ts
export class PDFReportGenerator implements IReportGenerator {
  async generate(data: ReportData): Promise<Buffer> {
    const doc = new PDFDocument();
    // Lógica específica de PDF
    return pdfBuffer;
  }
  
  getContentType(): string {
    return 'application/pdf';
  }
}

// backend/src/services/reports/ExcelReportGenerator.ts
export class ExcelReportGenerator implements IReportGenerator {
  async generate(data: ReportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    // Lógica específica de Excel
    return excelBuffer;
  }
  
  getContentType(): string {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
}

// 3️⃣ NUEVA implementación sin modificar código existente
// backend/src/services/reports/CSVReportGenerator.ts
export class CSVReportGenerator implements IReportGenerator {
  async generate(data: ReportData): Promise<string> {
    return data.rows.map(row => row.join(',')).join('\n');
  }
  
  getContentType(): string {
    return 'text/csv';
  }
}

// 4️⃣ Factory para seleccionar generador
// backend/src/services/reports/ReportFactory.ts
export class ReportFactory {
  private generators: Map<string, IReportGenerator>;
  
  constructor() {
    this.generators = new Map([
      ['pdf', new PDFReportGenerator()],
      ['excel', new ExcelReportGenerator()],
      ['csv', new CSVReportGenerator()], // ✅ Nueva funcionalidad agregada
    ]);
  }
  
  getGenerator(tipo: string): IReportGenerator {
    const generator = this.generators.get(tipo.toLowerCase());
    if (!generator) {
      throw new Error(`Generador de reporte "${tipo}" no soportado`);
    }
    return generator;
  }
}

// 5️⃣ Uso en controlador
export const generateReport = async (req: Request, res: Response) => {
  const { tipo } = req.params;
  const data = await getReportData();
  
  const factory = new ReportFactory();
  const generator = factory.getGenerator(tipo); // ✅ Selección dinámica
  
  const content = await generator.generate(data);
  res.setHeader('Content-Type', generator.getContentType());
  res.send(content);
};
```

### Otro Ejemplo: Middleware Chain

```typescript
// ✅ Agregar nuevos middleware sin modificar existentes

// Middleware base
export type MiddlewareFunction = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => void | Promise<void>;

// Middleware existentes
export const authenticateToken: MiddlewareFunction = (req, res, next) => {
  // Validación JWT
  next();
};

export const requireAdmin: MiddlewareFunction = (req, res, next) => {
  // Verificar rol admin
  next();
};

// ✅ NUEVO middleware agregado sin tocar los anteriores
export const rateLimiter: MiddlewareFunction = (req, res, next) => {
  const ip = req.ip;
  const requestCount = requestCache.get(ip) || 0;
  
  if (requestCount > 100) {
    return res.status(429).json({ message: 'Too many requests' });
  }
  
  requestCache.set(ip, requestCount + 1);
  next();
};

// Uso composable
router.post('/ordenes',
  rateLimiter,           // ✅ Nuevo middleware
  authenticateToken,     // Middleware existente
  requireAdmin,          // Middleware existente
  createOrden
);
```

### Ventajas en SGMI
✅ **Extensibilidad**: Agregar nuevos reportes sin modificar código  
✅ **Estabilidad**: Funcionalidad existente no se rompe  
✅ **Escalabilidad**: Fácil agregar nuevas características

---

## 🔵 L - Liskov Substitution Principle
**"Los objetos de una superclase deben poder ser reemplazados por objetos de sus subclases sin romper la aplicación"**

### ❌ Mal Ejemplo (Violación)

```typescript
// ❌ Subclase cambia comportamiento esperado
class Ave {
  volar(): void {
    console.log('Volando...');
  }
}

class Pinguino extends Ave {
  volar(): void {
    // ❌ Rompe el contrato - los pingüinos no vuelan
    throw new Error('Los pingüinos no pueden volar');
  }
}

function hacerVolar(ave: Ave) {
  ave.volar(); // ☠️ Falla si ave es Pinguino
}
```

### ✅ Buen Ejemplo (Cumplimiento en SGMI)

```typescript
// ✅ Todas las subclases cumplen el contrato

// 1️⃣ Interfaz base
// backend/src/interfaces/IStorage.ts
export interface IStorage {
  save(key: string, data: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

// 2️⃣ Implementación 1: Almacenamiento en Memoria
// backend/src/services/storage/MemoryStorage.ts
export class MemoryStorage implements IStorage {
  private store = new Map<string, any>();
  
  async save(key: string, data: any): Promise<void> {
    this.store.set(key, data);
  }
  
  async get(key: string): Promise<any> {
    return this.store.get(key);
  }
  
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// 3️⃣ Implementación 2: Almacenamiento en Redis
// backend/src/services/storage/RedisStorage.ts
export class RedisStorage implements IStorage {
  constructor(private client: RedisClient) {}
  
  async save(key: string, data: any): Promise<void> {
    await this.client.set(key, JSON.stringify(data));
  }
  
  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

// 4️⃣ Implementación 3: Almacenamiento en Base de Datos
// backend/src/services/storage/DatabaseStorage.ts
export class DatabaseStorage implements IStorage {
  async save(key: string, data: any): Promise<void> {
    await prisma.cache.upsert({
      where: { key },
      update: { value: JSON.stringify(data) },
      create: { key, value: JSON.stringify(data) }
    });
  }
  
  async get(key: string): Promise<any> {
    const record = await prisma.cache.findUnique({ where: { key } });
    return record ? JSON.parse(record.value) : null;
  }
  
  async delete(key: string): Promise<void> {
    await prisma.cache.delete({ where: { key } });
  }
}

// 5️⃣ Uso intercambiable (Liskov cumplido)
// backend/src/services/sessionService.ts
export class SessionService {
  constructor(private storage: IStorage) {} // ✅ Acepta cualquier implementación
  
  async saveSession(userId: string, session: SessionData): Promise<void> {
    await this.storage.save(`session:${userId}`, session);
  }
  
  async getSession(userId: string): Promise<SessionData | null> {
    return await this.storage.get(`session:${userId}`);
  }
}

// ✅ Todas las implementaciones funcionan igual
const sessionWithMemory = new SessionService(new MemoryStorage());
const sessionWithRedis = new SessionService(new RedisStorage(redisClient));
const sessionWithDB = new SessionService(new DatabaseStorage());

// ✅ Comportamiento idéntico, implementación diferente
await sessionWithMemory.saveSession('user123', data);
await sessionWithRedis.saveSession('user123', data);
await sessionWithDB.saveSession('user123', data);
```

### Ejemplo Real en SGMI: Tipos de Órdenes

```typescript
// ✅ Todas las órdenes cumplen el mismo contrato

interface IOrdenTrabajo {
  calcularCosto(): number;
  asignarTecnico(tecnicoId: string): void;
  completar(): void;
}

class OrdenPreventiva implements IOrdenTrabajo {
  calcularCosto(): number {
    return this.costoManoObra + this.costoRepuestos;
  }
  
  asignarTecnico(tecnicoId: string): void {
    this.tecnicoAsignadoId = tecnicoId;
  }
  
  completar(): void {
    this.estado = 'COMPLETADA';
    this.fechaFin = new Date();
  }
}

class OrdenCorrectiva implements IOrdenTrabajo {
  calcularCosto(): number {
    // ✅ Mismo resultado esperado, lógica diferente
    return this.costoManoObra + this.costoRepuestos + this.costoUrgencia;
  }
  
  asignarTecnico(tecnicoId: string): void {
    this.tecnicoAsignadoId = tecnicoId;
  }
  
  completar(): void {
    this.estado = 'COMPLETADA';
    this.fechaFin = new Date();
  }
}

// ✅ Función genérica que funciona con cualquier tipo de orden
function procesarOrden(orden: IOrdenTrabajo) {
  orden.asignarTecnico('tecnico123');
  const costo = orden.calcularCosto();
  console.log(`Costo: $${costo}`);
  orden.completar();
}
```

### Ventajas en SGMI
✅ **Intercambiabilidad**: Cambiar implementación sin romper código  
✅ **Polimorfismo**: Código genérico funciona con subtipos  
✅ **Flexibilidad**: Fácil cambiar entre MemoryStorage, Redis, DB

---

## 🟡 I - Interface Segregation Principle
**"Los clientes no deben ser forzados a depender de interfaces que no usan"**

### ❌ Mal Ejemplo (Violación)

```typescript
// ❌ Interfaz demasiado grande
interface IUsuario {
  // Métodos de autenticación
  login(email: string, password: string): Promise<void>;
  logout(): void;
  
  // Métodos de perfil
  updateProfile(data: any): Promise<void>;
  uploadAvatar(file: File): Promise<void>;
  
  // Métodos de administración
  createUser(data: any): Promise<void>;
  deleteUser(id: string): Promise<void>;
  assignRole(userId: string, roleId: number): Promise<void>;
  
  // Métodos de reportes
  generateReport(tipo: string): Promise<Buffer>;
  exportData(): Promise<void>;
}

// ❌ Un usuario normal no necesita métodos de admin
class UsuarioNormal implements IUsuario {
  // ⚠️ Forzado a implementar métodos que no usa
  createUser() { throw new Error('No autorizado'); }
  deleteUser() { throw new Error('No autorizado'); }
  assignRole() { throw new Error('No autorizado'); }
}
```

### ✅ Buen Ejemplo (Cumplimiento en SGMI)

```typescript
// ✅ Interfaces segregadas por responsabilidad

// 1️⃣ Interfaz para autenticación
// backend/src/interfaces/IAuthenticatable.ts
export interface IAuthenticatable {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<string>;
}

// 2️⃣ Interfaz para gestión de perfil
// backend/src/interfaces/IProfileManageable.ts
export interface IProfileManageable {
  updateProfile(data: UpdateProfileDTO): Promise<Usuario>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

// 3️⃣ Interfaz para administración
// backend/src/interfaces/IAdministrable.ts
export interface IAdministrable {
  createUser(data: CreateUsuarioDTO): Promise<Usuario>;
  deleteUser(id: string): Promise<void>;
  updateUserRole(userId: string, roleId: number): Promise<void>;
  listUsers(filters?: UserFilters): Promise<Usuario[]>;
}

// 4️⃣ Interfaz para reportes
// backend/src/interfaces/IReportable.ts
export interface IReportable {
  generateReport(tipo: string, filters: ReportFilters): Promise<Buffer>;
  exportData(formato: string): Promise<Buffer>;
}

// 5️⃣ Implementaciones específicas

// ✅ Usuario normal solo implementa lo que necesita
class UsuarioService implements IAuthenticatable, IProfileManageable {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Implementación
  }
  
  async logout(): Promise<void> {
    // Implementación
  }
  
  async refreshToken(refreshToken: string): Promise<string> {
    // Implementación
  }
  
  async updateProfile(data: UpdateProfileDTO): Promise<Usuario> {
    // Implementación
  }
  
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Implementación
  }
}

// ✅ Administrador implementa más interfaces
class AdminService implements 
  IAuthenticatable, 
  IProfileManageable, 
  IAdministrable,
  IReportable {
  
  // Métodos de autenticación
  async login(email: string, password: string): Promise<AuthResponse> { }
  async logout(): Promise<void> { }
  async refreshToken(refreshToken: string): Promise<string> { }
  
  // Métodos de perfil
  async updateProfile(data: UpdateProfileDTO): Promise<Usuario> { }
  async changePassword(oldPassword: string, newPassword: string): Promise<void> { }
  
  // Métodos de administración
  async createUser(data: CreateUsuarioDTO): Promise<Usuario> { }
  async deleteUser(id: string): Promise<void> { }
  async updateUserRole(userId: string, roleId: number): Promise<void> { }
  async listUsers(filters?: UserFilters): Promise<Usuario[]> { }
  
  // Métodos de reportes
  async generateReport(tipo: string, filters: ReportFilters): Promise<Buffer> { }
  async exportData(formato: string): Promise<Buffer> { }
}
```

### Ejemplo Real: API Services (Frontend)

```typescript
// ✅ Servicios segregados en SGMI

// 1️⃣ Servicio solo para autenticación
// src/services/authService.ts
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> { }
  async logout(): Promise<void> { }
  async refreshToken(): Promise<string> { }
}

// 2️⃣ Servicio solo para órdenes
// src/services/ordenService.ts
class OrdenService {
  async getOrdenes(filters?: OrdenFilters): Promise<OrdenTrabajo[]> { }
  async createOrden(data: CreateOrdenDTO): Promise<OrdenTrabajo> { }
  async updateOrden(id: string, data: UpdateOrdenDTO): Promise<OrdenTrabajo> { }
}

// 3️⃣ Servicio solo para inventario
// src/services/inventarioService.ts
class InventarioService {
  async getItems(filters?: InventarioFilters): Promise<ItemInventario[]> { }
  async updateStock(id: string, cantidad: number): Promise<ItemInventario> { }
  async getBajoStock(): Promise<ItemInventario[]> { }
}

// 4️⃣ Servicio solo para reportes
// src/services/reporteService.ts
class ReporteService {
  async generatePDF(tipo: string): Promise<Blob> { }
  async generateExcel(tipo: string): Promise<Blob> { }
  async getEstadisticas(): Promise<Estadisticas> { }
}

// ✅ Componentes usan solo lo que necesitan
function OrdenesSection() {
  // ✅ Solo importa OrdenService
  const ordenes = await ordenService.getOrdenes();
}

function ReportesSection() {
  // ✅ Solo importa ReporteService
  const pdf = await reporteService.generatePDF('ordenes');
}
```

### Ventajas en SGMI
✅ **Cohesión**: Interfaces pequeñas y enfocadas  
✅ **Flexibilidad**: Implementar solo lo necesario  
✅ **Mantenibilidad**: Cambios aislados por interfaz

---

## 🟣 D - Dependency Inversion Principle
**"Depender de abstracciones, no de concreciones"**

### ❌ Mal Ejemplo (Violación)

```typescript
// ❌ Dependencia directa de implementación concreta
class UserController {
  private prisma = new PrismaClient(); // ❌ Dependencia concreta
  
  async getUsers() {
    return await this.prisma.usuario.findMany(); // ❌ Acoplado a Prisma
  }
}
```

### ✅ Buen Ejemplo (Cumplimiento en SGMI)

```typescript
// ✅ Depender de abstracciones

// 1️⃣ Abstracción (interfaz)
// backend/src/interfaces/IUserRepository.ts
export interface IUserRepository {
  findAll(filters?: UserFilters): Promise<Usuario[]>;
  findById(id: string): Promise<Usuario | null>;
  create(data: CreateUsuarioDTO): Promise<Usuario>;
  update(id: string, data: UpdateUsuarioDTO): Promise<Usuario>;
  delete(id: string): Promise<void>;
}

// 2️⃣ Implementación concreta con Prisma
// backend/src/repositories/PrismaUserRepository.ts
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findAll(filters?: UserFilters): Promise<Usuario[]> {
    return await this.prisma.usuario.findMany({
      where: this.buildWhereClause(filters),
      include: { rol: true }
    });
  }
  
  async findById(id: string): Promise<Usuario | null> {
    return await this.prisma.usuario.findUnique({ 
      where: { id },
      include: { rol: true }
    });
  }
  
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    return await this.prisma.usuario.create({ 
      data,
      include: { rol: true }
    });
  }
  
  async update(id: string, data: UpdateUsuarioDTO): Promise<Usuario> {
    return await this.prisma.usuario.update({ 
      where: { id }, 
      data,
      include: { rol: true }
    });
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }
}

// 3️⃣ Implementación alternativa (para testing)
// backend/src/repositories/InMemoryUserRepository.ts
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, Usuario> = new Map();
  
  async findAll(filters?: UserFilters): Promise<Usuario[]> {
    return Array.from(this.users.values());
  }
  
  async findById(id: string): Promise<Usuario | null> {
    return this.users.get(id) || null;
  }
  
  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    const usuario = { id: randomUUID(), ...data } as Usuario;
    this.users.set(usuario.id, usuario);
    return usuario;
  }
  
  async update(id: string, data: UpdateUsuarioDTO): Promise<Usuario> {
    const usuario = this.users.get(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    const updated = { ...usuario, ...data };
    this.users.set(id, updated);
    return updated;
  }
  
  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

// 4️⃣ Controlador depende de abstracción
// backend/src/controllers/userController.ts
export class UserController {
  // ✅ Inyección de dependencia - depende de interfaz, no de implementación
  constructor(private userRepository: IUserRepository) {}
  
  async getUsers(req: Request, res: Response): Promise<void> {
    const filters = this.parseFilters(req.query);
    const usuarios = await this.userRepository.findAll(filters);
    res.json({ users: usuarios });
  }
  
  async createUser(req: Request, res: Response): Promise<void> {
    const data: CreateUsuarioDTO = req.body;
    const usuario = await this.userRepository.create(data);
    res.status(201).json({ user: usuario });
  }
}

// 5️⃣ Configuración con Dependency Injection
// backend/src/config/container.ts
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  
  static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer();
    }
    return this.instance;
  }
  
  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }
  
  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not registered`);
    }
    return factory();
  }
}

// 6️⃣ Registro de servicios
// backend/src/config/services.ts
const container = DIContainer.getInstance();

// Producción: usa Prisma
container.register('userRepository', () => 
  new PrismaUserRepository(prisma)
);

// Testing: usa InMemory
if (process.env.NODE_ENV === 'test') {
  container.register('userRepository', () => 
    new InMemoryUserRepository()
  );
}

container.register('userController', () => 
  new UserController(
    container.resolve('userRepository')
  )
);

// 7️⃣ Uso en rutas
const userController = container.resolve<UserController>('userController');
router.get('/users', userController.getUsers.bind(userController));
```

### Ejemplo Frontend: Service Abstractions

```typescript
// ✅ Frontend también usa Dependency Inversion

// 1️⃣ Abstracción
// src/interfaces/IHttpClient.ts
export interface IHttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

// 2️⃣ Implementación con Axios
// src/services/http/AxiosHttpClient.ts
export class AxiosHttpClient implements IHttpClient {
  constructor(private axiosInstance: AxiosInstance) {}
  
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }
  
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
  
  // ... put, delete
}

// 3️⃣ Implementación mock para testing
// src/services/http/MockHttpClient.ts
export class MockHttpClient implements IHttpClient {
  private responses: Map<string, any> = new Map();
  
  mockResponse(url: string, data: any): void {
    this.responses.set(url, data);
  }
  
  async get<T>(url: string): Promise<T> {
    return this.responses.get(url) as T;
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    return { success: true, data } as T;
  }
}

// 4️⃣ Servicio depende de abstracción
// src/services/ordenService.ts
export class OrdenService {
  constructor(private httpClient: IHttpClient) {}
  
  async getOrdenes(filters?: OrdenFilters): Promise<OrdenTrabajo[]> {
    return await this.httpClient.get<OrdenTrabajo[]>('/ordenes', { 
      params: filters 
    });
  }
}

// 5️⃣ Configuración
// src/config/services.ts
const httpClient = new AxiosHttpClient(axiosInstance);
export const ordenService = new OrdenService(httpClient);

// Testing
const mockClient = new MockHttpClient();
mockClient.mockResponse('/ordenes', [{ id: '1', equipo: 'Test' }]);
export const ordenServiceMock = new OrdenService(mockClient);
```

### Ventajas en SGMI
✅ **Testabilidad**: Fácil usar mocks en tests  
✅ **Flexibilidad**: Cambiar implementación sin tocar código  
✅ **Desacoplamiento**: Módulos independientes  
✅ **Mantenibilidad**: Cambios aislados

---

## 📊 Resumen SOLID en SGMI

| Principio | Implementación en SGMI | Beneficio |
|-----------|------------------------|-----------|
| **S** | Repositorios, Servicios, Controladores separados | Código modular |
| **O** | Interfaces para reportes, middleware extensible | Agregar features sin modificar |
| **L** | IStorage con múltiples implementaciones | Intercambiabilidad |
| **I** | Interfaces segregadas (Auth, Profile, Admin) | Interfaces pequeñas |
| **D** | Inyección de dependencias, abstracciones | Fácil testing, desacoplamiento |

---

## 🎯 Beneficios Generales

1. **Código Mantenible**: Fácil entender y modificar
2. **Testeable**: Mocks e inyección de dependencias
3. **Escalable**: Agregar funcionalidad sin romper existente
4. **Flexible**: Cambiar implementaciones fácilmente
5. **Robusto**: Menos bugs, más estable

---

**Documento elaborado por:** Equipo de Desarrollo SGMI  
**Última actualización:** Diciembre 2025
