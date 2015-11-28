use base_platform;

drop table if exists userinfo;
create table userinfo(
  user_id int primary key not null,
  name varchar(20) not null,
  nickname varchar(20) not null,
  school_id int not null,
  major_id int not null,
  id_type varchar(20),
  id_number varchar(30),
  education_degree varchar(20),
  citizenship varchar(25),
  nationality varchar(25),
  characters varchar(20),
  address varchar(20),
  address_detail varchar(50),
  sid varchar(20),
  email varchar(30),
  phone varchar(13),
  gender enum('male', 'female') not null,
  birthday char(10),
  political_face varchar(10),
  grade int
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
