import React from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import './layout/anout.css'
import ImageAbout from './layout/image/chungchi1.png'
import ImageTamNhin from './layout/image/chungchi2.png'
import { Helmet } from 'react-helmet';

const About1 = () => {
    return (
        <>
            <Helmet>
                <title>Sơ lược về phòng khám</title>
            </Helmet>
            <Header />
            <NavBar />
            <div className="about-container">
                <h1 className="about-title">Chứng Chỉ và Tiêu Chuẩn của Phòng Khám Đa Khoa 68A Hà Đông</h1>
                <div className="about-content">
                    <h2>I. Giấy Phép Hoạt Động</h2>
                    <p>
                        Phòng khám đa khoa 68A Hà Đông tự hào là một trong những cơ sở y tế hàng đầu tại Hà Nội, được cấp phép và chứng nhận bởi các cơ quan y tế uy tín. Dưới đây là các chứng chỉ và tiêu chuẩn mà phòng khám đã đạt được:
                        Phòng khám đã được Sở Y tế Hà Nội cấp giấy phép hoạt động vào ngày 07/03/2013. Đây là minh chứng cho sự hợp pháp và đáng tin cậy của các dịch vụ y tế mà phòng khám cung cấp. Giấy phép này cho phép phòng khám thực hiện các hoạt động khám và chữa bệnh cho người dân, đảm bảo tuân thủ các quy định và tiêu chuẩn y tế nghiêm ngặt.
                        Các bác sĩ và nhân viên y tế tại Phòng khám đa khoa 68A đều có chứng chỉ hành nghề và trình độ chuyên môn cao. Họ đã trải qua các khóa đào tạo chuyên sâu và không ngừng nâng cao kiến thức y khoa để mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho bệnh nhân. Đội ngũ y bác sĩ tại phòng khám không chỉ giàu kinh nghiệm mà còn có tinh thần trách nhiệm cao, luôn tận tâm với công việc và bệnh nhân.
                        Phòng khám đã đạt được chứng chỉ ISO 9001:2015 về hệ thống quản lý chất lượng. Điều này khẳng định rằng phòng khám luôn tuân thủ các quy trình quản lý chất lượng nghiêm ngặt, đảm bảo dịch vụ y tế đạt tiêu chuẩn quốc tế và đáp ứng nhu cầu của bệnh nhân. ISO 9001:2015 là tiêu chuẩn quốc tế về hệ thống quản lý chất lượng, giúp phòng khám duy trì và cải thiện chất lượng dịch vụ liên tục.
                    </p>
                    <img src={ImageAbout} alt="Bệnh viện Đa khoa Medlatec" className="about-image" sx={{}} />
                    <p className="image-caption">Phòng khám đa khoa 68A cạnh viện 103 Hà Đông</p>
                    <p>Phòng khám cũng đạt chứng nhận về an toàn thực phẩm, đảm bảo các dịch vụ y tế và sản phẩm liên quan đến sức khỏe được quản lý và sử dụng một cách an toàn, không gây hại cho bệnh nhân. Việc tuân thủ các quy định về an toàn thực phẩm giúp bảo vệ sức khỏe bệnh nhân, đặc biệt là trong các dịch vụ có liên quan đến dinh dưỡng và chế độ ăn uống.</p>
                    <p>Phòng khám đa khoa 68A đặc biệt chú trọng đến việc phòng chống nhiễm khuẩn trong quá trình khám chữa bệnh. Nhờ vào các chứng chỉ và quy trình nghiêm ngặt, phòng khám đã và đang cung cấp môi trường y tế an toàn và vệ sinh cho tất cả bệnh nhân. Phòng chống nhiễm khuẩn là yếu tố quan trọng trong việc đảm bảo an toàn sức khỏe cho bệnh nhân và nhân viên y tế.</p>
                    <p>Các bác sĩ và nhân viên y tế tại phòng khám thường xuyên tham gia các khóa đào tạo liên tục để cập nhật kiến thức mới và cải thiện kỹ năng chuyên môn. Điều này giúp phòng khám luôn đi đầu trong việc áp dụng các phương pháp điều trị tiên tiến và hiệu quả. Đào tạo liên tục không chỉ giúp nâng cao trình độ chuyên môn mà còn đảm bảo rằng đội ngũ y tế luôn sẵn sàng đối mặt với các thách thức mới trong y khoa.</p>
                    <img src={ImageTamNhin} alt="Bệnh viện Đa khoa Medlatec" className="about-image" sx={{}} />
                    <p>Với mục tiêu đặt khách hàng là trung tâm, Phòng khám đa khoa 68A đã đạt được các chứng chỉ về dịch vụ khách hàng, đảm bảo sự hài lòng và tin tưởng của bệnh nhân khi sử dụng dịch vụ tại đây. Dịch vụ khách hàng tốt không chỉ là về chất lượng y tế mà còn về cách phục vụ, thái độ và sự quan tâm đến bệnh nhân.</p>
                    <p>Phòng khám cũng đã đạt được chứng nhận quốc tế về quản lý bệnh viện, bao gồm các tiêu chuẩn về an toàn bệnh nhân, quản lý rủi ro và hiệu quả hoạt động. Chứng nhận này giúp đảm bảo rằng phòng khám luôn tuân thủ các tiêu chuẩn cao nhất về quản lý và điều hành, mang lại sự an tâm cho bệnh nhân và gia đình.</p>
                    <p>Phòng khám đa khoa 68A được trang bị các thiết bị y tế hiện đại và đạt chuẩn quốc tế. Chứng chỉ về công nghệ y tế đảm bảo rằng phòng khám sử dụng các thiết bị tiên tiến nhất trong chẩn đoán và điều trị bệnh, mang lại hiệu quả cao và sự chính xác trong quá trình khám chữa bệnh.</p>
                    <p>Nhờ vào các chứng chỉ và tiêu chuẩn uy tín, Phòng khám đa khoa 68A Hà Đông không chỉ mang đến dịch vụ y tế chất lượng mà còn xây dựng niềm tin vững chắc đối với bệnh nhân. Chúng tôi cam kết sẽ tiếp tục nâng cao chất lượng dịch vụ, đảm bảo sự an toàn và sức khỏe cho cộng đồng. Phòng khám luôn đặt lợi ích và sự hài lòng của bệnh nhân lên hàng đầu, không ngừng cải tiến và hoàn thiện để trở thành địa chỉ chăm sóc sức khỏe đáng tin cậy cho mọi người.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default About1;