use base_platform;

drop table if exists layout_one;
create table layout_one(
  id int primary key auto_increment,
  name varchar(20) not null,
  type enum('increment', 'decrement') not null
)engine=InnoDB default charset=utf8;

