-- ==========================================================
-- 1. USUARIOS (CLIENTE Y EXPERTO)
-- ========================== ================================

INSERT INTO "User" (id, name, email, password, role, "createdAt")
VALUES 
('u-client-001', 'Carlos Cliente', 'carlos@ejemplo.com', 'pass_hash_1', 'CLIENT', NOW()),
('u-expert-999', 'Ana Expert', 'ana.tech@ejemplo.com', 'pass_hash_2', 'EXPERT', NOW());

-- ==========================================================
-- 2. SERVICIOS (AMBOS DEL MISMO EXPERTO)
-- ==========================================================

-- Servicio A: Auditoría
INSERT INTO "Service" (id, title, description, price, mode, "interactionType", "expertId", "createdAt")
VALUES (
    'srv-auditoria', 
    'Auditoría de Seguridad Web', 
    'Análisis de vulnerabilidades y reporte técnico.', 
    150.00, 
    'SERVICIO', 
    'VIDEO_CALL', 
    'u-expert-999', 
    NOW()
);

-- Servicio B: Mentoría
INSERT INTO "Service" (id, title, description, price, mode, "interactionType", "expertId", "createdAt")
----
VALUES (
    'srv-mentoria-sql', 
    'Masterclass SQL y Prisma', 
    'Aprende a modelar bases de datos como un profesional.', 
    200.00, 
    'MENTORIA', 
    'LIVE_CODING', 
    'u-expert-999', 
    NOW()
);

-- ==========================================================
-- 3. PASOS DE MENTORÍA (PARA AMBOS SERVICIOS)
-- ==========================================================

-- Pasos para 'Auditoría de Seguridad Web' (srv-auditoria)
INSERT INTO "MentorshipStep" (id, "order", title, completed, "serviceId")
VALUES 
('step-aud-1', 1, 'Escaneo inicial de puertos y servicios', false, 'srv-auditoria'),
('step-aud-2', 2, 'Pruebas de inyección y autenticación', false, 'srv-auditoria'),
('step-aud-3', 3, 'Entrega de informe de remediación', false, 'srv-auditoria');

-- Pasos para 'Masterclass SQL y Prisma' (srv-mentoria-sql)
INSERT INTO "MentorshipStep" (id, "order", title, completed, "serviceId")
VALUES 
('step-sql-1', 1, 'Diseño de esquema y relaciones', false, 'srv-mentoria-sql'),
('step-sql-2', 2, 'Configuración de Prisma Client', false, 'srv-mentoria-sql'),
('step-sql-3', 3, 'Optimización de queries y desplegue', false, 'srv-mentoria-sql');