use base_platform;

drop table if exists apply;
create table apply(
  apply_id int primary key auto_increment,
  activity_id int not null,
  user_id int not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;

