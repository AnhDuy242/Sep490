import React from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import './layout/anout.css'
import ImageAbout from './../../assets/images/anhAbout.png'
import ImageTamNhin from '././../../assets/images/carousel_image_2.jpg'
import { Helmet } from 'react-helmet';

const About = () => {
    return (
        <>
            <Helmet>
                <title>Sơ lược về phòng khám</title>
            </Helmet>
            <Header />
            <NavBar />
            <div className="about-container">
                <h1 className="about-title">Giới thiệu về Phòng khám đa khoa 68A cạnh viện 103 Hà Đông</h1>
                <div className="about-content">
                    <h2>I. Sơ lược về phát triển</h2>
                    <p>Đã được sở Y tế Hà Nội cấp phép hoạt động khám chữa bệnh ngày 07/03/2013, do đó đảm bảo tính pháp lý cao.
                        Phòng khám không chỉ chăm sóc SKSS nói chung mà còn chú trọng điều trị các bệnh lý Nam khoa, Phụ khoa, Nội khoa, Ngoại khoa, Sản nhi, bệnh lây truyền qua đường quan hệ, vô sinh-hiếm muộn. Mọi danh mục và các hoạt động thăm khám, điều trị được tiến hành đều được cấp phép nên bệnh nhân có thể tin tưởng lựa chọn.
                        Phòng khám đa khoa 68A là nơi cung cấp chất lượng dịch vụ y tế cao cấp, khám và chữa bệnh kỹ thuật cao với mục tiêu mang lại sựu an toàn, tiện nghi, thoải mái và phục hồi sức khỏe tốt nhất cho khách hàng.
                        Phòng khám đa khoa 68A tọa lạc tại một khu yên tĩnh tại trung tâm thành phô Hà Nội trên đường 111 Phùng Hưng – Hà Đông – Hà Nội, có cơ sở vật chất khang trang, quy mô lớn nằm ngay mặt đường trung tâm nên khá tiện lợi cho việc di chuyển, tìm kiếm.
                        Máy móc, trang thiết bị y được phòng khám cân nhắc lựa chọn kĩ lưỡng, trang bị đầy đủ giúp bác sĩ phát hiện, chẩn đoán nhanh chóng, chính xác tình trạng sức khỏe, bệnh lý để đưa ra phương pháp điều trị đúng, đạt hiệu quả tối ưu.
                        Bên cạnh những thế mạnh về quy mô, cơ sở vật chất thì Phòng Khám Đa Khoa 68A còn có một đội ngũ hùng hậu bác sĩ, có chứng chỉ hành nghề, trình độ chuyên môn cao, giàu kinh nghiệm, tận tâm, hết lòng vì người bệnh, không ngừng học hỏi để trau dồi chuyên môn.</p>
                    <img src={ImageAbout} alt="Bệnh viện Đa khoa Medlatec" className="about-image" sx={{}} />
                    <p className="image-caption">Phòng khám đa khoa 68A cạnh viện 103 Hà Đông</p>
                    <p>Tại Phòng Khám Đa Khoa 68A, mọi thông tin về chi phí thăm khám được tuân thủ theo quy định của Sở y tế nên khá cụ thể, hợp lý. Chất lượng dịch vụ luôn được quan tâm, chú trọng nhằm đem đến sự thuận tiện và tiết kiệm thời gian tối đa cho bệnh nhân. Phòng khám đã cho xây dựng hệ thống các dịch vụ từ tư vấn hướng dẫn, chẩn đoán điều trị tới chăm sóc sau điều trị.</p>
                    <h2>II. Tầm nhìn của chúng tôi </h2>
                    <p>Chia sẻ gánh nặng với xã hội trong việc điều trị bệnh và chăm sóc sức khỏe cho cộng đồng. Là nhà cung cấp dịch vụ Chăm sóc Sức khỏe Toàn diện cho Khách hàng và Gia đình.
                        Không chỉ nhằm góp phần giảm tải cho các bệnh viện công, phòng khám đa khoa 68A còn hướng tới việc cung cấp dịch vụ khám và điều trị bệnh toàn diện đạt tiêu chuẩn, chất lượng quốc tế với chi phí hợp lý.
                        SỨ MỆNH CỦA TẬP THỂ NHÂN VIÊN
                        Với mong muốn cải thiện sức khỏe sinh sản người Việt, Phòng khám Đa 68A luôn nỗ lực để mang đến cho người dân những dịch vụ y tế chuyên nghiệp và hiệu quả nhất.
                        Góp phần đảm bảo chất lượng cuộc sống cộng đồng bằng những dịch vụ chăm sóc sức khỏe hiện đại dựa trên Y học chứng cứ, theo đúng tiêu chí Y đức – Chất lượng – Thân thiện.</p>
                    <img src={ImageTamNhin} alt="Bệnh viện Đa khoa Medlatec" className="about-image" sx={{}} />
                    <h2>III. Giá trị cốt lõi vì lợi ích người bệnh</h2>
                    <p>Luôn tâm niệm khách hàng là trung tâm, đặt sự an toàn, sức khỏe, sự hài lòng của người bệnh là mục tiêu hàng đầu, chung tay cùng xã hội để bảo vệ sức khỏe mọi người.
                        Với mục tiêu là nâng cao chất lượng dịch vụ Y tế, lấy khách hàng làm trung tâm của tất cả mọi hoạt động, cung cấp dịch vụ đảm bảo khách hàng hài lòng nhất, chúng tôi đã coi việc xây dựng hệ thống quản lý chất lượng toàn diện và an toàn người bệnh là một trong những yếu tố sống còn.
                        •	Đội ngũ Bác sĩ, Điều dưỡng Y đức, Chuyên môn cao và Tận tụy vì sức khỏe người bệnh.
                        •	Tập thể Nhân viên Thân thiện, Tôn trọng và Hết lòng vì người bệnh.
                        •	Chất lượng khám chữa bệnh luôn tuân thủ theo Tiêu chuẩn Quốc Tế.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default About;