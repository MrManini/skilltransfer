INSERT INTO "Booking" (
  "id",
  "scheduledAt",
  "status",
  "createdAt",
  "serviceId",
  "clientId"
) VALUES (
  2,           -- genera un UUID único
  '2026-03-10 15:00:00',      -- fecha y hora de la reserva
  'PENDIENTE',                 -- estado inicial
  NOW(),                       -- fecha de creación actual
  'service-1',  -- id del servicio
  'client-1'   -- id del cliente
);