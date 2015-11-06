use base_platform;

drop table if exists excelfile;
create table excelfile(
  filename varchar(30) primary key not null,
  add_time bigint not null,
  data text not null
)engine=InnoDB default charset=utf8;