use base_platform;

drop table if exists user;
create table user(
  user_id int primary key auto_increment not null,
  login_name varchar(16) not null unique,
  password char(32),
  type enum('0', '1','2', '3', '4', '5', '6') not null,
  team_id int
)engine=InnoDB default charset=utf8;

insert into user(login_name, password, type) values('admin', '21232f297a57a5a743894a0e4a801fc3', '0');
insert into user(login_name, password, type, team_id) values('18819451429', 'e10adc3949ba59abbe56e057f20f883e', '5',NULL);
insert into user(login_name, password, type, team_id) values('15521085815', 'e10adc3949ba59abbe56e057f20f883e', '5', NULL);
insert into user(login_name, password, type, team_id) values('18819451417', 'e10adc3949ba59abbe56e057f20f883e', '5', NULL);
insert into user(login_name, password, type, team_id) values('15521107100', 'e10adc3949ba59abbe56e057f20f883e', '5', NULL);
insert into user(login_name, password, type, team_id) values('15626242647', 'e10adc3949ba59abbe56e057f20f883e', '5', NULL);