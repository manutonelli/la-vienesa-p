// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN — completar con los datos de tu proyecto Supabase
// Pasos: https://supabase.com → New project → Settings → API
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL         = 'https://jryuoxvewwqhfkvqnrat.supabase.co';   // Project URL
const SUPABASE_ANON_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeXVveHZld3dxaGZrdnFucmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTcwMjIsImV4cCI6MjA5Mjk3MzAyMn0.U5w01T17Ry_-UaefZI6sc8h9EMFY3i_vS4TyjHUaiBw';                       // anon / public
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeXVveHZld3dxaGZrdnFucmF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM5NzAyMiwiZXhwIjoyMDkyOTczMDIyfQ.aPTQpahD7prfHs_KcrKTFxEhBEr-GSHHIYNOa8dxw-Q';               // service_role (para crear usuarios)

// Nombres de las 3 sucursales — cambiar según corresponda
const SUCURSALES = ['Saladillo', 'Sucursal 2', 'Sucursal 3'];

// ─────────────────────────────────────────────────────────────────────────────
// No modificar debajo de esta línea
// ─────────────────────────────────────────────────────────────────────────────
const { createClient } = supabase;

// Cliente normal (empleados y admin para lectura/escritura de planillas)
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cliente de servicio (solo para crear/eliminar usuarios desde el panel admin)
const sbAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

