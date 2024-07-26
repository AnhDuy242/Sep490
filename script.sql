USE [master]
GO
/****** Object:  Database [MedPal]    Script Date: 7/26/2024 3:42:08 PM ******/
CREATE DATABASE [MedPal]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'MedPal', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\MedPal.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'MedPal_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\MedPal_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [MedPal] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [MedPal].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [MedPal] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [MedPal] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [MedPal] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [MedPal] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [MedPal] SET ARITHABORT OFF 
GO
ALTER DATABASE [MedPal] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [MedPal] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [MedPal] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [MedPal] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [MedPal] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [MedPal] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [MedPal] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [MedPal] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [MedPal] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [MedPal] SET  DISABLE_BROKER 
GO
ALTER DATABASE [MedPal] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [MedPal] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [MedPal] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [MedPal] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [MedPal] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [MedPal] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [MedPal] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [MedPal] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [MedPal] SET  MULTI_USER 
GO
ALTER DATABASE [MedPal] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [MedPal] SET DB_CHAINING OFF 
GO
ALTER DATABASE [MedPal] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [MedPal] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [MedPal] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [MedPal] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [MedPal] SET QUERY_STORE = OFF
GO
USE [MedPal]
GO
/****** Object:  Schema [HangFire]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE SCHEMA [HangFire]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[acc_id] [int] IDENTITY(1,1) NOT NULL,
	[phone] [nvarchar](11) NOT NULL,
	[email] [varchar](max) NULL,
	[password] [varchar](max) NOT NULL,
	[role_id] [int] NOT NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[acc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Admin]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin](
	[admin_id] [int] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[dob] [date] NOT NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Admin] PRIMARY KEY CLUSTERED 
(
	[admin_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Appointment]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointment](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[patient_id] [int] NOT NULL,
	[doctor_id] [int] NULL,
	[date] [date] NOT NULL,
	[slot_id] [int] NOT NULL,
	[status] [nvarchar](max) NOT NULL,
	[note] [nvarchar](max) NULL,
	[service_id] [int] NULL,
	[schedule_id] [int] NULL,
 CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Article_manager]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Article_manager](
	[a_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[dob] [date] NOT NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Receptionist] PRIMARY KEY CLUSTERED 
(
	[a_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog](
	[blog_id] [int] IDENTITY(1,1) NOT NULL,
	[content] [nvarchar](max) NOT NULL,
	[title] [nvarchar](max) NOT NULL,
	[doc_id] [int] NOT NULL,
	[date] [date] NOT NULL,
	[thumbnail] [nvarchar](max) NULL,
	[a_id] [int] NOT NULL,
 CONSTRAINT [PK_Blog] PRIMARY KEY CLUSTERED 
(
	[blog_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Department]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[dep_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED 
(
	[dep_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Doctor]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Doctor](
	[doc_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[age] [int] NOT NULL,
	[isActive] [bit] NULL,
	[img] [varchar](max) NULL,
	[description] [varchar](max) NULL,
	[dep_id] [int] NOT NULL,
 CONSTRAINT [PK_Doctor] PRIMARY KEY CLUSTERED 
(
	[doc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DoctorService]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoctorService](
	[doc_id] [int] NOT NULL,
	[service_id] [int] NOT NULL,
 CONSTRAINT [PK_DoctorService] PRIMARY KEY CLUSTERED 
(
	[doc_id] ASC,
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feedback]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feedback](
	[feed_id] [int] IDENTITY(1,1) NOT NULL,
	[patient_id] [int] NOT NULL,
	[content] [nvarchar](max) NULL,
	[date] [date] NOT NULL,
	[star] [int] NULL,
 CONSTRAINT [PK_Feedback] PRIMARY KEY CLUSTERED 
(
	[feed_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feedback_res]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feedback_res](
	[res_id] [int] NOT NULL,
	[feed_id] [int] NOT NULL,
	[recep_id] [int] NULL,
	[patient_id] [int] NULL,
	[content] [nvarchar](max) NOT NULL,
	[date] [date] NOT NULL,
 CONSTRAINT [PK_Feedback_res] PRIMARY KEY CLUSTERED 
(
	[res_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Img]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Img](
	[img_id] [int] IDENTITY(1,1) NOT NULL,
	[img_url] [varchar](max) NOT NULL,
	[blog_id] [int] NULL,
 CONSTRAINT [PK_Img] PRIMARY KEY CLUSTERED 
(
	[img_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medical_notebook]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medical_notebook](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[prescription] [nvarchar](max) NOT NULL,
	[diagnostic] [nvarchar](max) NOT NULL,
	[patient_id] [int] NOT NULL,
	[doctor_id] [int] NOT NULL,
	[date_create] [date] NULL,
 CONSTRAINT [PK_Medical_notebook] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Patient]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Patient](
	[patient_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[address] [nvarchar](max) NULL,
	[dob] [date] NOT NULL,
	[isActive] [bit] NULL,
	[check] [int] NULL,
 CONSTRAINT [PK_Patient] PRIMARY KEY CLUSTERED 
(
	[patient_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Question](
	[ques_id] [int] IDENTITY(1,1) NOT NULL,
	[patient_id] [int] NOT NULL,
	[question] [nvarchar](max) NOT NULL,
	[ques_date] [date] NOT NULL,
	[dep_id] [int] NULL,
	[doc_id] [int] NULL,
	[ans_date] [date] NULL,
	[answer] [nvarchar](max) NULL,
 CONSTRAINT [PK_Question] PRIMARY KEY CLUSTERED 
(
	[ques_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Receptionist]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Receptionist](
	[recep_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[dob] [date] NOT NULL,
 CONSTRAINT [PK_Receprionist] PRIMARY KEY CLUSTERED 
(
	[recep_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[role_id] [int] IDENTITY(1,1) NOT NULL,
	[role_name] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedule]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedule](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[doctor_id] [int] NOT NULL,
	[morning] [bit] NOT NULL,
	[afternoon] [bit] NOT NULL,
	[weekdays] [nvarchar](50) NOT NULL,
	[date] [date] NOT NULL,
	[appointments] [int] NULL,
 CONSTRAINT [PK_Schedule] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Service]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Service](
	[service_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[dep_id] [int] NOT NULL,
	[price] [money] NOT NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Service] PRIMARY KEY CLUSTERED 
(
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Slot]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Slot](
	[slot_id] [int] IDENTITY(1,1) NOT NULL,
	[time] [varchar](max) NOT NULL,
	[shift] [int] NULL,
 CONSTRAINT [PK_Slot] PRIMARY KEY CLUSTERED 
(
	[slot_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_result]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_result](
	[img_id] [int] IDENTITY(1,1) NOT NULL,
	[img_url] [varchar](max) NOT NULL,
	[m_id] [int] NOT NULL,
 CONSTRAINT [PK_Test_result] PRIMARY KEY CLUSTERED 
(
	[img_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[AggregatedCounter]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[AggregatedCounter](
	[Key] [nvarchar](100) NOT NULL,
	[Value] [bigint] NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_CounterAggregated] PRIMARY KEY CLUSTERED 
(
	[Key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Counter]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Counter](
	[Key] [nvarchar](100) NOT NULL,
	[Value] [int] NOT NULL,
	[ExpireAt] [datetime] NULL,
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_HangFire_Counter] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Hash]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Hash](
	[Key] [nvarchar](100) NOT NULL,
	[Field] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[ExpireAt] [datetime2](7) NULL,
 CONSTRAINT [PK_HangFire_Hash] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Field] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Job]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Job](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[StateId] [bigint] NULL,
	[StateName] [nvarchar](20) NULL,
	[InvocationData] [nvarchar](max) NOT NULL,
	[Arguments] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_Job] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[JobParameter]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[JobParameter](
	[JobId] [bigint] NOT NULL,
	[Name] [nvarchar](40) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_HangFire_JobParameter] PRIMARY KEY CLUSTERED 
(
	[JobId] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[JobQueue]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[JobQueue](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[JobId] [bigint] NOT NULL,
	[Queue] [nvarchar](50) NOT NULL,
	[FetchedAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_JobQueue] PRIMARY KEY CLUSTERED 
(
	[Queue] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[List]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[List](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Key] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_List] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Schema]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Schema](
	[Version] [int] NOT NULL,
 CONSTRAINT [PK_HangFire_Schema] PRIMARY KEY CLUSTERED 
(
	[Version] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Server]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Server](
	[Id] [nvarchar](200) NOT NULL,
	[Data] [nvarchar](max) NULL,
	[LastHeartbeat] [datetime] NOT NULL,
 CONSTRAINT [PK_HangFire_Server] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Set]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Set](
	[Key] [nvarchar](100) NOT NULL,
	[Score] [float] NOT NULL,
	[Value] [nvarchar](256) NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_Set] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Value] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[State]    Script Date: 7/26/2024 3:42:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[State](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[JobId] [bigint] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
	[Reason] [nvarchar](100) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[Data] [nvarchar](max) NULL,
 CONSTRAINT [PK_HangFire_State] PRIMARY KEY CLUSTERED 
(
	[JobId] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Account] ON 

INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (1, N'0123456789', N'admin@example.com', N'admin123', 1, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (2, N'0987654321', N'doctor@example.com', N'doctor123', 2, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (3, N'0234567891', N'patient@example.com', N'patient123', 3, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (4, N'0345678912', N'articlemanager@example.com', N'article123', 4, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (5, N'0456789123', N'receptionist@example.com', N'reception123', 5, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (7, N'0345322806', NULL, N'u7B4kiw1', 2, 1)
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (8, N'0985655223', N'abc@asd', N'sdva', 3, 1)
SET IDENTITY_INSERT [dbo].[Account] OFF
GO
INSERT [dbo].[Admin] ([admin_id], [name], [gender], [dob], [isActive]) VALUES (1, N'Admin User', N'Male', CAST(N'1980-01-01' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[Appointment] ON 

INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id], [schedule_id]) VALUES (2, 3, 2, CAST(N'2024-06-24' AS Date), 1, N'Scheduled', N'First visit', NULL, NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id], [schedule_id]) VALUES (5, 3, 2, CAST(N'2024-09-24' AS Date), 1, N'Đã hủy', NULL, NULL, NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id], [schedule_id]) VALUES (9, 3, 2, CAST(N'2024-07-30' AS Date), 1, N'Đang chờ phê duyệt', NULL, 1, NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id], [schedule_id]) VALUES (11, 3, 2, CAST(N'2024-06-24' AS Date), 1, N'Đang chờ phê duyệt', NULL, 1, 2)
SET IDENTITY_INSERT [dbo].[Appointment] OFF
GO
INSERT [dbo].[Article_manager] ([a_id], [name], [gender], [dob], [isActive]) VALUES (4, N'Article Manager', N'Female', CAST(N'1985-08-25' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[Blog] ON 

INSERT [dbo].[Blog] ([blog_id], [content], [title], [doc_id], [date], [thumbnail], [a_id]) VALUES (2, N'Content of the blog', N'Blog Title', 2, CAST(N'2024-06-27' AS Date), N'thumbnail.jpg', 4)
SET IDENTITY_INSERT [dbo].[Blog] OFF
GO
SET IDENTITY_INSERT [dbo].[Department] ON 

INSERT [dbo].[Department] ([dep_id], [name], [isActive]) VALUES (1, N'Cardiology', 1)
INSERT [dbo].[Department] ([dep_id], [name], [isActive]) VALUES (2, N'Neurology', 1)
SET IDENTITY_INSERT [dbo].[Department] OFF
GO
INSERT [dbo].[Doctor] ([doc_id], [name], [gender], [age], [isActive], [img], [description], [dep_id]) VALUES (2, N'Doctor User', N'Female', 40, 1, NULL, NULL, 1)
INSERT [dbo].[Doctor] ([doc_id], [name], [gender], [age], [isActive], [img], [description], [dep_id]) VALUES (7, N'abc', N'Male', 23, 1, NULL, NULL, 2)
GO
INSERT [dbo].[DoctorService] ([doc_id], [service_id]) VALUES (2, 1)
INSERT [dbo].[DoctorService] ([doc_id], [service_id]) VALUES (2, 2)
INSERT [dbo].[DoctorService] ([doc_id], [service_id]) VALUES (7, 1)
INSERT [dbo].[DoctorService] ([doc_id], [service_id]) VALUES (7, 2)
GO
SET IDENTITY_INSERT [dbo].[Feedback] ON 

INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (1, 3, N'Great service!', CAST(N'2024-06-26' AS Date), 5)
INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (3, 3, N'te vai', CAST(N'2024-07-23' AS Date), 1)
SET IDENTITY_INSERT [dbo].[Feedback] OFF
GO
INSERT [dbo].[Feedback_res] ([res_id], [feed_id], [recep_id], [patient_id], [content], [date]) VALUES (1, 1, 5, 3, N'Thank you for your feedback!', CAST(N'2024-06-27' AS Date))
GO
SET IDENTITY_INSERT [dbo].[Medical_notebook] ON 

INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (2, N'Take 2 pills daily', N'Flu', 3, 2, NULL)
SET IDENTITY_INSERT [dbo].[Medical_notebook] OFF
GO
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive], [check]) VALUES (3, N'Patient User', N'Male', N'123 Street', CAST(N'1990-05-15' AS Date), 1, NULL)
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive], [check]) VALUES (8, N'string', N'male', N'hani', CAST(N'2024-07-10' AS Date), 1, NULL)
GO
SET IDENTITY_INSERT [dbo].[Question] ON 

INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (2, 3, N'What are the symptoms of flu?', CAST(N'2024-06-25' AS Date), 1, 2, CAST(N'2024-06-26' AS Date), N'Common symptoms are...')
INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (3, 3, N'cai gi day', CAST(N'2024-07-23' AS Date), 1, 2, CAST(N'2024-07-23' AS Date), N'khong biet nua')
INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (4, 3, N'hello xin chao tat ca moi nguoi', CAST(N'2024-07-23' AS Date), 2, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Question] OFF
GO
INSERT [dbo].[Receptionist] ([recep_id], [name], [gender], [dob]) VALUES (5, N'Receptionist User', N'Male', CAST(N'1988-11-30' AS Date))
GO
SET IDENTITY_INSERT [dbo].[Role] ON 

INSERT [dbo].[Role] ([role_id], [role_name]) VALUES (1, N'Admin')
INSERT [dbo].[Role] ([role_id], [role_name]) VALUES (2, N'Doctor')
INSERT [dbo].[Role] ([role_id], [role_name]) VALUES (3, N'Patient')
INSERT [dbo].[Role] ([role_id], [role_name]) VALUES (4, N'ArticleManager')
INSERT [dbo].[Role] ([role_id], [role_name]) VALUES (5, N'Receptionist')
SET IDENTITY_INSERT [dbo].[Role] OFF
GO
SET IDENTITY_INSERT [dbo].[Schedule] ON 

INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (2, 2, 1, 0, N'Monday', CAST(N'2024-06-24' AS Date), 10)
SET IDENTITY_INSERT [dbo].[Schedule] OFF
GO
SET IDENTITY_INSERT [dbo].[Service] ON 

INSERT [dbo].[Service] ([service_id], [name], [dep_id], [price], [isActive]) VALUES (1, N'Heart Checkup', 1, 1000.0000, 1)
INSERT [dbo].[Service] ([service_id], [name], [dep_id], [price], [isActive]) VALUES (2, N'Brain MRI', 2, 2000.0000, 1)
SET IDENTITY_INSERT [dbo].[Service] OFF
GO
SET IDENTITY_INSERT [dbo].[Slot] ON 

INSERT [dbo].[Slot] ([slot_id], [time], [shift]) VALUES (1, N'09:00-10:00', NULL)
INSERT [dbo].[Slot] ([slot_id], [time], [shift]) VALUES (2, N'10:00-11:00', NULL)
SET IDENTITY_INSERT [dbo].[Slot] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_result] ON 

INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (1, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721675135/sample_image.jpg', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (2, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721815465/sample_image.png', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (3, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721815572/sample_image.png', 2)
SET IDENTITY_INSERT [dbo].[Test_result] OFF
GO
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded', 2, NULL)
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded:2024-07-23', 1, CAST(N'2024-08-23T04:17:24.270' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded:2024-07-24', 1, CAST(N'2024-08-24T03:45:40.390' AS DateTime))
GO
SET IDENTITY_INSERT [HangFire].[Counter] ON 

INSERT [HangFire].[Counter] ([Key], [Value], [ExpireAt], [Id]) VALUES (N'stats:succeeded', 1, NULL, 7)
INSERT [HangFire].[Counter] ([Key], [Value], [ExpireAt], [Id]) VALUES (N'stats:succeeded:2024-07-26', 1, CAST(N'2024-08-26T08:17:51.183' AS DateTime), 8)
INSERT [HangFire].[Counter] ([Key], [Value], [ExpireAt], [Id]) VALUES (N'stats:succeeded:2024-07-26-08', 1, CAST(N'2024-07-27T08:17:51.183' AS DateTime), 9)
SET IDENTITY_INSERT [HangFire].[Counter] OFF
GO
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'CreatedAt', N'2024-07-22T08:28:30.0385558Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Cron', N'0 0 * * *', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Job', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointments","ParameterTypes":"[]","Arguments":"[]"}', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'LastExecution', N'2024-07-26T08:17:48.1000606Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'LastJobId', N'3', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'NextExecution', N'2024-07-27T00:00:00.0000000Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Queue', N'default', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'TimeZoneId', N'UTC', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'V', N'2', NULL)
GO
SET IDENTITY_INSERT [HangFire].[Job] ON 

INSERT [HangFire].[Job] ([Id], [StateId], [StateName], [InvocationData], [Arguments], [CreatedAt], [ExpireAt]) VALUES (3, 9, N'Succeeded', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointments","ParameterTypes":"[]","Arguments":null}', N'[]', CAST(N'2024-07-26T08:17:48.180' AS DateTime), CAST(N'2024-07-27T08:17:51.187' AS DateTime))
SET IDENTITY_INSERT [HangFire].[Job] OFF
GO
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (3, N'CurrentCulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (3, N'CurrentUICulture', N'"en-GB"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (3, N'RecurringJobId', N'"send-reminders"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (3, N'Time', N'1721981868')
GO
INSERT [HangFire].[Schema] ([Version]) VALUES (9)
GO
INSERT [HangFire].[Server] ([Id], [Data], [LastHeartbeat]) VALUES (N'ducanh:29116:062673be-5679-455c-9a0b-1893e2d2d9e8', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2024-07-26T08:17:47.7884905Z"}', CAST(N'2024-07-26T08:18:48.040' AS DateTime))
INSERT [HangFire].[Server] ([Id], [Data], [LastHeartbeat]) VALUES (N'ducanh:29116:e12bd561-a0cc-40fe-9e55-f7311fe5cb58', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2024-07-26T08:17:48.4356777Z"}', CAST(N'2024-07-26T08:18:48.460' AS DateTime))
GO
INSERT [HangFire].[Set] ([Key], [Score], [Value], [ExpireAt]) VALUES (N'recurring-jobs', 1722038400, N'send-reminders', NULL)
GO
SET IDENTITY_INSERT [HangFire].[State] ON 

INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (7, 3, N'Enqueued', N'Triggered by recurring job scheduler', CAST(N'2024-07-26T08:17:48.220' AS DateTime), N'{"EnqueuedAt":"2024-07-26T08:17:48.2033550Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (8, 3, N'Processing', NULL, CAST(N'2024-07-26T08:17:48.610' AS DateTime), N'{"StartedAt":"2024-07-26T08:17:48.3968267Z","ServerId":"ducanh:29116:062673be-5679-455c-9a0b-1893e2d2d9e8","WorkerId":"5abaf244-36e7-4122-9e76-8a9d9fa106a1"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (9, 3, N'Succeeded', NULL, CAST(N'2024-07-26T08:17:51.183' AS DateTime), N'{"SucceededAt":"2024-07-26T08:17:51.1790188Z","PerformanceDuration":"2562","Latency":"436"}')
SET IDENTITY_INSERT [HangFire].[State] OFF
GO
/****** Object:  Index [IX_HangFire_AggregatedCounter_ExpireAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_AggregatedCounter_ExpireAt] ON [HangFire].[AggregatedCounter]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Hash_ExpireAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Hash_ExpireAt] ON [HangFire].[Hash]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Job_ExpireAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Job_ExpireAt] ON [HangFire].[Job]
(
	[ExpireAt] ASC
)
INCLUDE([StateName]) 
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_HangFire_Job_StateName]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Job_StateName] ON [HangFire].[Job]
(
	[StateName] ASC
)
WHERE ([StateName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_List_ExpireAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_List_ExpireAt] ON [HangFire].[List]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Server_LastHeartbeat]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Server_LastHeartbeat] ON [HangFire].[Server]
(
	[LastHeartbeat] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Set_ExpireAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_ExpireAt] ON [HangFire].[Set]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_HangFire_Set_Score]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_Score] ON [HangFire].[Set]
(
	[Key] ASC,
	[Score] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_State_CreatedAt]    Script Date: 7/26/2024 3:42:09 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_State_CreatedAt] ON [HangFire].[State]
(
	[CreatedAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Account]  WITH CHECK ADD  CONSTRAINT [FK_Account_Role] FOREIGN KEY([role_id])
REFERENCES [dbo].[Role] ([role_id])
GO
ALTER TABLE [dbo].[Account] CHECK CONSTRAINT [FK_Account_Role]
GO
ALTER TABLE [dbo].[Admin]  WITH CHECK ADD  CONSTRAINT [FK_Admin_Account] FOREIGN KEY([admin_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Admin] CHECK CONSTRAINT [FK_Admin_Account]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Doctor] FOREIGN KEY([doctor_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Doctor]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Patient] FOREIGN KEY([patient_id])
REFERENCES [dbo].[Patient] ([patient_id])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Patient]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Schedule] FOREIGN KEY([schedule_id])
REFERENCES [dbo].[Schedule] ([id])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Schedule]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Service] FOREIGN KEY([service_id])
REFERENCES [dbo].[Service] ([service_id])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Service]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Slot] FOREIGN KEY([slot_id])
REFERENCES [dbo].[Slot] ([slot_id])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Slot]
GO
ALTER TABLE [dbo].[Article_manager]  WITH CHECK ADD  CONSTRAINT [FK_Article_manager_Account] FOREIGN KEY([a_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Article_manager] CHECK CONSTRAINT [FK_Article_manager_Account]
GO
ALTER TABLE [dbo].[Blog]  WITH CHECK ADD  CONSTRAINT [FK_Blog_Article_manager] FOREIGN KEY([a_id])
REFERENCES [dbo].[Article_manager] ([a_id])
GO
ALTER TABLE [dbo].[Blog] CHECK CONSTRAINT [FK_Blog_Article_manager]
GO
ALTER TABLE [dbo].[Blog]  WITH CHECK ADD  CONSTRAINT [FK_Blog_Doctor] FOREIGN KEY([doc_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Blog] CHECK CONSTRAINT [FK_Blog_Doctor]
GO
ALTER TABLE [dbo].[Doctor]  WITH CHECK ADD  CONSTRAINT [FK_Doctor_Account] FOREIGN KEY([doc_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Doctor] CHECK CONSTRAINT [FK_Doctor_Account]
GO
ALTER TABLE [dbo].[Doctor]  WITH CHECK ADD  CONSTRAINT [FK_Doctor_Department] FOREIGN KEY([dep_id])
REFERENCES [dbo].[Department] ([dep_id])
GO
ALTER TABLE [dbo].[Doctor] CHECK CONSTRAINT [FK_Doctor_Department]
GO
ALTER TABLE [dbo].[DoctorService]  WITH CHECK ADD  CONSTRAINT [FK_DoctorService_Doctor] FOREIGN KEY([doc_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[DoctorService] CHECK CONSTRAINT [FK_DoctorService_Doctor]
GO
ALTER TABLE [dbo].[DoctorService]  WITH CHECK ADD  CONSTRAINT [FK_DoctorService_Service] FOREIGN KEY([service_id])
REFERENCES [dbo].[Service] ([service_id])
GO
ALTER TABLE [dbo].[DoctorService] CHECK CONSTRAINT [FK_DoctorService_Service]
GO
ALTER TABLE [dbo].[Feedback]  WITH CHECK ADD  CONSTRAINT [FK_Feedback_Patient] FOREIGN KEY([patient_id])
REFERENCES [dbo].[Patient] ([patient_id])
GO
ALTER TABLE [dbo].[Feedback] CHECK CONSTRAINT [FK_Feedback_Patient]
GO
ALTER TABLE [dbo].[Feedback_res]  WITH CHECK ADD  CONSTRAINT [FK_Feedback_res_Feedback] FOREIGN KEY([feed_id])
REFERENCES [dbo].[Feedback] ([feed_id])
GO
ALTER TABLE [dbo].[Feedback_res] CHECK CONSTRAINT [FK_Feedback_res_Feedback]
GO
ALTER TABLE [dbo].[Feedback_res]  WITH CHECK ADD  CONSTRAINT [FK_Feedback_res_Receprionist] FOREIGN KEY([recep_id])
REFERENCES [dbo].[Receptionist] ([recep_id])
GO
ALTER TABLE [dbo].[Feedback_res] CHECK CONSTRAINT [FK_Feedback_res_Receprionist]
GO
ALTER TABLE [dbo].[Img]  WITH CHECK ADD  CONSTRAINT [FK_Img_Blog] FOREIGN KEY([blog_id])
REFERENCES [dbo].[Blog] ([blog_id])
GO
ALTER TABLE [dbo].[Img] CHECK CONSTRAINT [FK_Img_Blog]
GO
ALTER TABLE [dbo].[Medical_notebook]  WITH CHECK ADD  CONSTRAINT [FK_Medical_notebook_Doctor] FOREIGN KEY([doctor_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Medical_notebook] CHECK CONSTRAINT [FK_Medical_notebook_Doctor]
GO
ALTER TABLE [dbo].[Medical_notebook]  WITH CHECK ADD  CONSTRAINT [FK_Medical_notebook_Patient] FOREIGN KEY([patient_id])
REFERENCES [dbo].[Patient] ([patient_id])
GO
ALTER TABLE [dbo].[Medical_notebook] CHECK CONSTRAINT [FK_Medical_notebook_Patient]
GO
ALTER TABLE [dbo].[Patient]  WITH CHECK ADD  CONSTRAINT [FK_Patient_Account] FOREIGN KEY([patient_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Patient] CHECK CONSTRAINT [FK_Patient_Account]
GO
ALTER TABLE [dbo].[Question]  WITH CHECK ADD  CONSTRAINT [FK_Question_Department] FOREIGN KEY([dep_id])
REFERENCES [dbo].[Department] ([dep_id])
GO
ALTER TABLE [dbo].[Question] CHECK CONSTRAINT [FK_Question_Department]
GO
ALTER TABLE [dbo].[Question]  WITH CHECK ADD  CONSTRAINT [FK_Question_Doctor] FOREIGN KEY([doc_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Question] CHECK CONSTRAINT [FK_Question_Doctor]
GO
ALTER TABLE [dbo].[Question]  WITH CHECK ADD  CONSTRAINT [FK_Question_Patient] FOREIGN KEY([patient_id])
REFERENCES [dbo].[Patient] ([patient_id])
GO
ALTER TABLE [dbo].[Question] CHECK CONSTRAINT [FK_Question_Patient]
GO
ALTER TABLE [dbo].[Receptionist]  WITH CHECK ADD  CONSTRAINT [FK_Receprionist_Account] FOREIGN KEY([recep_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Receptionist] CHECK CONSTRAINT [FK_Receprionist_Account]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Doctor] FOREIGN KEY([doctor_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Doctor]
GO
ALTER TABLE [dbo].[Service]  WITH CHECK ADD  CONSTRAINT [FK_Service_Department] FOREIGN KEY([dep_id])
REFERENCES [dbo].[Department] ([dep_id])
GO
ALTER TABLE [dbo].[Service] CHECK CONSTRAINT [FK_Service_Department]
GO
ALTER TABLE [dbo].[Test_result]  WITH CHECK ADD  CONSTRAINT [FK_Test_result_Medical_notebook] FOREIGN KEY([m_id])
REFERENCES [dbo].[Medical_notebook] ([id])
GO
ALTER TABLE [dbo].[Test_result] CHECK CONSTRAINT [FK_Test_result_Medical_notebook]
GO
ALTER TABLE [HangFire].[JobParameter]  WITH CHECK ADD  CONSTRAINT [FK_HangFire_JobParameter_Job] FOREIGN KEY([JobId])
REFERENCES [HangFire].[Job] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [HangFire].[JobParameter] CHECK CONSTRAINT [FK_HangFire_JobParameter_Job]
GO
ALTER TABLE [HangFire].[State]  WITH CHECK ADD  CONSTRAINT [FK_HangFire_State_Job] FOREIGN KEY([JobId])
REFERENCES [HangFire].[Job] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [HangFire].[State] CHECK CONSTRAINT [FK_HangFire_State_Job]
GO
USE [master]
GO
ALTER DATABASE [MedPal] SET  READ_WRITE 
GO
