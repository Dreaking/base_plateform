use base_platform;

drop table if exists flow;
create table flow(
  flow_id int primary key auto_increment,
  team_id int not null,
  description varchar(140) not null,
  layout_two_id int not null,
  amount double not null,
  operator_name varchar(20) not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;