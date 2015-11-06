use base_platform;

drop table if exists notice;
create table notice(
  notice_id int primary key auto_increment,
  title varchar(50) not null,
  add_time bigint not null,
  content text not null,
  type enum('base', 'match', 'activity') not null
)engine=InnoDB default charset=utf8;

