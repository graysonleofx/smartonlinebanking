-- Cheque deposits extend the existing accounts and transactions model.
create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.accounts(id) on delete restrict,
  account_id uuid not null references public.accounts(id) on delete restrict,
  account_number text not null,
  type text not null default 'cheque' check (type = 'cheque'),
  amount numeric(18, 2) not null check (amount > 0),
  currency text not null check (currency in ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  cheque_number text not null,
  bank_name text not null,
  account_holder_name text not null,
  issue_date date not null,
  memo text,
  notes text,
  front_image_path text not null,
  back_image_path text not null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  admin_note text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, cheque_number)
);

alter table public.transactions add column if not exists user_id uuid references auth.users(id);
alter table public.transactions add column if not exists deposit_id uuid references public.deposits(id);
alter table public.transactions add column if not exists reference text;
alter table public.transactions add column if not exists user_account text;
alter table public.accounts add column if not exists role text not null default 'user';
create unique index if not exists transactions_deposit_id_key on public.transactions(deposit_id) where deposit_id is not null;

notify pgrst, 'reload schema';

insert into storage.buckets (id, name, public)
values ('cheque-images', 'cheque-images', false)
on conflict (id) do update set public = false;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.accounts where id = auth.uid() and role = 'admin'); $$;

alter table public.deposits enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Users can submit own cheque deposits" on public.deposits;
create policy "Users can submit own cheque deposits" on public.deposits for insert to authenticated
  with check (user_id = auth.uid() and account_id = auth.uid() and status = 'pending');
drop policy if exists "Users can read own deposits" on public.deposits;
create policy "Users can read own deposits" on public.deposits for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "Admins can review deposits" on public.deposits;
create policy "Admins can review deposits" on public.deposits for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Users can remove own pending deposits" on public.deposits;
create policy "Users can remove own pending deposits" on public.deposits for delete to authenticated
  using (user_id = auth.uid() and status = 'pending');

drop policy if exists "Users can read own transactions" on public.transactions;
create policy "Users can read own transactions" on public.transactions for select to authenticated
  using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()) or public.is_admin());
drop policy if exists "Users can create own pending deposit transaction" on public.transactions;
create policy "Users can create own pending deposit transaction" on public.transactions for insert to authenticated
  with check (user_id = auth.uid() and type = 'cheque_deposit' and status = 'pending');
drop policy if exists "Admins can manage transactions" on public.transactions;
create policy "Admins can manage transactions" on public.transactions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users upload own cheque images" on storage.objects;
create policy "Users upload own cheque images" on storage.objects for insert to authenticated
  with check (bucket_id = 'cheque-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users read own cheque images" on storage.objects;
create policy "Users read own cheque images" on storage.objects for select to authenticated
  using (bucket_id = 'cheque-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
drop policy if exists "Users replace own cheque images" on storage.objects;
create policy "Users replace own cheque images" on storage.objects for update to authenticated
  using (bucket_id = 'cheque-images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'cheque-images' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.review_cheque_deposit(p_deposit_id uuid, p_decision text, p_admin_note text default null)
returns public.deposits language plpgsql security definer set search_path = public
as $$
declare v_deposit public.deposits; v_transaction_id uuid;
begin
  if not public.is_admin() then raise exception 'Only administrators can review deposits'; end if;
  if p_decision not in ('approved', 'rejected') then raise exception 'Invalid deposit decision'; end if;
  select * into v_deposit from public.deposits where id = p_deposit_id for update;
  if not found then raise exception 'Deposit not found'; end if;
  if v_deposit.status <> 'pending' then raise exception 'Deposit has already been reviewed'; end if;
  update public.deposits set status = p_decision, reviewed_by = auth.uid(), reviewed_at = now(),
    approved_at = case when p_decision = 'approved' then now() else null end,
    admin_note = nullif(trim(p_admin_note), '') where id = p_deposit_id returning * into v_deposit;
  if p_decision = 'approved' then
    update public.accounts set checking_account_balance = coalesce(checking_account_balance, 0) + v_deposit.amount,
      balance = coalesce(balance, 0) + v_deposit.amount where id = v_deposit.account_id;
    if not found then raise exception 'Account not found'; end if;
  end if;
  update public.transactions set status = p_decision, note = coalesce(v_deposit.admin_note, note)
    where deposit_id = p_deposit_id returning id into v_transaction_id;
  if v_transaction_id is null then
    insert into public.transactions (user_id, email, account_name, user_account, type, amount, note, status, reference, deposit_id, created_at, date)
    select v_deposit.user_id, a.email, a.full_name, a.account_number, 'cheque_deposit', v_deposit.amount,
      coalesce(v_deposit.admin_note, 'Cheque deposit'), p_decision, 'CHEQUE-' || v_deposit.id, v_deposit.id, now(), now()::date
    from public.accounts a where a.id = v_deposit.user_id;
  end if;
  return v_deposit;
end; $$;
revoke all on function public.review_cheque_deposit(uuid, text, text) from public;
grant execute on function public.review_cheque_deposit(uuid, text, text) to authenticated;