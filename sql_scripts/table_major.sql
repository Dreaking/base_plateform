use base_platform;

drop table if exists major;
create table major(
  major_id int primary key auto_increment,
  major_name varchar(20) not null,
  school_id int not null
)engine=InnoDB default charset=utf8;

insert into major(major_name, school_id) values('网络工程', 1);
insert into major(major_name, school_id) values('计算机科学与技术', 1);
insert into major(major_name, school_id) values('法语文学', 2);
insert into major(major_name, school_id) values('商务英语', 2);
insert into major(major_name, school_id) values('英语文学', 2);
