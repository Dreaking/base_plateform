use base_platform;

drop table if exists section;
create table section(
  section_id int primary key auto_increment,
  section_name varchar(20) not null,
  view_count bigint not null
)engine=InnoDB default charset=utf8;

insert into section(section_name, view_count) values('活动讨论', 0);
insert into section(section_name, view_count) values('基地反馈', 0);
insert into section(section_name, view_count) values('每日一水', 0);