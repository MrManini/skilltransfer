-- Insertar Cliente de Ejemplo
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt")
VALUES (
  gen_random_uuid(), 
  'Cliente Demo', 
  'cliente@skilltransfer.com', 
  'password123', -- Recuerda: En un entorno real, esto debería estar hasheado
  'CLIENT', 
  NOW()
);

-- Insertar Experto de Ejemplo
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt")
VALUES (
  gen_random_uuid(), 
  'Experto Demo', 
  'experto@skilltransfer.com', 
  'password123', -- Recuerda: En un entorno real, esto debería estar hasheado
  'EXPERT', 
  NOW()
);
