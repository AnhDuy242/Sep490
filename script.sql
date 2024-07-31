USE [master]
GO
/****** Object:  Database [MedPal]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE DATABASE [MedPal]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'MedPal', FILENAME = N'D:\SSMS\MSSQL16.MSSQLSERVER\MSSQL\DATA\MedPal.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'MedPal_log', FILENAME = N'D:\SSMS\MSSQL16.MSSQLSERVER\MSSQL\DATA\MedPal_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [MedPal] SET COMPATIBILITY_LEVEL = 160
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
ALTER DATABASE [MedPal] SET AUTO_CLOSE ON 
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
ALTER DATABASE [MedPal] SET  ENABLE_BROKER 
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
ALTER DATABASE [MedPal] SET QUERY_STORE = ON
GO
ALTER DATABASE [MedPal] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [MedPal]
GO
/****** Object:  Schema [HangFire]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE SCHEMA [HangFire]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Admin]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Appointment]    Script Date: 7/31/2024 12:34:31 PM ******/
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
 CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Article_manager]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Blog]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Conversations]    Script Date: 7/31/2024 12:34:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Conversations](
	[DoctorId] [int] NULL,
	[PatientId] [int] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Conversation_Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_Conversations_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Department]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Doctor]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[DoctorService]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Feedback]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Feedback_res]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Img]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Medical_notebook]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Messages]    Script Date: 7/31/2024 12:34:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ConversationId] [int] NULL,
	[SenderId] [int] NULL,
	[ReceiverId] [int] NULL,
	[MessageText] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[SentAt] [datetime] NULL,
	[IsRead] [bit] NULL,
	[ConversationName] [nvarchar](max) NULL,
 CONSTRAINT [PK__Messages__3214EC0734CC3449] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Patient]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Question]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Receptionist]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Role]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Schedule]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Service]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [dbo].[Slot]    Script Date: 7/31/2024 12:34:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Slot](
	[slot_id] [int] IDENTITY(1,1) NOT NULL,
	[time] [varchar](max) NOT NULL,
 CONSTRAINT [PK_Slot] PRIMARY KEY CLUSTERED 
(
	[slot_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_result]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[AggregatedCounter]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Counter]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Hash]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Job]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[JobParameter]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[JobQueue]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[List]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Schema]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Server]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[Set]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Table [HangFire].[State]    Script Date: 7/31/2024 12:34:31 PM ******/
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
INSERT [dbo].[Account] ([acc_id], [phone], [email], [password], [role_id], [isActive]) VALUES (8, N'0985655223', N'vaicaloncaiten@gmail.com', N'demacia123', 3, 1)
SET IDENTITY_INSERT [dbo].[Account] OFF
GO
INSERT [dbo].[Admin] ([admin_id], [name], [gender], [dob], [isActive]) VALUES (1, N'Admin User', N'Male', CAST(N'1980-01-01' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[Appointment] ON 

INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id]) VALUES (2, 3, 2, CAST(N'2024-06-24' AS Date), 1, N'Scheduled', N'First visit', NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id]) VALUES (5, 3, 2, CAST(N'2024-09-24' AS Date), 1, N'Đã hủy', NULL, NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id]) VALUES (9, 3, 2, CAST(N'2024-07-30' AS Date), 1, N'Đang chờ phê duyệt', NULL, 1)
SET IDENTITY_INSERT [dbo].[Appointment] OFF
GO
INSERT [dbo].[Article_manager] ([a_id], [name], [gender], [dob], [isActive]) VALUES (4, N'Article Manager', N'Female', CAST(N'1985-08-25' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[Blog] ON 

INSERT [dbo].[Blog] ([blog_id], [content], [title], [doc_id], [date], [thumbnail], [a_id]) VALUES (2, N'Content of the blog', N'Blog Title', 2, CAST(N'2024-06-27' AS Date), N'thumbnail.jpg', 4)
SET IDENTITY_INSERT [dbo].[Blog] OFF
GO
SET IDENTITY_INSERT [dbo].[Conversations] ON 

INSERT [dbo].[Conversations] ([DoctorId], [PatientId], [CreatedAt], [Id], [Conversation_Name]) VALUES (1, 2, CAST(N'1992-12-12T00:00:00.000' AS DateTime), 1, N'haha')
INSERT [dbo].[Conversations] ([DoctorId], [PatientId], [CreatedAt], [Id], [Conversation_Name]) VALUES (2, 3, CAST(N'1992-11-11T00:00:00.000' AS DateTime), 2, N'haha')
INSERT [dbo].[Conversations] ([DoctorId], [PatientId], [CreatedAt], [Id], [Conversation_Name]) VALUES (0, 0, CAST(N'2024-07-29T09:43:36.117' AS DateTime), 5, N'string')
INSERT [dbo].[Conversations] ([DoctorId], [PatientId], [CreatedAt], [Id], [Conversation_Name]) VALUES (1, 1, CAST(N'2024-07-29T10:36:03.377' AS DateTime), 6, N'string')
INSERT [dbo].[Conversations] ([DoctorId], [PatientId], [CreatedAt], [Id], [Conversation_Name]) VALUES (2, 8, CAST(N'2024-07-29T13:47:40.087' AS DateTime), 9, N'Cuộc hội thoại giữa bệnh nhân string và bác sĩ Doctor User')
SET IDENTITY_INSERT [dbo].[Conversations] OFF
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
INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (4, 3, N'11111', CAST(N'2024-07-23' AS Date), 0)
INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (5, 3, N'gút', CAST(N'2024-07-23' AS Date), 4)
INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (6, 3, N'gút', CAST(N'2024-07-23' AS Date), 4)
SET IDENTITY_INSERT [dbo].[Feedback] OFF
GO
INSERT [dbo].[Feedback_res] ([res_id], [feed_id], [recep_id], [patient_id], [content], [date]) VALUES (1, 1, 5, 3, N'Thank you for your feedback!', CAST(N'2024-06-27' AS Date))
GO
SET IDENTITY_INSERT [dbo].[Medical_notebook] ON 

INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (2, N'Take 2 pills daily', N'Flu', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (3, N'dsad', N'dsadsa', 8, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (4, N'GIúp', N'giúp', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (5, N'312321', N'312321231', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (6, N'vaix loz', N'hehe', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (7, N'vaix loz', N'321321312', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (8, N'vaix loz', N'321321312', 3, 2, NULL)
INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [patient_id], [doctor_id], [date_create]) VALUES (9, N'26/7', N'an cut', 3, 2, NULL)
SET IDENTITY_INSERT [dbo].[Medical_notebook] OFF
GO
SET IDENTITY_INSERT [dbo].[Messages] ON 

INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (1, 1, 2, 3, N'Chào', N'xin chào', CAST(N'1992-12-12T00:00:00.000' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (2, 2, 3, 2, N'123123', NULL, CAST(N'1929-12-12T00:00:00.000' AS DateTime), 1, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (4, 1, 2, 3, N'hehe', NULL, CAST(N'2024-07-28T08:31:01.370' AS DateTime), 1, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (5, 1, 2, 3, N'chào', NULL, CAST(N'2024-07-28T08:31:10.457' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (6, 1, 3, 2, N'OK', NULL, CAST(N'2024-07-28T08:31:25.947' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (34, 2, 2, 3, N'VL', NULL, CAST(N'2024-07-28T00:00:00.000' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (35, 2, 3, 2, N'312321', NULL, CAST(N'2024-07-27T00:00:00.000' AS DateTime), 1, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (36, 2, 2, 3, N'312321321', NULL, CAST(N'2024-07-27T00:00:00.000' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (37, 2, 3, 2, N'31232131', NULL, CAST(N'2024-07-25T00:00:00.000' AS DateTime), 1, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (42, 2, 2, 3, N'haha', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722273977/sample_image123.jpg', CAST(N'2024-07-29T17:26:18.777' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (43, 2, 2, 3, N'haha', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722274042/sample_image123.jpg', CAST(N'2024-07-29T17:27:23.830' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (44, 2, 2, 3, N'hahaha', NULL, CAST(N'2024-07-29T17:31:22.127' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (45, 2, 2, 3, N'hahaha', NULL, CAST(N'2024-07-29T17:31:22.663' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (46, 2, 2, 3, N'haha', NULL, CAST(N'2024-07-29T17:31:29.407' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (47, 2, 2, 3, N'hehe', NULL, CAST(N'2024-07-29T17:31:32.123' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (48, 9, 2, 8, N'haha', NULL, CAST(N'2024-07-29T17:31:39.350' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (49, 2, 2, 3, N'haha', NULL, CAST(N'2024-07-30T00:34:33.093' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (50, 2, 2, 3, N'he', NULL, CAST(N'2024-07-30T00:34:35.287' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (51, 9, 2, 8, N'yu', NULL, CAST(N'2024-07-30T00:35:39.917' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (52, 2, 2, 3, N'haha', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722274551/sample_image123.jpg', CAST(N'2024-07-30T00:35:50.200' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (53, 2, 2, 3, N'dadsa', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722274551/sample_image123.jpg', CAST(N'2024-07-30T00:41:20.803' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (54, 2, 2, 3, N'he', NULL, CAST(N'2024-07-30T00:41:29.873' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (55, 2, 2, 3, N'har', NULL, CAST(N'2024-07-30T00:41:49.950' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (56, 2, 3, 3, N'he', NULL, CAST(N'2024-07-30T12:18:01.787' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (57, 2, 3, 3, N'hả', NULL, CAST(N'2024-07-30T12:21:07.527' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (58, 2, 3, 2, N'vả', NULL, CAST(N'2024-07-30T12:35:20.627' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (59, 2, 3, 2, N'de', NULL, CAST(N'2024-07-30T12:42:19.270' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (60, 2, 3, 2, N've', NULL, CAST(N'2024-07-30T12:45:45.170' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (61, 2, 3, 2, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722318356/sample_image123.jpg', CAST(N'2024-07-30T12:45:49.167' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (62, 2, 3, 2, N'', NULL, CAST(N'2024-07-30T12:45:56.840' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (63, 2, 3, 2, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722318356/sample_image123.jpg', CAST(N'2024-07-30T12:45:53.210' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (64, 2, 3, 2, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722318356/sample_image123.jpg', CAST(N'2024-07-30T12:45:56.650' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (65, 2, 3, 2, N'', NULL, CAST(N'2024-07-30T12:46:12.957' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (66, 2, 2, 3, N'hehe', NULL, CAST(N'2024-07-30T12:59:02.623' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (67, 2, 2, 3, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722320634/772f5865-f524-4278-86df-89bac198fce2.jpg', CAST(N'2024-07-30T13:23:50.343' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (68, 9, 2, 8, N'hehe', NULL, CAST(N'2024-07-30T13:37:26.237' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (69, 9, 2, 0, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722347278/c14f3b15-0a0d-44be-9ad6-1f31e4a10b9a.jpg', CAST(N'2024-07-30T20:47:56.630' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (70, 9, 2, 0, N'', N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1722347279/c5429076-52fe-48ef-9d21-01a25d9e6545.jpg', CAST(N'2024-07-30T20:48:00.707' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (71, 2, 3, 2, N'haha', NULL, CAST(N'2024-07-30T21:43:05.617' AS DateTime), 0, NULL)
INSERT [dbo].[Messages] ([Id], [ConversationId], [SenderId], [ReceiverId], [MessageText], [ImageUrl], [SentAt], [IsRead], [ConversationName]) VALUES (72, 2, 2, 0, N'he', NULL, CAST(N'2024-07-30T21:52:59.777' AS DateTime), 0, NULL)
SET IDENTITY_INSERT [dbo].[Messages] OFF
GO
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive], [check]) VALUES (3, N'Patient User', N'Male', N'123 Street', CAST(N'1990-05-15' AS Date), 1, NULL)
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive], [check]) VALUES (8, N'string', N'male', N'hani', CAST(N'2024-07-10' AS Date), 0, 1)
GO
SET IDENTITY_INSERT [dbo].[Question] ON 

INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (2, 3, N'What are the symptoms of flu?', CAST(N'2024-06-25' AS Date), 1, 2, CAST(N'2024-06-26' AS Date), N'Common symptoms are...')
INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (3, 3, N'cai gi day', CAST(N'2024-07-23' AS Date), 1, 2, CAST(N'2024-07-23' AS Date), N'khong biet nua')
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
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (4, 2, 1, 1, N'Friday', CAST(N'2024-07-26' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (5, 2, 1, 1, N'Saturday', CAST(N'2024-07-27' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (6, 2, 1, 1, N'Sunday', CAST(N'2024-07-28' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (7, 2, 1, 0, N'Monday', CAST(N'2024-07-29' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (8, 2, 1, 0, N'Tuesday', CAST(N'2024-07-30' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (9, 2, 1, 0, N'Wednesday', CAST(N'2024-07-31' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (10, 2, 1, 0, N'Thursday', CAST(N'2024-08-01' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (11, 2, 1, 0, N'Friday', CAST(N'2024-08-02' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (12, 2, 0, 0, N'Wednesday', CAST(N'2024-07-24' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (13, 2, 0, 0, N'Thursday', CAST(N'2024-07-25' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (14, 7, 0, 0, N'Wednesday', CAST(N'2024-07-24' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (15, 7, 0, 0, N'Thursday', CAST(N'2024-07-25' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (16, 7, 1, 0, N'Friday', CAST(N'2024-07-26' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (17, 7, 0, 0, N'Saturday', CAST(N'2024-07-27' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (18, 7, 0, 0, N'Sunday', CAST(N'2024-07-28' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (20, 7, 0, 0, N'Tuesday', CAST(N'2024-07-30' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (21, 7, 0, 0, N'Wednesday', CAST(N'2024-07-31' AS Date), 0)
INSERT [dbo].[Schedule] ([id], [doctor_id], [morning], [afternoon], [weekdays], [date], [appointments]) VALUES (22, 7, 0, 0, N'Thursday', CAST(N'2024-08-01' AS Date), 0)
SET IDENTITY_INSERT [dbo].[Schedule] OFF
GO
SET IDENTITY_INSERT [dbo].[Service] ON 

INSERT [dbo].[Service] ([service_id], [name], [dep_id], [price], [isActive]) VALUES (1, N'Heart Checkup', 1, 1000.0000, 1)
INSERT [dbo].[Service] ([service_id], [name], [dep_id], [price], [isActive]) VALUES (2, N'Brain MRI', 2, 2000.0000, 1)
SET IDENTITY_INSERT [dbo].[Service] OFF
GO
SET IDENTITY_INSERT [dbo].[Slot] ON 

INSERT [dbo].[Slot] ([slot_id], [time]) VALUES (1, N'09:00-10:00')
INSERT [dbo].[Slot] ([slot_id], [time]) VALUES (2, N'10:00-11:00')
SET IDENTITY_INSERT [dbo].[Slot] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_result] ON 

INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (1, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721675135/sample_image.jpg', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (2, N'https://cdn.thoitiet247.edu.vn/wp-content/uploads/2024/04/nhung-hinh-anh-girl-xinh-de-thuong.webp', 3)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (3, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921491/sample_image.jpg', 4)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (4, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921491/sample_image.jpg', 4)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (5, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921613/sample_image.jpg', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (6, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921662/sample_image.jpg', 5)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (7, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921717/sample_image.jpg', 5)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (8, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921717/sample_image.jpg', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (9, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921806/sample_image.webp', 2)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (10, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921907/sample_image.png', 4)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (11, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921907/sample_image.png', 4)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (12, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921982/sample_image.jpg', 5)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (13, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721921990/sample_image.webp', 5)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (14, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721924081/sample_image.png', 8)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (15, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721924088/sample_image.jpg', 7)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (16, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721965622/sample_image.jpg', 9)
INSERT [dbo].[Test_result] ([img_id], [img_url], [m_id]) VALUES (17, N'http://res.cloudinary.com/dt4ubkcp8/image/upload/v1721966764/sample_image.webp', 9)
SET IDENTITY_INSERT [dbo].[Test_result] OFF
GO
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:failed:2024-07-28', 2, CAST(N'2024-08-28T13:33:44.390' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:failed:2024-07-30', 1, CAST(N'2024-08-30T13:39:57.320' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:failed:2024-07-30-13', 1, CAST(N'2024-07-31T13:39:57.320' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded', 3, NULL)
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded:2024-07-24', 1, CAST(N'2024-08-24T04:57:24.330' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded:2024-07-25', 1, CAST(N'2024-08-25T15:30:43.950' AS DateTime))
INSERT [HangFire].[AggregatedCounter] ([Key], [Value], [ExpireAt]) VALUES (N'stats:succeeded:2024-07-26', 1, CAST(N'2024-08-26T03:43:54.850' AS DateTime))
GO
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'CreatedAt', N'2024-07-23T07:21:45.1785524Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Cron', N'0 23 * * *', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Job', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointmentsAsync","ParameterTypes":"[]","Arguments":"[]"}', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'LastExecution', N'2024-07-30T02:35:28.8237790Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'LastJobId', N'6', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'NextExecution', N'2024-07-30T23:00:00.0000000Z', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'Queue', N'default', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'TimeZoneId', N'UTC', NULL)
INSERT [HangFire].[Hash] ([Key], [Field], [Value], [ExpireAt]) VALUES (N'recurring-job:send-reminders', N'V', N'2', NULL)
GO
SET IDENTITY_INSERT [HangFire].[Job] ON 

INSERT [HangFire].[Job] ([Id], [StateId], [StateName], [InvocationData], [Arguments], [CreatedAt], [ExpireAt]) VALUES (4, 52, N'Failed', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointmentsAsync","ParameterTypes":"[]","Arguments":null}', N'[]', CAST(N'2024-07-27T09:33:39.300' AS DateTime), NULL)
INSERT [HangFire].[Job] ([Id], [StateId], [StateName], [InvocationData], [Arguments], [CreatedAt], [ExpireAt]) VALUES (5, 95, N'Failed', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointmentsAsync","ParameterTypes":"[]","Arguments":null}', N'[]', CAST(N'2024-07-28T09:00:02.480' AS DateTime), NULL)
INSERT [HangFire].[Job] ([Id], [StateId], [StateName], [InvocationData], [Arguments], [CreatedAt], [ExpireAt]) VALUES (6, 138, N'Failed', N'{"Type":"BE.Service.ImplService.ReminderService, BE, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"CheckAppointmentsAsync","ParameterTypes":"[]","Arguments":null}', N'[]', CAST(N'2024-07-30T02:35:28.900' AS DateTime), NULL)
SET IDENTITY_INSERT [HangFire].[Job] OFF
GO
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (4, N'CurrentCulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (4, N'CurrentUICulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (4, N'RecurringJobId', N'"send-reminders"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (4, N'RetryCount', N'10')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (4, N'Time', N'1722072819')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (5, N'CurrentCulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (5, N'CurrentUICulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (5, N'RecurringJobId', N'"send-reminders"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (5, N'RetryCount', N'10')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (5, N'Time', N'1722157202')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (6, N'CurrentCulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (6, N'CurrentUICulture', N'"en-US"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (6, N'RecurringJobId', N'"send-reminders"')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (6, N'RetryCount', N'10')
INSERT [HangFire].[JobParameter] ([JobId], [Name], [Value]) VALUES (6, N'Time', N'1722306928')
GO
INSERT [HangFire].[Schema] ([Version]) VALUES (9)
GO
INSERT [HangFire].[Server] ([Id], [Data], [LastHeartbeat]) VALUES (N'pc:156768:4f9874d5-3f5c-4387-a9fb-64fc071818d9', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2024-07-30T18:00:57.1740363Z"}', CAST(N'2024-07-30T20:31:31.200' AS DateTime))
INSERT [HangFire].[Server] ([Id], [Data], [LastHeartbeat]) VALUES (N'pc:156768:e3b3fb6b-5152-4321-98d8-4073cf5fe753', N'{"WorkerCount":20,"Queues":["default"],"StartedAt":"2024-07-30T18:00:56.220677Z"}', CAST(N'2024-07-30T20:31:30.087' AS DateTime))
GO
INSERT [HangFire].[Set] ([Key], [Score], [Value], [ExpireAt]) VALUES (N'recurring-jobs', 1722380400, N'send-reminders', NULL)
GO
SET IDENTITY_INSERT [HangFire].[State] ON 

INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (10, 4, N'Enqueued', N'Triggered by recurring job scheduler', CAST(N'2024-07-27T09:33:39.327' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:33:39.3178353Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (11, 4, N'Processing', NULL, CAST(N'2024-07-27T09:33:39.537' AS DateTime), N'{"StartedAt":"2024-07-27T09:33:39.3670781Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"29ff36af-e573-4291-80d1-926268ad53d9"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (12, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:33:42.123' AS DateTime), N'{"FailedAt":"2024-07-27T09:33:42.0776361Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:ec4e15fe-5570-4833-a7f1-908a96ea4814\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (13, 4, N'Scheduled', N'Retry attempt 1 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:33:42.123' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:34:10.0923852Z","ScheduledAt":"2024-07-27T09:33:42.0923858Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (14, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:34:24.127' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:34:24.1199210Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (15, 4, N'Processing', NULL, CAST(N'2024-07-27T09:34:24.143' AS DateTime), N'{"StartedAt":"2024-07-27T09:34:24.1410136Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"ce5a9b6c-a84b-4f76-b04a-2ce9f843450d"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (16, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:34:24.300' AS DateTime), N'{"FailedAt":"2024-07-27T09:34:24.2711427Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:ec4e15fe-5570-4833-a7f1-908a96ea4814\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (17, 4, N'Scheduled', N'Retry attempt 2 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:34:24.300' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:35:10.2893383Z","ScheduledAt":"2024-07-27T09:34:24.2893387Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (18, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:35:24.253' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:35:24.2134939Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (19, 4, N'Processing', NULL, CAST(N'2024-07-27T09:35:24.333' AS DateTime), N'{"StartedAt":"2024-07-27T09:35:24.3275923Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"bfa8adc1-9291-4604-a0b4-921c78341812"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (20, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:35:24.873' AS DateTime), N'{"FailedAt":"2024-07-27T09:35:24.8089824Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:ec4e15fe-5570-4833-a7f1-908a96ea4814\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (21, 4, N'Scheduled', N'Retry attempt 3 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:35:24.877' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:36:19.8385766Z","ScheduledAt":"2024-07-27T09:35:24.8385783Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (22, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:36:24.393' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:36:24.3911868Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (23, 4, N'Processing', NULL, CAST(N'2024-07-27T09:36:24.413' AS DateTime), N'{"StartedAt":"2024-07-27T09:36:24.4129767Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"78477ee8-893e-4459-a2c8-1de8e4a63cb5"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (24, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:36:24.480' AS DateTime), N'{"FailedAt":"2024-07-27T09:36:24.4675418Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:ec4e15fe-5570-4833-a7f1-908a96ea4814\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (25, 4, N'Scheduled', N'Retry attempt 4 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:36:24.483' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:38:52.4734170Z","ScheduledAt":"2024-07-27T09:36:24.4734173Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (26, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:38:55.060' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:38:55.0513290Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (27, 4, N'Processing', NULL, CAST(N'2024-07-27T09:38:55.103' AS DateTime), N'{"StartedAt":"2024-07-27T09:38:55.0982315Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"ff3751b1-e0b8-4956-a623-0780a91a963b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (28, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:38:55.267' AS DateTime), N'{"FailedAt":"2024-07-27T09:38:55.2266422Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:8f912c66-dd9d-445a-814e-15f3b9f73881\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (29, 4, N'Scheduled', N'Retry attempt 5 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:38:55.267' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:43:56.2440102Z","ScheduledAt":"2024-07-27T09:38:55.2440105Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (30, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:44:10.367' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:44:10.3516862Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (31, 4, N'Processing', NULL, CAST(N'2024-07-27T09:44:10.393' AS DateTime), N'{"StartedAt":"2024-07-27T09:44:10.3914336Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"9e7bcfec-776f-4c96-9126-d8f2320b3245"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (32, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:44:10.613' AS DateTime), N'{"FailedAt":"2024-07-27T09:44:10.5764586Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:8f912c66-dd9d-445a-814e-15f3b9f73881\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (33, 4, N'Scheduled', N'Retry attempt 6 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:44:10.613' AS DateTime), N'{"EnqueueAt":"2024-07-27T09:57:44.5886288Z","ScheduledAt":"2024-07-27T09:44:10.5886304Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (34, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T09:57:56.123' AS DateTime), N'{"EnqueuedAt":"2024-07-27T09:57:56.1006456Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (35, 4, N'Processing', NULL, CAST(N'2024-07-27T09:57:56.180' AS DateTime), N'{"StartedAt":"2024-07-27T09:57:56.1788385Z","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8","WorkerId":"d2656c6c-cefa-48f1-bbbe-7c56ae25366e"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (36, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T09:57:56.387' AS DateTime), N'{"FailedAt":"2024-07-27T09:57:56.3485455Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:765e9c81-50f9-4e85-acd8-176d21cac3bd\r\nError Number:207,State:1,Class:16","ServerId":"pc:259128:b23a0faa-6123-4a0c-b66b-7634f766efc8"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (37, 4, N'Scheduled', N'Retry attempt 7 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T09:57:56.387' AS DateTime), N'{"EnqueueAt":"2024-07-27T10:22:07.3609536Z","ScheduledAt":"2024-07-27T09:57:56.3609569Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (38, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T13:47:04.650' AS DateTime), N'{"EnqueuedAt":"2024-07-27T13:47:04.4980466Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (39, 4, N'Processing', NULL, CAST(N'2024-07-27T13:47:04.840' AS DateTime), N'{"StartedAt":"2024-07-27T13:47:04.8306120Z","ServerId":"pc:273660:e542929d-cd61-4fd6-a49a-e9ebeea75e8a","WorkerId":"13dab2f5-60cd-4407-b65d-4c017e68bfba"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (40, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T13:47:06.870' AS DateTime), N'{"FailedAt":"2024-07-27T13:47:06.8175491Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:e4052445-3c30-4562-87e3-fbef7424f2fd\r\nError Number:207,State:1,Class:16","ServerId":"pc:273660:e542929d-cd61-4fd6-a49a-e9ebeea75e8a"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (41, 4, N'Scheduled', N'Retry attempt 8 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T13:47:06.873' AS DateTime), N'{"EnqueueAt":"2024-07-27T14:27:54.8434623Z","ScheduledAt":"2024-07-27T13:47:06.8434627Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (42, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T21:58:44.850' AS DateTime), N'{"EnqueuedAt":"2024-07-27T21:58:44.7076008Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (43, 4, N'Processing', NULL, CAST(N'2024-07-27T21:58:45.033' AS DateTime), N'{"StartedAt":"2024-07-27T21:58:45.0234136Z","ServerId":"pc:274792:0133783d-f843-4238-9c0d-d146fc3a5ee7","WorkerId":"63beb020-956d-4144-b3dd-4bea8cd36095"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (44, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T21:58:46.927' AS DateTime), N'{"FailedAt":"2024-07-27T21:58:46.8813207Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6881c31e-93f9-4cb0-b899-6369e54f14c2\r\nError Number:207,State:1,Class:16","ServerId":"pc:274792:0133783d-f843-4238-9c0d-d146fc3a5ee7"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (45, 4, N'Scheduled', N'Retry attempt 9 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T21:58:46.930' AS DateTime), N'{"EnqueueAt":"2024-07-27T23:07:44.9020373Z","ScheduledAt":"2024-07-27T21:58:46.9020375Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (46, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-27T23:07:44.293' AS DateTime), N'{"EnqueuedAt":"2024-07-27T23:07:44.0768226Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (47, 4, N'Processing', NULL, CAST(N'2024-07-27T23:07:44.473' AS DateTime), N'{"StartedAt":"2024-07-27T23:07:44.4689980Z","ServerId":"pc:38864:3a37791d-e782-44d9-9ea3-0d0a71ef4ae9","WorkerId":"040ff7e7-90d4-4441-b841-1c1aed1f759a"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (48, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-27T23:07:44.953' AS DateTime), N'{"FailedAt":"2024-07-27T23:07:44.8987184Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:c674504e-214d-4196-9fa2-9e062b0e4bff\r\nError Number:207,State:1,Class:16","ServerId":"pc:38864:3a37791d-e782-44d9-9ea3-0d0a71ef4ae9"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (49, 4, N'Scheduled', N'Retry attempt 10 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-27T23:07:44.957' AS DateTime), N'{"EnqueueAt":"2024-07-28T01:01:20.9197497Z","ScheduledAt":"2024-07-27T23:07:44.9197498Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (50, 4, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T01:01:32.383' AS DateTime), N'{"EnqueuedAt":"2024-07-28T01:01:32.1619599Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (51, 4, N'Processing', NULL, CAST(N'2024-07-28T01:01:32.490' AS DateTime), N'{"StartedAt":"2024-07-28T01:01:32.4872248Z","ServerId":"pc:42960:416d65d0-db6f-46d6-9a41-ad9f872aa83a","WorkerId":"81c75649-8688-4897-91e3-d91788c19f26"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (52, 4, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T01:01:32.747' AS DateTime), N'{"FailedAt":"2024-07-28T01:01:32.7082085Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:99900206-6342-4b23-92cf-c26eee2a4306\r\nError Number:207,State:1,Class:16","ServerId":"pc:42960:416d65d0-db6f-46d6-9a41-ad9f872aa83a"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (53, 5, N'Enqueued', N'Triggered by recurring job scheduler', CAST(N'2024-07-28T09:00:02.527' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:00:02.5131437Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (54, 5, N'Processing', NULL, CAST(N'2024-07-28T09:00:02.900' AS DateTime), N'{"StartedAt":"2024-07-28T09:00:02.7593675Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"937e61cb-c5c8-4bc3-9927-73ab4313b513"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (55, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:00:03.710' AS DateTime), N'{"FailedAt":"2024-07-28T09:00:03.4795524Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:80cb4928-af21-4a6a-874d-ca5e5f14d561\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (56, 5, N'Scheduled', N'Retry attempt 1 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:00:03.713' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:00:41.4910842Z","ScheduledAt":"2024-07-28T09:00:03.4910845Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (57, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:00:47.357' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:00:47.3450077Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (58, 5, N'Processing', NULL, CAST(N'2024-07-28T09:00:47.373' AS DateTime), N'{"StartedAt":"2024-07-28T09:00:47.3714916Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"78a85b6e-5939-406d-bafd-12f6a474f430"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (59, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:00:47.467' AS DateTime), N'{"FailedAt":"2024-07-28T09:00:47.4400668Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6dc9eeb9-6840-4eef-9591-56fe1db509ca\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (60, 5, N'Scheduled', N'Retry attempt 2 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:00:47.467' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:01:03.4570844Z","ScheduledAt":"2024-07-28T09:00:47.4570848Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (61, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:01:17.400' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:01:17.3979525Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (62, 5, N'Processing', NULL, CAST(N'2024-07-28T09:01:17.417' AS DateTime), N'{"StartedAt":"2024-07-28T09:01:17.4154558Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"67539a8c-ad38-4e3d-82fe-09ea10fe2e43"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (63, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:01:17.480' AS DateTime), N'{"FailedAt":"2024-07-28T09:01:17.4694395Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:d61a4b3f-e23c-4a8e-b6e4-d2067b85e33d\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (64, 5, N'Scheduled', N'Retry attempt 3 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:01:17.480' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:02:09.4734491Z","ScheduledAt":"2024-07-28T09:01:17.4734494Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (65, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:02:17.443' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:02:17.4418168Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (66, 5, N'Processing', NULL, CAST(N'2024-07-28T09:02:17.457' AS DateTime), N'{"StartedAt":"2024-07-28T09:02:17.4576933Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"55041392-70c2-4065-b258-64d18a2d89e5"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (67, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:02:17.527' AS DateTime), N'{"FailedAt":"2024-07-28T09:02:17.5145602Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:d61a4b3f-e23c-4a8e-b6e4-d2067b85e33d\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (68, 5, N'Scheduled', N'Retry attempt 4 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:02:17.527' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:05:05.5184302Z","ScheduledAt":"2024-07-28T09:02:17.5184304Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (69, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:05:17.570' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:05:17.5636295Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (70, 5, N'Processing', NULL, CAST(N'2024-07-28T09:05:17.583' AS DateTime), N'{"StartedAt":"2024-07-28T09:05:17.5812611Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"ded997c9-fab1-4f6b-9eed-8bcc71cf5b7e"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (71, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:05:17.643' AS DateTime), N'{"FailedAt":"2024-07-28T09:05:17.6339043Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:80cb4928-af21-4a6a-874d-ca5e5f14d561\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (72, 5, N'Scheduled', N'Retry attempt 5 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:05:17.647' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:11:28.6378375Z","ScheduledAt":"2024-07-28T09:05:17.6378380Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (73, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:11:32.823' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:11:32.8199279Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (74, 5, N'Processing', NULL, CAST(N'2024-07-28T09:11:32.837' AS DateTime), N'{"StartedAt":"2024-07-28T09:11:32.8354949Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"bd2d7311-38db-41f8-9bfa-d38e9c054f95"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (75, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:11:32.950' AS DateTime), N'{"FailedAt":"2024-07-28T09:11:32.9343404Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:97b55246-027a-4646-96a7-039728c63300\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (76, 5, N'Scheduled', N'Retry attempt 6 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:11:32.950' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:23:24.9397954Z","ScheduledAt":"2024-07-28T09:11:32.9397958Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (77, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:23:33.360' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:23:33.3520274Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (78, 5, N'Processing', NULL, CAST(N'2024-07-28T09:23:33.380' AS DateTime), N'{"StartedAt":"2024-07-28T09:23:33.3767866Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"0088c7e5-7bb5-4dff-aa99-82614137038a"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (79, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:23:33.490' AS DateTime), N'{"FailedAt":"2024-07-28T09:23:33.4720250Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:d61a4b3f-e23c-4a8e-b6e4-d2067b85e33d\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (80, 5, N'Scheduled', N'Retry attempt 7 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:23:33.490' AS DateTime), N'{"EnqueueAt":"2024-07-28T09:45:45.4814387Z","ScheduledAt":"2024-07-28T09:23:33.4814392Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (81, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T09:45:49.337' AS DateTime), N'{"EnqueuedAt":"2024-07-28T09:45:49.3334808Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (82, 5, N'Processing', NULL, CAST(N'2024-07-28T09:45:49.350' AS DateTime), N'{"StartedAt":"2024-07-28T09:45:49.3483236Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"8f9d23a6-aac5-4bdd-9f5f-0cfcd89d628c"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (83, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T09:45:49.417' AS DateTime), N'{"FailedAt":"2024-07-28T09:45:49.4055684Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6dc9eeb9-6840-4eef-9591-56fe1db509ca\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (84, 5, N'Scheduled', N'Retry attempt 8 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T09:45:49.417' AS DateTime), N'{"EnqueueAt":"2024-07-28T10:26:21.4106495Z","ScheduledAt":"2024-07-28T09:45:49.4106499Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (85, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T10:26:35.960' AS DateTime), N'{"EnqueuedAt":"2024-07-28T10:26:35.9559737Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (86, 5, N'Processing', NULL, CAST(N'2024-07-28T10:26:35.977' AS DateTime), N'{"StartedAt":"2024-07-28T10:26:35.9751165Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"848e05ac-5b9c-4bbc-a88e-cc379c964c31"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (87, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T10:26:36.077' AS DateTime), N'{"FailedAt":"2024-07-28T10:26:36.0642977Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6dc9eeb9-6840-4eef-9591-56fe1db509ca\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (88, 5, N'Scheduled', N'Retry attempt 9 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T10:26:36.077' AS DateTime), N'{"EnqueueAt":"2024-07-28T11:39:10.0682849Z","ScheduledAt":"2024-07-28T10:26:36.0682854Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (89, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T11:39:23.953' AS DateTime), N'{"EnqueuedAt":"2024-07-28T11:39:23.9454687Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (90, 5, N'Processing', NULL, CAST(N'2024-07-28T11:39:23.967' AS DateTime), N'{"StartedAt":"2024-07-28T11:39:23.9671368Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"68cde8fa-a15b-4529-a6b9-f57da8a5e0b2"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (91, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T11:39:24.100' AS DateTime), N'{"FailedAt":"2024-07-28T11:39:24.0763100Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:983a60e4-fa25-4c3c-8ebe-c6ba2087f82f\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (92, 5, N'Scheduled', N'Retry attempt 10 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-28T11:39:24.100' AS DateTime), N'{"EnqueueAt":"2024-07-28T13:33:40.0800215Z","ScheduledAt":"2024-07-28T11:39:24.0800219Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (93, 5, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-28T13:33:44.153' AS DateTime), N'{"EnqueuedAt":"2024-07-28T13:33:44.1405472Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (94, 5, N'Processing', NULL, CAST(N'2024-07-28T13:33:44.183' AS DateTime), N'{"StartedAt":"2024-07-28T13:33:44.1819813Z","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b","WorkerId":"54f63202-8b56-4ec2-b927-a616abc51c3b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (95, 5, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-28T13:33:44.390' AS DateTime), N'{"FailedAt":"2024-07-28T13:33:44.3288225Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:b0970f9d-77ca-474d-b2b7-2968dad13e14\r\nError Number:207,State:1,Class:16","ServerId":"pc:50984:5ae2adb6-10b3-4232-9837-52d52ec5767b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (96, 6, N'Enqueued', N'Triggered by recurring job scheduler', CAST(N'2024-07-30T02:35:28.927' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:35:28.9129552Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (97, 6, N'Processing', NULL, CAST(N'2024-07-30T02:35:29.310' AS DateTime), N'{"StartedAt":"2024-07-30T02:35:29.0984161Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"9d974489-73f0-470b-945e-dcfd88174283"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (98, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:35:31.130' AS DateTime), N'{"FailedAt":"2024-07-30T02:35:31.0956975Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6825d72e-89d6-4c4d-af9a-bc9cbe0e27b5\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (99, 6, N'Scheduled', N'Retry attempt 1 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:35:31.133' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:35:46.1077733Z","ScheduledAt":"2024-07-30T02:35:31.1077736Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (100, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:35:58.860' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:35:58.8561350Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (101, 6, N'Processing', NULL, CAST(N'2024-07-30T02:35:58.873' AS DateTime), N'{"StartedAt":"2024-07-30T02:35:58.8719399Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"afeb804e-0741-47a5-a26f-48486f4fae8b"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (102, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:35:58.937' AS DateTime), N'{"FailedAt":"2024-07-30T02:35:58.9216724Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:f99c6d8a-a096-4be0-8c4f-ea62decc71ed\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (103, 6, N'Scheduled', N'Retry attempt 2 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:35:58.937' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:36:40.9308288Z","ScheduledAt":"2024-07-30T02:35:58.9308291Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (104, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:36:43.930' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:36:43.9251084Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (105, 6, N'Processing', NULL, CAST(N'2024-07-30T02:36:43.943' AS DateTime), N'{"StartedAt":"2024-07-30T02:36:43.9402264Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"9346b681-fdb3-4a78-b539-5dc3a4068c57"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (106, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:36:44.033' AS DateTime), N'{"FailedAt":"2024-07-30T02:36:44.0225261Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:f99c6d8a-a096-4be0-8c4f-ea62decc71ed\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (107, 6, N'Scheduled', N'Retry attempt 3 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:36:44.033' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:37:18.0294745Z","ScheduledAt":"2024-07-30T02:36:44.0294747Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (108, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:37:28.987' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:37:28.9824417Z","Queue":"default"}')
GO
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (109, 6, N'Processing', NULL, CAST(N'2024-07-30T02:37:29.003' AS DateTime), N'{"StartedAt":"2024-07-30T02:37:29.0021108Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"27c206d3-e702-42d7-99ac-be31088ad4d5"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (110, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:37:29.067' AS DateTime), N'{"FailedAt":"2024-07-30T02:37:29.0512804Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:6825d72e-89d6-4c4d-af9a-bc9cbe0e27b5\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (111, 6, N'Scheduled', N'Retry attempt 4 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:37:29.067' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:40:33.0605764Z","ScheduledAt":"2024-07-30T02:37:29.0605768Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (112, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:40:44.180' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:40:44.1782606Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (113, 6, N'Processing', NULL, CAST(N'2024-07-30T02:40:44.193' AS DateTime), N'{"StartedAt":"2024-07-30T02:40:44.1923647Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"226c4ef6-5195-41cc-b118-8e49da1767bb"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (114, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:40:44.253' AS DateTime), N'{"FailedAt":"2024-07-30T02:40:44.2432373Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:a8c0dc4e-b730-4e6f-936f-8eaec3fcc028\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (115, 6, N'Scheduled', N'Retry attempt 5 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:40:44.253' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:47:20.2470447Z","ScheduledAt":"2024-07-30T02:40:44.2470450Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (116, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:47:29.527' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:47:29.5257021Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (117, 6, N'Processing', NULL, CAST(N'2024-07-30T02:47:29.537' AS DateTime), N'{"StartedAt":"2024-07-30T02:47:29.5375952Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"cfb84abc-9e75-484f-a237-63aa27c100dc"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (118, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:47:29.590' AS DateTime), N'{"FailedAt":"2024-07-30T02:47:29.5798159Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:517d9608-a7af-4cc2-ac62-90913700ed8e\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (119, 6, N'Scheduled', N'Retry attempt 6 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:47:29.590' AS DateTime), N'{"EnqueueAt":"2024-07-30T02:58:21.5847785Z","ScheduledAt":"2024-07-30T02:47:29.5847787Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (120, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T02:58:29.980' AS DateTime), N'{"EnqueuedAt":"2024-07-30T02:58:29.9770794Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (121, 6, N'Processing', NULL, CAST(N'2024-07-30T02:58:29.990' AS DateTime), N'{"StartedAt":"2024-07-30T02:58:29.9898408Z","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3","WorkerId":"e8092387-f46e-4db3-8b31-0112a45eeae4"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (122, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T02:58:30.043' AS DateTime), N'{"FailedAt":"2024-07-30T02:58:30.0328554Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:84828295-3b42-4f4f-892b-59a8ac874e55\r\nError Number:207,State:1,Class:16","ServerId":"pc:92212:87897bcf-dd93-4643-b193-ca075821e6b3"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (123, 6, N'Scheduled', N'Retry attempt 7 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T02:58:30.043' AS DateTime), N'{"EnqueueAt":"2024-07-30T03:23:02.0367744Z","ScheduledAt":"2024-07-30T02:58:30.0367747Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (124, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T03:23:03.620' AS DateTime), N'{"EnqueuedAt":"2024-07-30T03:23:03.4050264Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (125, 6, N'Processing', NULL, CAST(N'2024-07-30T03:23:03.723' AS DateTime), N'{"StartedAt":"2024-07-30T03:23:03.7214569Z","ServerId":"pc:94016:41d42749-cc4c-4cab-8656-411c17b6cf1e","WorkerId":"39266f15-b13f-44fe-9b91-15d08c87738a"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (126, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T03:23:04.073' AS DateTime), N'{"FailedAt":"2024-07-30T03:23:04.0137580Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:d89b00cc-35a6-4978-9100-2e95961763a9\r\nError Number:207,State:1,Class:16","ServerId":"pc:94016:41d42749-cc4c-4cab-8656-411c17b6cf1e"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (127, 6, N'Scheduled', N'Retry attempt 8 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T03:23:04.080' AS DateTime), N'{"EnqueueAt":"2024-07-30T04:05:36.0380286Z","ScheduledAt":"2024-07-30T03:23:04.0380290Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (128, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T04:05:50.290' AS DateTime), N'{"EnqueuedAt":"2024-07-30T04:05:50.2851439Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (129, 6, N'Processing', NULL, CAST(N'2024-07-30T04:05:50.307' AS DateTime), N'{"StartedAt":"2024-07-30T04:05:50.3055965Z","ServerId":"pc:94016:41d42749-cc4c-4cab-8656-411c17b6cf1e","WorkerId":"94eb27fe-a836-41d9-ac93-5f7ad13038df"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (130, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T04:05:50.373' AS DateTime), N'{"FailedAt":"2024-07-30T04:05:50.3623945Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:9778c1e9-9deb-48c8-be5f-cbfd0e99acbb\r\nError Number:207,State:1,Class:16","ServerId":"pc:94016:41d42749-cc4c-4cab-8656-411c17b6cf1e"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (131, 6, N'Scheduled', N'Retry attempt 9 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T04:05:50.377' AS DateTime), N'{"EnqueueAt":"2024-07-30T05:17:21.3672270Z","ScheduledAt":"2024-07-30T04:05:50.3672272Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (132, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T05:17:22.073' AS DateTime), N'{"EnqueuedAt":"2024-07-30T05:17:21.7856988Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (133, 6, N'Processing', NULL, CAST(N'2024-07-30T05:17:22.297' AS DateTime), N'{"StartedAt":"2024-07-30T05:17:22.2922244Z","ServerId":"pc:132072:fc1a31cc-b3b8-4730-8cca-3b99387a0a05","WorkerId":"68d38676-8beb-43a8-b6fd-be439d686821"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (134, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T05:17:22.637' AS DateTime), N'{"FailedAt":"2024-07-30T05:17:22.5732181Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:57ef53ab-41bb-4922-a057-23263d573427\r\nError Number:207,State:1,Class:16","ServerId":"pc:132072:fc1a31cc-b3b8-4730-8cca-3b99387a0a05"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (135, 6, N'Scheduled', N'Retry attempt 10 of 10: Invalid column name ''schedule_id''.', CAST(N'2024-07-30T05:17:22.643' AS DateTime), N'{"EnqueueAt":"2024-07-30T07:08:08.5992777Z","ScheduledAt":"2024-07-30T05:17:22.5992778Z"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (136, 6, N'Enqueued', N'Triggered by DelayedJobScheduler', CAST(N'2024-07-30T13:39:55.053' AS DateTime), N'{"EnqueuedAt":"2024-07-30T13:39:54.8794653Z","Queue":"default"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (137, 6, N'Processing', NULL, CAST(N'2024-07-30T13:39:55.220' AS DateTime), N'{"StartedAt":"2024-07-30T13:39:55.2170054Z","ServerId":"pc:142136:98939713-4520-4c82-838a-5a1d9f435d31","WorkerId":"e7a84e7d-c875-498e-aa62-32b8df7e7be5"}')
INSERT [HangFire].[State] ([Id], [JobId], [Name], [Reason], [CreatedAt], [Data]) VALUES (138, 6, N'Failed', N'An exception occurred during performance of the job.', CAST(N'2024-07-30T13:39:57.320' AS DateTime), N'{"FailedAt":"2024-07-30T13:39:57.2534042Z","ExceptionType":"Microsoft.Data.SqlClient.SqlException","ExceptionMessage":"Invalid column name ''schedule_id''.","ExceptionDetails":"Microsoft.Data.SqlClient.SqlException (0x80131904): Invalid column name ''schedule_id''.\r\n   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__208_0(Task`1 result)\r\n   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()\r\n   at System.Threading.Tasks.Task.<>c.<.cctor>b__272_0(Object obj)\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n--- End of stack trace from previous location ---\r\n   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)\r\n   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)\r\n   at BE.Service.ImplService.ReminderService.CheckAppointmentsAsync() in E:\\Sem9_Backup\\Sep490\\BE\\Service\\ImplService\\ReminderService.cs:line 33\r\n   at System.Runtime.CompilerServices.TaskAwaiter.GetResult()\r\nClientConnectionId:88d64ffc-4d62-445f-b3eb-28ee65a80d17\r\nError Number:207,State:1,Class:16","ServerId":"pc:142136:98939713-4520-4c82-838a-5a1d9f435d31"}')
SET IDENTITY_INSERT [HangFire].[State] OFF
GO
/****** Object:  Index [IX_HangFire_AggregatedCounter_ExpireAt]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_AggregatedCounter_ExpireAt] ON [HangFire].[AggregatedCounter]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Hash_ExpireAt]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Hash_ExpireAt] ON [HangFire].[Hash]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Job_ExpireAt]    Script Date: 7/31/2024 12:34:31 PM ******/
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
/****** Object:  Index [IX_HangFire_Job_StateName]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Job_StateName] ON [HangFire].[Job]
(
	[StateName] ASC
)
WHERE ([StateName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_List_ExpireAt]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_List_ExpireAt] ON [HangFire].[List]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Server_LastHeartbeat]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Server_LastHeartbeat] ON [HangFire].[Server]
(
	[LastHeartbeat] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Set_ExpireAt]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_ExpireAt] ON [HangFire].[Set]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_HangFire_Set_Score]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_Score] ON [HangFire].[Set]
(
	[Key] ASC,
	[Score] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_State_CreatedAt]    Script Date: 7/31/2024 12:34:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_State_CreatedAt] ON [HangFire].[State]
(
	[CreatedAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Conversations] ADD  CONSTRAINT [DF__Conversat__Creat__0E391C95]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Messages] ADD  CONSTRAINT [DF__Messages__SentAt__1209AD79]  DEFAULT (getdate()) FOR [SentAt]
GO
ALTER TABLE [dbo].[Messages] ADD  CONSTRAINT [DF__Messages__IsRead__12FDD1B2]  DEFAULT ((0)) FOR [IsRead]
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
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Conversations1] FOREIGN KEY([ConversationId])
REFERENCES [dbo].[Conversations] ([Id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Conversations1]
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
