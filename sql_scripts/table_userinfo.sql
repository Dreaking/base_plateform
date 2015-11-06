use base_platform;

drop table if exists userinfo;
create table userinfo(
  user_id int primary key not null,
  name varchar(20) not null,
  school_id int not null,
  major_id int not null,
  nickname varchar(20) not null,
  sid varchar(20),
  email varchar(30),
  qq varchar(11),
  phone varchar(13),
  gender enum('male', 'female') not null,
  birthday bigint
)engine=InnoDB default charset=utf8;

insert into userinfo(user_id, name, school_id,
                     major_id, nickname, gender, phone) values(2, '阮进益',1, 1,'farseer810', 'male', '18819451429');
insert into userinfo(user_id, name, school_id,
                     major_id, nickname, gender, phone) values(3, '张振宗', 1, 1, 'zzz', 'male', '15521085815');
insert into userinfo(user_id, name, school_id,
                     major_id, nickname, gender, phone) values(4, '陈俊宇', 1, 1, 'raunicorn', 'male', '18819451417');
insert into userinfo(user_id, name, school_id,
                     major_id, nickname, gender, phone) values(5, '刘健', 1, 1, 'ch_oosy', 'male', '15521107100');
insert into userinfo(user_id, name, school_id,
                     major_id, nickname, gender, phone) values(6, '吴丹勇', 1, 1, 'simplefatty', 'male', '15626242647');
