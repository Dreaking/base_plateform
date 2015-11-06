use base_platform;

drop table if exists payment_type;
create table payment_type(
  id int primary key not null,
  data text not null
)engine=InnoDB default charset=utf8;

insert into payment_type values(1, '');

