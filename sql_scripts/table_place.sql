use base_platform;

drop table if exists place;
create table place(
  place_id int primary key auto_increment,
  place_name varchar(20) not null
)engine=InnoDB default charset=utf8;

