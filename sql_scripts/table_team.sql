use base_platform;

drop table if exists team;
create table team(
  team_id int primary key auto_increment,
  team_name varchar(20) not null unique,
  school_id int not null,
  balance double not null,
  manager_id int not null unique,
  is_settled enum('true', 'false') not null
)engine=InnoDB default charset=utf8;