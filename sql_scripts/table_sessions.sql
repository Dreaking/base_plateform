use base_platform;

drop table if exists sessions;
create table sessions(
  session_id char(128) unique not null,
  atime timestamp not null default now(),
  data text
)engine=InnoDB default charset=utf8;