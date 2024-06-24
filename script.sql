USE [master]
GO
/****** Object:  Database [alo2]    Script Date: 6/24/2024 10:09:23 PM ******/
CREATE DATABASE [alo2]

GO
ALTER DATABASE [alo2] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [alo2] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [alo2] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [alo2] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [alo2] SET ARITHABORT OFF 
GO
ALTER DATABASE [alo2] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [alo2] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [alo2] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [alo2] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [alo2] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [alo2] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [alo2] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [alo2] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [alo2] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [alo2] SET  DISABLE_BROKER 
GO
ALTER DATABASE [alo2] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [alo2] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [alo2] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [alo2] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [alo2] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [alo2] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [alo2] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [alo2] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [alo2] SET  MULTI_USER 
GO
ALTER DATABASE [alo2] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [alo2] SET DB_CHAINING OFF 
GO
ALTER DATABASE [alo2] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [alo2] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [alo2] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [alo2] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [alo2] SET QUERY_STORE = OFF
GO
USE [alo2]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 6/24/2024 10:09:23 PM ******/
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
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[acc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Admin]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin](
	[admin_id] [int] NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[gender] [varchar](50) NOT NULL,
	[dob] [date] NOT NULL,
 CONSTRAINT [PK_Admin] PRIMARY KEY CLUSTERED 
(
	[admin_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Appointment]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointment](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[patient_id] [int] NOT NULL,
	[doctor_id] [int] NOT NULL,
	[date] [date] NOT NULL,
	[slot_id] [int] NOT NULL,
	[status] [nchar](10) NOT NULL,
	[note] [nvarchar](max) NULL,
 CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Article_manager]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Article_manager](
	[a_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [varchar](50) NOT NULL,
	[dob] [date] NOT NULL,
 CONSTRAINT [PK_Receptionist] PRIMARY KEY CLUSTERED 
(
	[a_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog]    Script Date: 6/24/2024 10:09:23 PM ******/
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
/****** Object:  Table [dbo].[Blog_img]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog_img](
	[blog_id] [int] NOT NULL,
	[img_id] [int] NOT NULL,
 CONSTRAINT [PK_Blog_img] PRIMARY KEY CLUSTERED 
(
	[blog_id] ASC,
	[img_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Department]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[dep_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nchar](10) NULL,
 CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED 
(
	[dep_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Doctor]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Doctor](
	[doc_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [varchar](50) NOT NULL,
	[age] [int] NOT NULL,
	[dep_id] [int] NOT NULL,
 CONSTRAINT [PK_Doctor] PRIMARY KEY CLUSTERED 
(
	[doc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feedback]    Script Date: 6/24/2024 10:09:23 PM ******/
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
/****** Object:  Table [dbo].[Feedback_res]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feedback_res](
	[res_id] [int] NOT NULL,
	[feed_id] [int] NOT NULL,
	[recep_id] [int] NULL,
	[patient_id] [int] NULL,
	[content] [nchar](10) NULL,
	[date] [date] NOT NULL,
 CONSTRAINT [PK_Feedback_res] PRIMARY KEY CLUSTERED 
(
	[res_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Img]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Img](
	[img_id] [int] IDENTITY(1,1) NOT NULL,
	[img_url] [int] NOT NULL,
 CONSTRAINT [PK_Img] PRIMARY KEY CLUSTERED 
(
	[img_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medical_notebook]    Script Date: 6/24/2024 10:09:23 PM ******/
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
 CONSTRAINT [PK_Medical_notebook] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Patient]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Patient](
	[patient_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [varchar](50) NOT NULL,
	[address] [nvarchar](max) NULL,
	[dob] [date] NOT NULL,
 CONSTRAINT [PK_Patient] PRIMARY KEY CLUSTERED 
(
	[patient_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question]    Script Date: 6/24/2024 10:09:23 PM ******/
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
/****** Object:  Table [dbo].[Receprionist]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Receprionist](
	[recep_id] [int] NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[gender] [varchar](50) NOT NULL,
	[dob] [date] NOT NULL,
 CONSTRAINT [PK_Receprionist] PRIMARY KEY CLUSTERED 
(
	[recep_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 6/24/2024 10:09:23 PM ******/
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
/****** Object:  Table [dbo].[Schedule]    Script Date: 6/24/2024 10:09:23 PM ******/
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
	[week_id] [int] NOT NULL,
	[appointments] [int] NULL,
 CONSTRAINT [PK_Schedule] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Service]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Service](
	[service_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](max) NOT NULL,
	[dep_id] [int] NOT NULL,
	[price] [money] NOT NULL,
 CONSTRAINT [PK_Service] PRIMARY KEY CLUSTERED 
(
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Slot]    Script Date: 6/24/2024 10:09:23 PM ******/
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
/****** Object:  Table [dbo].[Week]    Script Date: 6/24/2024 10:09:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Week](
	[week_id] [int] IDENTITY(1,1) NOT NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
 CONSTRAINT [PK_Week] PRIMARY KEY CLUSTERED 
(
	[week_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
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
ALTER TABLE [dbo].[Blog_img]  WITH CHECK ADD  CONSTRAINT [FK_Blog_img_Blog] FOREIGN KEY([blog_id])
REFERENCES [dbo].[Blog] ([blog_id])
GO
ALTER TABLE [dbo].[Blog_img] CHECK CONSTRAINT [FK_Blog_img_Blog]
GO
ALTER TABLE [dbo].[Blog_img]  WITH CHECK ADD  CONSTRAINT [FK_Blog_img_Img] FOREIGN KEY([img_id])
REFERENCES [dbo].[Img] ([img_id])
GO
ALTER TABLE [dbo].[Blog_img] CHECK CONSTRAINT [FK_Blog_img_Img]
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
REFERENCES [dbo].[Receprionist] ([recep_id])
GO
ALTER TABLE [dbo].[Feedback_res] CHECK CONSTRAINT [FK_Feedback_res_Receprionist]
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
ALTER TABLE [dbo].[Receprionist]  WITH CHECK ADD  CONSTRAINT [FK_Receprionist_Account] FOREIGN KEY([recep_id])
REFERENCES [dbo].[Account] ([acc_id])
GO
ALTER TABLE [dbo].[Receprionist] CHECK CONSTRAINT [FK_Receprionist_Account]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Doctor] FOREIGN KEY([doctor_id])
REFERENCES [dbo].[Doctor] ([doc_id])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Doctor]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Week] FOREIGN KEY([week_id])
REFERENCES [dbo].[Week] ([week_id])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Week]
GO
ALTER TABLE [dbo].[Service]  WITH CHECK ADD  CONSTRAINT [FK_Service_Department] FOREIGN KEY([dep_id])
REFERENCES [dbo].[Department] ([dep_id])
GO
ALTER TABLE [dbo].[Service] CHECK CONSTRAINT [FK_Service_Department]
GO
USE [master]
GO
ALTER DATABASE [alo2] SET  READ_WRITE 
GO
