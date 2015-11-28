use base_platform;

drop table if exists layout_two;
create table layout_two(
  id int primary key auto_increment,
  parent_id int not null,
  name varchar(20) not null,
  type enum('all', 'payment', 'flow') not null
)engine=InnoDB default charset=utf8;

