-- ═══════════════════════════════════════════════════════════════════════
-- LA VIENESA — Setup inicial de base de datos
-- Ejecutar UNA SOLA VEZ en: Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Tabla de perfiles de usuario (nombre, rol, sucursal)
create table if not exists perfiles (
  id        uuid primary key references auth.users on delete cascade,
  nombre    text not null,
  rol       text not null check (rol in ('admin', 'empleado')),
  sucursal  text,
  created_at timestamptz default now()
);

-- 2. Tabla de planillas guardadas
create table if not exists registros (
  id           uuid default gen_random_uuid() primary key,
  tipo         text not null check (tipo in ('comida','devolucion','sobreventas','stock')),
  sucursal     text not null,
  fecha        date not null,
  data         jsonb not null,
  guardado_por text not null,
  guardado_en  timestamptz default now(),
  user_id      uuid references auth.users,
  -- Un solo registro por planilla/sucursal/fecha (el último guardado reemplaza al anterior)
  unique(tipo, sucursal, fecha)
);

-- 3. Función auxiliar para verificar si el usuario es admin
--    (security definer evita recursión en políticas RLS)
create or replace function es_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists(
    select 1 from perfiles
    where id = auth.uid() and rol = 'admin'
  )
$$;

-- 4. RLS — Perfiles
alter table perfiles enable row level security;

-- Cada usuario puede leer su propio perfil; admin lee todos
create policy "perfiles_select" on perfiles
  for select to authenticated
  using ( id = auth.uid() or es_admin() );

-- Solo service_role puede insertar/actualizar (via sbAdmin en la app)
-- No se necesitan políticas adicionales para la app

-- 5. RLS — Registros
alter table registros enable row level security;

-- Empleados ven solo su sucursal; admin ve todo
create policy "registros_select" on registros
  for select to authenticated
  using (
    es_admin()
    or (select sucursal from perfiles where id = auth.uid()) = sucursal
  );

-- Cualquier usuario autenticado puede insertar/actualizar (su sucursal la valida la app)
create policy "registros_insert" on registros
  for insert to authenticated
  with check (true);

create policy "registros_update" on registros
  for update to authenticated
  using (
    es_admin()
    or (select sucursal from perfiles where id = auth.uid()) = sucursal
  );

-- ═══════════════════════════════════════════════════════════════════════
-- 6. Crear el primer usuario ADMIN
--    (hacerlo desde Supabase → Authentication → Add user)
--    Después de crearlo, insertar su perfil acá:
-- ═══════════════════════════════════════════════════════════════════════

-- REEMPLAZAR el UUID con el ID real del usuario creado en Authentication
-- insert into perfiles (id, nombre, rol) values
--   ('00000000-0000-0000-0000-000000000000', 'Administrador', 'admin');
