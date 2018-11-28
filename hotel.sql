USE [hotel]
GO

--删除已存在表
if exists(select * from sysobjects where name = 'hotelinfo') drop table hotelinfo;
if exists(select * from sysobjects where name = 'member') drop table member;
if exists(select * from sysobjects where name = 'checkout') drop table checkout;
if exists(select * from sysobjects where name = 'livein') drop table livein;
if exists(select * from sysobjects where name = 'operator') drop table operator;
if exists(select * from sysobjects where name = 'customer') drop table customer;
if exists(select * from sysobjects where name = 'customertype') drop table customertype;
if exists(select * from sysobjects where name = 'roominfo') drop table roominfo;
if exists(select * from sysobjects where name = 'roomtype') drop table roomtype;

--创建会员表
CREATE TABLE [dbo].[member](
	[m_id] [int] NOT NULL primary key,
	[m_name] [varchar](20) NOT NULL,
	[sex] [varchar](1) NOT NULL,
	[credential_type] [varchar](20) NOT NULL,		--证件类型
	[creadential_no] [varchar](20) NOT NULL,		--证件号
	[m_tel] [varchar](11) NOT NULL,
	[address] [varchar](50) NULL,
	CONSTRAINT CK_sex1 CHECK (sex='男' OR sex='女'),
) 
GO

--创建顾客类型表
CREATE TABLE [dbo].[customertype](
	[type_id] [int] NOT NULL primary key,			--1,2
	[type] [varchar](10) NOT NULL,					--普通，会员
	[discount] [float] NOT NULL,
)
GO

--创建房间类型表
CREATE TABLE [dbo].[roomtype](
	[type_id] [int] NOT NULL primary key,	--1,2,3
	[type] [varchar](10) NOT NULL,			--标准间，长包房，双人房(一张双人床)
	[bed_num] [int] NOT NULL,
	[price] [float] NOT NULL,
	[foregift] [float] NOT NULL,			--租金
	[cl_room] [varchar](1) NOT NULL,		--是否为钟点房
	[cl_price] [float] NULL,
	CONSTRAINT CK_cl_room CHECK (cl_room='是' OR cl_room='否'),
)
GO

--创建房间信息表
CREATE TABLE [dbo].[roominfo](
	[room_id] [int] NOT NULL primary key,
	[type_id] [int] NOT NULL,
	[state] [varchar](2) NOT NULL,
	[statetime] [varchar](30) NULL,			--状态维持时间
	[remark] [varchar](50) NULL,			--备注，可为空
	foreign key([type_id]) references [dbo].[roomtype](type_id),
	CONSTRAINT CK_state CHECK (state='空闲' OR state='入住'),
)
GO

--创建顾客表
CREATE TABLE [dbo].[customer](
	[customer_id] [int] NOT NULL primary key,
	[type_id] [int] NOT NULL,
	[customer_name] [varchar](20) NOT NULL,
	[sex] [varchar](1) NOT NULL,
	[credential_type] [varchar](20) NOT NULL,
	[credential_no] [varchar](20) NOT NULL,
	foreign key([type_id]) references [dbo].[customertype](type_id),
	CONSTRAINT CK_sex2 CHECK (sex='男' OR sex='女'),
)
GO

--创建操作员表
CREATE TABLE [dbo].[operator](
	[operator_id] [int] NOT NULL primary key,
	[operator_name] varchar(20)	NOT NULL,
	[pwd] [varchar](10) NOT NULL,
)
GO

--创建入住信息表
CREATE TABLE [dbo].[livein](
	[in_no] [int] NOT NULL primary key,
	[room_id] [int] NOT NULL,
	[customer_id] [varchar](50) NOT NULL,
	[person_num] [int] NOT NULL,
	[in_time] [datetime] NOT NULL,			--入住时间
	[money] [float] NOT NULL,
	[days] [int] NOT NULL,					--预计住房时间
	[operator_id] [int] NOT NULL,
	foreign key([room_id]) references [dbo].[roominfo](room_id),
	foreign key([operator_id]) references [dbo].[operator](operator_id),
)
GO

--创建结算表
CREATE TABLE [dbo].[checkout](
	[chk_no] [int] NOT NULL primary key,
	[in_no] [int] NOT NULL,					
	[chk_time] [datetime] NOT NULL,			--结算时间
	[days] [int] NOT NULL,
	[money] [float] NOT NULL,
	[operator_id] [int] NOT NULL,
	foreign key([in_no]) references [dbo].[livein](in_no),
	foreign key([operator_id]) references [dbo].[operator](operator_id),
)
GO

--创建酒店信息总览表
CREATE TABLE [dbo].[hotelinfo](
	[room_num] [int] NOT NULL,
	[vacant_room_num] [int] NOT NULL,
	[standard_room_num] [int] NOT NULL,
	[vacant_standard_room_num] [int] NOT NULL,
	[permanent_room_num] [int] NOt NULL,
	[vacant_permanent_room_num] [int] NOt NULL,
	[double_bed_room_num] [int] NOT NULL,
	[vacant_double_bed_room_num] [int] NOT NULL,
	[current_person_num] [int] NOT NULL,
	[total_num] [int] NOT NULL,
	[occupancy] [float] NOT NULL,
)
GO

--创建customer insert触发器
if exists(select * from sysobjects where type='tr' and name='trig_customer_insert') drop trigger trig_customer_insert;
GO
create trigger trig_customer_insert
 on customer
 after insert
 as
 begin
	declare @perNum int;
	select @perNum = COUNT(*) from customer;
	update hotelinfo set current_person_num = @perNum;
	update hotelinfo set total_num = @perNum;
 end;
GO

--创建customer delete触发器
if exists(select * from sysobjects where type='tr' and name='trig_customer_delete') drop trigger trig_customer_delete;
GO
create trigger trig_customer_delete
 on customer
 after delete
 as
 begin
	declare @perNum int;
	select @perNum = COUNT(*) from customer;
	update hotelinfo set current_person_num = @perNum;
 end;
GO

--创建roominfo insert,delete触发器
if exists(select * from sysobjects where type='tr' and name='trig_roominfo_insert-delete') drop trigger trig_roominfo_insert_delete;
GO
create trigger trig_roominfo_insert_delete
 on roominfo
 after insert,delete
 as
 begin
	declare @roomNum int;
	declare @vacantRoomNum int;
	declare @standardRoomNum int;
	declare @vacantStandardRoomNum int;
	declare @permanentRoomNum int;
	declare @vacantPermanentRoomNum int;
	declare @doubleBedRoomNum int;
	declare @vacantDoubleBedRoomNum int;
	select @roomNum = COUNT(*) from roominfo;
	update hotelinfo set room_num = @roomNum;
	select @vacantRoomNum = COUNT(*) from roominfo where state = '空闲';
	update hotelinfo set vacant_room_num = @vacantRoomNum;
	select @standardRoomNum = COUNT(*) from roominfo where type_id = 1;
	update hotelinfo set standard_room_num = @standardRoomNum;
	select @vacantStandardRoomNum = COUNT(*) from roominfo where type_id = 1 and state = '空闲';
	update hotelinfo set vacant_standard_room_num = @vacantStandardRoomNum;
	select @permanentRoomNum = COUNT(*) from roominfo where type_id = 2;
	update hotelinfo set permanent_room_num = @permanentRoomNum;
	select @vacantPermanentRoomNum = COUNT(*) from roominfo where type_id = 2 and state = '空闲';
	update hotelinfo set vacant_permanent_room_num = @vacantPermanentRoomNum;
	select @doubleBedRoomNum = COUNT(*) from roominfo where type_id = 3;
	update hotelinfo set double_bed_room_num = @doubleBedRoomNum;
	select @vacantDoubleBedRoomNum = COUNT(*) from roominfo where type_id = 3 and state = '空闲';
	update hotelinfo set vacant_double_bed_room_num = @vacantDoubleBedRoomNum;
 end;
GO

--创建livein insert触发器
if exists(select * from sysobjects where type='tr' and name='trig_livein_insert') drop trigger trig_livein_insert;
GO
create trigger trig_livein_insert
 on livein
 after insert
 as
 begin
	declare @occupancy float;
	declare @roomNum int;
	declare @liveInRoomNum int;
	select @roomNum = room_num from hotelinfo;
	select @liveInRoomNum = COUNT(*) from livein;
	select @occupancy = (@liveInRoomNum+0.0) / @roomNum;
	update hotelinfo set occupancy = @occupancy;
 end;
Go

--添加数据