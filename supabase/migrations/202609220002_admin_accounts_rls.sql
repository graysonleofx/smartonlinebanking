-- Allow verified admins to manage account records from the admin dashboard.
-- The is_admin() function is SECURITY DEFINER, so this policy does not recurse
-- through the accounts table policy while checking the current administrator.
alter table public.accounts enable row level security;

drop policy if exists "Admins can manage all accounts" on public.accounts;
create policy "Admins can manage all accounts" on public.accounts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

notify pgrst, 'reload schema';
