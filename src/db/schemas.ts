import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  bigint,
  smallint,
  decimal,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  tenant_id: integer("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  last_name: text("last_name").notNull(),
  dni: integer("dni").notNull(),
  role_type: text("role_type").default("empleado"),
  is_active: boolean("is_active").default(true),
  last_login: timestamp("last_login"),
  role: text("role").default("user"),
  lang: text("lang").default("es"),
});

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const tenants = pgTable('tenants', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domainName: text('domain_name'),
  status: text('status').default('activo'),
  plan: text('plan').default('basico'),
  maxProducts: smallint('max_products').default(10000),
  maxUsers: smallint('max_users').default(50),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const tenantSettings = pgTable('tenant_settings', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  currency: text('currency').default('ars'),
  timezone: text('timezone').default('america/argentina/buenos_aires'),
  dateFormat: text('date_format').default('dd/mm/yyyy'),
  lowStockThreshold: smallint('low_stock_threshold').default(10),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const categories = pgTable('categories', {
  id: bigint('id', { mode: 'number' }),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  parentId: bigint('parent_id', { mode: 'number' }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const suppliers = pgTable('suppliers', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  name: text('name').notNull(),
  contactName: text('contact_name'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  taxId: text('tax_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const products = pgTable('products', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  sku: text('sku').notNull(),
  barcode: text('barcode'),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: bigint('category_id', { mode: 'number' }),
  supplierId: bigint('supplier_id', { mode: 'number' }),
  costPrice: decimal('cost_price', { precision: 12, scale: 4 }).default("0"),
  salePrice: decimal('sale_price', { precision: 12, scale: 4 }).notNull(),
  unitOfMeasure: text('unit_of_measure').default('unidad'),
  weight: decimal('weight', { precision: 10, scale: 3 }),
  isPerishable: boolean('is_perishable').default(false),
  expirationDays: integer('expiration_days'),
  minStock: smallint('min_stock').default(0),
  maxStock: smallint('max_stock'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const inventory = pgTable('inventory', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 4 }).default("0"),
  reservedQuantity: decimal('reserved_quantity', { precision: 12, scale: 4 }).default("0"),
  lastUpdated: timestamp('last_updated').defaultNow()
});

export const customers = pgTable('customers', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  code: text('code'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  customerType: text('customer_type').default('minorista'),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }).default("0"),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sales = pgTable('sales', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  saleNumber: text('sale_number').notNull(),
  customerId: bigint('customer_id', { mode: 'number' }),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  saleDate: timestamp('sale_date').notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default("0"),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull().default("0"),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default("0"),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default("0"),
  paymentMethod: text('payment_method').default('efectivo'),
  status: text('status').default('completado'),
  notes: text('notes'),
  cashRegister: smallint('cash_register').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow()
});

// sale_items table
export const saleItems = pgTable('sale_items', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  saleId: bigint('sale_id', { mode: 'number' }).notNull(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 4 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 4 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default("0"),
  lineTotal: decimal('line_total', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const inventoryMovements = pgTable('inventory_movements', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  movementType: text('movement_type').notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 4 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 12, scale: 4 }),
  referenceId: bigint('reference_id', { mode: 'number' }),
  referenceType: text('reference_type'),
  notes: text('notes'),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  movementDate: timestamp('movement_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
});

export const purchases = pgTable('purchases', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  purchaseNumber: text('purchase_number').notNull(),
  supplierId: bigint('supplier_id', { mode: 'number' }),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  purchaseDate: timestamp('purchase_date'),
  expectedDeliveryDate: date('expected_delivery_date'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default("0"),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull().default("0"),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default("0"),
  status: text('status').default('pendiente'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
});

export const purchaseItems = pgTable('purchase_items', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  tenantId: bigint('tenant_id', { mode: 'number' }).notNull(),
  purchaseId: bigint('purchase_id', { mode: 'number' }).notNull(),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  quantityOrdered: decimal('quantity_ordered', { precision: 12, scale: 4 }).notNull(),
  quantityReceived: decimal('quantity_received', { precision: 12, scale: 4 }).default("0"),
  unitCost: decimal('unit_cost', { precision: 12, scale: 4 }).notNull(),
  lineTotal: decimal('line_total', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
