use base_platform;

drop table if exists room_apply;
create table room_apply(
  room_apply_id int primary key auto_increment,
  team_name varchar(20) not null,
  user_id int not null,
  place_id int not null,
  begin_time varchar(30) not null,
  end_time varchar(30) not null,
  add_time bigint not null,
  status enum('ongoing', 'approved', 'rejected') not null
)engine=InnoDB default charset=utf8;