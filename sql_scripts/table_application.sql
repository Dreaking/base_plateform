use base_platform;

drop table if exists application;
create table application(
  application_id int primary key auto_increment,
  user_id int not null,
  new_team_name varchar(20) not null,
  add_time bigint not null,
  operate_range text not null,
  manager_name varchar(20) not null,
  guide_teacher varchar(20) not null,
  class_name text not null,
  phone varchar(20) not null,
  status enum('ongoing', 'approved', 'rejected') not null,
  project_desc text not null,
  team_desc text not null,
  apply_reason text not null,
  user_list text not null
)engine=InnoDB default charset=utf8;
