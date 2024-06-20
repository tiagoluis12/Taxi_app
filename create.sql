drop schema taxi_app cascade

create schema taxi_app

create table taxi_app.account (
  account_id_uuid primary key,
  name text not null,
  email text not null,
  cpf text not null,
  car_plate text null,
  is_passenger boolean not null default false,
  is_driver boolean not null default false,
)
