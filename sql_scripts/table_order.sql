use base_platform;

drop table if exists orders;
create table orders(
  order_id int primary key auto_increment,
  user_id int not null,
  team_id int not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;
