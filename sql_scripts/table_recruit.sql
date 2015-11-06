use base_platform;

drop table if exists recruit;
create table recruit(
  recruit_id int primary key auto_increment,
  recruit_title varchar(30) not null,
  team_id int not null,
  add_time bigint not null,
  content text,
  recruit_count int not null
)engine=InnoDB default charset=utf8;