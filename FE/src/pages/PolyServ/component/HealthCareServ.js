// src/components/HealthCheckPackages.js
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';
import pic from '../../../assets/images/med.png'

const packages = [
  { name: 'Gói khám 1', description: 'Mô tả gói khám 1', money: "chỗ này để giá tiền", imageUrl: pic },
  { name: 'Gói khám 2', description: 'Mô tả gói khám 2', money: "chỗ này để giá tiền", imageUrl: pic},
  { name: 'Gói khám 3', description: 'Mô tả gói khám 3', money: "chỗ này để giá tiền", imageUrl: pic},
  { name: 'Gói khám 1', description: 'Mô tả gói khám 1', money: "chỗ này để giá tiền", imageUrl: pic },
  { name: 'Gói khám 2', description: 'Mô tả gói khám 2', money: "chỗ này để giá tiền", imageUrl: pic},
  { name: 'Gói khám 3', description: 'Mô tả gói khám 3', money: "chỗ này để giá tiền", imageUrl: pic},
  { name: 'Gói khám 1', description: 'Mô tả gói khám 1', money: "chỗ này để giá tiền", imageUrl: pic },
  { name: 'Gói khám 2', description: 'Mô tả gói khám 2', money: "chỗ này để giá tiền", imageUrl: pic},
  { name: 'Gói khám 3', description: 'Mô tả gói khám 3', money: "chỗ này để giá tiền", imageUrl: pic},
  // Thêm các gói khám khác tương tự
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // marginTop: ,
    // marginBottom: theme.spacing(4),
    marginLeft: 0,
    marginRight: 0,
  },
}));

const HealthCheckPackages = () => {
  const classes = useStyles();

  return (
    <Container maxWidth={false} className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom marginTop={20}>
        Danh sách gói khám sức khỏe
      </Typography>
      <Grid container spacing={2} justifyContent="center" marginBottom={20}>
        {packages.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={pkg.imageUrl}
                alt={pkg.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {pkg.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {pkg.money}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HealthCheckPackages;
