use base_platform;

drop table if exists teaminfo;
create table teaminfo(
  team_id int primary key not null,
  description text,
  project_desc text,
  logo_base64 text
)engine=InnoDB default charset=utf8;
