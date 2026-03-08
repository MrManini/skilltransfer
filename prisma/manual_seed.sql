--------------------------------------------------
-- USUARIOS
--------------------------------------------------

INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt")
VALUES
('client-1', 'Juan Cliente', 'cliente@test.com', '123456', 'CLIENT', NOW()),
('expert-1', 'Ana Experta', 'experto@test.com', '123456', 'EXPERT', NOW());


--------------------------------------------------
-- SERVICIOS DEL EXPERTO
--------------------------------------------------

INSERT INTO "Service" (
"id",
"title",
"description",
"price",
"mode",
"interactionType",
"createdAt",
"expertId"
)
VALUES
(
'service-1',
'Aprende Backend con NestJS',
'Te enseño arquitectura backend paso a paso',
120,
'MENTORIA',
'LIVE_CODING',
NOW(),
'expert-1'
),
(
'service-2',
'Debugging Profesional',
'Te ayudo a encontrar errores en tu código',
80,
'HIBRIDO',
'VIDEO_CALL',
NOW(),
'expert-1'
),
(
'service-3',
'Desarrollo de API por encargo',
'Yo desarrollo la API completa por ti',
300,
'EJECUTADO',
'NONE',
NOW(),
'expert-1'
);


--------------------------------------------------
-- PASOS DE MENTORIA DEL SERVICIO 1
--------------------------------------------------

INSERT INTO "MentorshipStep" (
"id",
"order",
"title",
"serviceId"
)
VALUES
(
'step-1',
1,
'Introducción a arquitectura backend',
'service-1'
),
(
'step-2',
2,
'Creación de API con NestJS',
'service-1'
),
(
'step-3',
3,
'Integración con base de datos',
'service-1'
);


--------------------------------------------------
-- PASOS DE MENTORIA DEL SERVICIO 2
--------------------------------------------------

INSERT INTO "MentorshipStep" (
"id",
"order",
"title",
"serviceId"
)
VALUES
(
'step-4',
1,
'Analizar el problema',
'service-2'
),
(
'step-5',
2,
'Debugging paso a paso',
'service-2'
);