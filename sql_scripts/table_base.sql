use base_platform;

drop table if exists base_desc;
create table base_desc(
  id int unique not null,
  description text not null,
  logo text
)engine=InnoDB default charset=utf8;

insert into base_desc(id, description) values(1, '基地介绍 基地介绍 基地介绍 基地介绍 基地介绍');
