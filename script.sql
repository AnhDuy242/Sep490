USE [master]
GO
/****** Object:  Database [MedPal]    Script Date: 7/18/2024 2:45:06 PM ******/
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
/****** Object:  Table [dbo].[Account]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Admin]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Appointment]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Article_manager]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Blog]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Department]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Doctor]    Script Date: 7/18/2024 2:45:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Doctor](
	[doc_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [nvarchar](50) NOT NULL,
	[age] [int] NOT NULL,
	[service_id] [int] NOT NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_Doctor] PRIMARY KEY CLUSTERED 
(
	[doc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feedback]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Feedback_res]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Img]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Medical_notebook]    Script Date: 7/18/2024 2:45:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medical_notebook](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[prescription] [nvarchar](max) NOT NULL,
	[diagnostic] [nvarchar](max) NOT NULL,
	[test_result] [varchar](max) NULL,
	[patient_id] [int] NOT NULL,
	[doctor_id] [int] NOT NULL,
 CONSTRAINT [PK_Medical_notebook] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Patient]    Script Date: 7/18/2024 2:45:07 PM ******/
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
 CONSTRAINT [PK_Patient] PRIMARY KEY CLUSTERED 
(
	[patient_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Receptionist]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Role]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Schedule]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Service]    Script Date: 7/18/2024 2:45:07 PM ******/
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
/****** Object:  Table [dbo].[Slot]    Script Date: 7/18/2024 2:45:07 PM ******/
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

INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id]) VALUES (2, 3, 2, CAST(N'2024-06-24' AS Date), 1, N'Scheduled', N'First visit', NULL)
INSERT [dbo].[Appointment] ([id], [patient_id], [doctor_id], [date], [slot_id], [status], [note], [service_id]) VALUES (5, 3, 2, CAST(N'2024-09-24' AS Date), 1, N'Đã hủy', NULL, NULL)
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
INSERT [dbo].[Doctor] ([doc_id], [name], [gender], [age], [service_id], [isActive]) VALUES (2, N'Doctor User', N'Female', 40, 1, 1)
INSERT [dbo].[Doctor] ([doc_id], [name], [gender], [age], [service_id], [isActive]) VALUES (7, N'abc', N'Male', 23, 1, 1)
GO
SET IDENTITY_INSERT [dbo].[Feedback] ON 

INSERT [dbo].[Feedback] ([feed_id], [patient_id], [content], [date], [star]) VALUES (1, 3, N'Great service!', CAST(N'2024-06-26' AS Date), 5)
SET IDENTITY_INSERT [dbo].[Feedback] OFF
GO
INSERT [dbo].[Feedback_res] ([res_id], [feed_id], [recep_id], [patient_id], [content], [date]) VALUES (1, 1, 5, 3, N'Thank you for your feedback!', CAST(N'2024-06-27' AS Date))
GO
SET IDENTITY_INSERT [dbo].[Medical_notebook] ON 

INSERT [dbo].[Medical_notebook] ([id], [prescription], [diagnostic], [test_result], [patient_id], [doctor_id]) VALUES (2, N'Take 2 pills daily', N'Flu', N'Negative', 3, 2)
SET IDENTITY_INSERT [dbo].[Medical_notebook] OFF
GO
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive]) VALUES (3, N'Patient User', N'Male', N'123 Street', CAST(N'1990-05-15' AS Date), 1)
INSERT [dbo].[Patient] ([patient_id], [name], [gender], [address], [dob], [isActive]) VALUES (8, N'string', N'male', N'hani', CAST(N'2024-07-10' AS Date), 1)
GO
SET IDENTITY_INSERT [dbo].[Question] ON 

INSERT [dbo].[Question] ([ques_id], [patient_id], [question], [ques_date], [dep_id], [doc_id], [ans_date], [answer]) VALUES (2, 3, N'What are the symptoms of flu?', CAST(N'2024-06-25' AS Date), 1, 2, CAST(N'2024-06-26' AS Date), N'Common symptoms are...')
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

INSERT [dbo].[Slot] ([slot_id], [time]) VALUES (1, N'09:00-10:00')
INSERT [dbo].[Slot] ([slot_id], [time]) VALUES (2, N'10:00-11:00')
SET IDENTITY_INSERT [dbo].[Slot] OFF
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
ALTER TABLE [dbo].[Doctor]  WITH CHECK ADD  CONSTRAINT [FK_Doctor_Service] FOREIGN KEY([service_id])
REFERENCES [dbo].[Service] ([service_id])
GO
ALTER TABLE [dbo].[Doctor] CHECK CONSTRAINT [FK_Doctor_Service]
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
USE [master]
GO
ALTER DATABASE [MedPal] SET  READ_WRITE 
GO
