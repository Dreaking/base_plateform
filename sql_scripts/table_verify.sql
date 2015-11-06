use base_platform;

drop table if exists verify;
create table verify(
  user_id int primary key not null,
  verify_code char(6) not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;