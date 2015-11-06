use base_platform;

drop table if exists goods;
create table goods(
  good_id int primary key auto_increment,
  good_name varchar(20) not null,
  price double not null
)engine=InnoDB default charset=utf8;