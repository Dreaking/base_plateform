use base_platform;

drop table if exists reply;
create table reply(
  reply_id int primary key auto_increment,
  content text not null,
  post_id int not null,
  user_id int not null,
  add_time bigint not null
)engine=InnoDB default charset=utf8;

