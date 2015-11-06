use base_platform;

drop table if exists post;
create table post(
  post_id int primary key auto_increment,
  title varchar(20) not null,
  content text not null,
  section_id int not null,
  user_id int not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;

