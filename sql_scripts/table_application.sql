use base_platform;

drop table if exists application;
create table application(
  application_id int primary key auto_increment,
  user_id int not null,
  new_team_name varchar(20) not null unique,
  add_time bigint not null,
  materials text not null,
  status enum('ongoing', 'approved', 'rejected') not null,
  excel_file text
)engine=InnoDB default charset=utf8;
