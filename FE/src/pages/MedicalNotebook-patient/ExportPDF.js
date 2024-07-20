import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import ArialUnicodeMS from '../../assets/font/arial-unicode-ms.ttf'; // Ensure correct path to your font file
import logo from '../../assets/images/images.png'; // Ensure correct path to your logo file

// Register font with @react-pdf/renderer
Font.register({
    family: 'ArialUnicodeMS',
    src: ArialUnicodeMS,
});

const MyDocument = ({ notebook }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                {/* Logo */}
                <Image src={logo} style={styles.logo} />

                {/* Title */}
                <Text style={styles.title}>Hồ sơ bệnh án</Text>

                {/* Patient information */}
                <Text style={styles.label}>Mã bệnh nhân: {notebook.patientId}</Text>

                <Text style={styles.label}>Tên bệnh nhân: {notebook.patientName}</Text>

                <Text style={styles.label}>Bác sĩ thăm khám: {notebook.doctorName}</Text>

                <Text style={styles.label}>Chỉ định: {notebook.prescription}</Text>

                <Text style={styles.label}>Chẩn đoán: {notebook.diagnostic}</Text>

                {/* Display test result if available */}
                {notebook.test_result && (
                    <>
                        <Text style={styles.label}>Kết quả:{notebook.test_result} </Text>
                    </>
                )}
            </View>
        </Page>
    </Document>
);

const styles = StyleSheet.create({
    page: {
        padding: 35,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontFamily: 'ArialUnicodeMS',
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'ArialUnicodeMS',
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    text: {
        fontFamily: 'ArialUnicodeMS',
        fontSize: 12,
        marginBottom: 10,
    },
    logo: {
        width: 50,
        height: 50,
        marginTop: 20,
        alignSelf: 'center',
    },
});

export default MyDocument;
