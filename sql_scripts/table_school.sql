use base_platform;

drop table if exists school;
create table school(
  school_id int primary key auto_increment,
  school_name varchar(20) not null
)engine=InnoDB default charset=utf8;

insert into school(school_name) values('计算机学院');
insert into school(school_name) values('外语学院');

