using AForge.Imaging.Filters;
using Emgu.CV.Structure;
using Emgu.CV;
using System.Drawing;
using System.Drawing.Imaging;
using Tesseract;
using BE.DTOs;
using System.Text.RegularExpressions;

namespace BE.Controllers.User_And_Access_Management.Role_Receptionist
{
    internal class OCRHelper
    {
        private static string tessdataPath = @"C:\Users\ADMIN\Desktop\OCRHelper\tessaract data trained\tessdata"; // Đường dẫn đến thư mục tessdata

        public static string GetFilterNumber(Bitmap b, double? scale = 1, byte? threshold = 0, double blur = 0)
        {
            if (blur != 0)
            {
                var result = BlurImage(b, blur);
                if (result != null)
                {
                    b = result;
                }
            }

            if (threshold != 0)
            {
                ResizeBilinear filter;

                var result = FilterThreshold(b, (byte)threshold, out filter);
                if (result != null)
                {
                    b = result;
                }
            }

            if (scale != 1)
            {
                b = ScaleImage(b, (double)scale);
            }

            var OCR = new TesseractEngine("tessdata", "vie", Tesseract.EngineMode.TesseractAndLstm);
            string template = "0123456789aăâbcddđeêghiklmnôopqrstưuvxyAĂÂBCDĐEÊGHIKLMNÔOPQRSTƯUVXYàằầáắấảẳẩãẵẫạặậèẻẽẹéếểễệìỉĩịíòỏõọóốồổỗộớờởỡợùủũụúứừửữựỳỷỹỵýÀẰẦÁẮẤẢẲẨÃẴẪẠẶẬÈẺẼẸÉẾỂỄỆÌỈĨỊÍÒỎÕỌÓỐỒỔỖỘỚỜỞỠỢÙỦŨỤÚỨỪỬỮỰỲỶỸỴÝ ;?,.:/>-#()";
            OCR.SetVariable("tessedit_char_whitelist", template);

            string res = "";
            try
            {
                var pix = PixConverter.ToPix(b);
                var page = OCR.Process(pix);
                res = page.GetText();
            }
            catch (Exception ee)
            {
                res = ee.Message;
            }
            return res;
        }

        private static Bitmap BlurImage(Bitmap b, double sigmaX)
        {
            if (b == null)
                return null;

            try
            {
                Image<Gray, float> inputImage = new Image<Gray, float>(BitmapToImage(b));

                Image<Gray, float> smoothedImage = new Image<Gray, float>(inputImage.Width, inputImage.Height);
                CvInvoke.GaussianBlur(inputImage, smoothedImage, new Size(inputImage.Width % 2 == 0 ? inputImage.Width + 1 : inputImage.Width, inputImage.Height % 2 == 0 ? inputImage.Height + 1 : inputImage.Height), sigmaX);
                return smoothedImage.ToBitmap();
            }
            catch (Exception ee)
            {
                return null;
            }
        }

        private static Bitmap ThreshHoldBinary(Bitmap bmp, byte threshold)
        {
            Bitmap bmp1 = null;

            try
            {
                Image<Bgr, byte> image = new Image<Bgr, byte>(BitmapToImageByte(bmp));
                Image<Gray, byte> grayImage = image.Convert<Gray, byte>();
                Image<Gray, byte> binaryImage = grayImage.ThresholdBinary(new Gray(threshold), new Gray(255));
                bmp1 = binaryImage.ToBitmap();
            }
            catch { }

            return bmp1 ?? bmp;
        }

        private static Bitmap FilterThreshold(Bitmap b, byte threshold, out ResizeBilinear filter)
        {
            filter = new ResizeBilinear(b.Width, b.Height);
            return ThreshHoldBinary(filter.Apply((Bitmap)b.Clone()), threshold);
        }

        private static Bitmap ScaleImage(Image a, double zoomin)
        {
            if (a == null)
                return null;

            try
            {
                return ResizeImage(a, (int)(a.Size.Width * zoomin), (int)(a.Size.Height * zoomin));
            }
            catch
            {
                return null;
            }
        }

        private static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
                graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(System.Drawing.Drawing2D.WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

        public static byte[,,] BitmapToImageByte(Bitmap bitmap)
        {
            // Get the bitmap's pixel format
            PixelFormat format = bitmap.PixelFormat;

            // Lock the bitmap's bits in memory
            BitmapData bitmapData = bitmap.LockBits(new Rectangle(0, 0, bitmap.Width, bitmap.Height), ImageLockMode.ReadOnly, format);

            // Calculate the number of bytes per pixel based on the pixel format
            int bytesPerPixel = Image.GetPixelFormatSize(format) / 8;

            // Create the float array to hold the pixel values
            byte[,,] floatArray = new byte[bitmap.Height, bitmap.Width, bytesPerPixel];

            // Get the stride (number of bytes per row) of the bitmap
            int stride = bitmapData.Stride;

            // Create a pointer to the start of the bitmap data
            IntPtr scan0 = bitmapData.Scan0;

            // Copy the bitmap data to the float array
            unsafe
            {
                byte* pointer = (byte*)scan0;

                for (int y = 0; y < bitmap.Height; y++)
                {
                    for (int x = 0; x < bitmap.Width; x++)
                    {
                        for (int b = 0; b < bytesPerPixel; b++)
                        {
                            floatArray[y, x, b] = (byte)(pointer[y * stride + x * bytesPerPixel + b] / 255f);
                        }
                    }
                }
            }

            // Unlock the bitmap's bits
            bitmap.UnlockBits(bitmapData);

            return floatArray;
        }

        private static float[,,] BitmapToImage(Bitmap bitmap)
        {
            PixelFormat format = bitmap.PixelFormat;
            BitmapData bitmapData = bitmap.LockBits(new Rectangle(0, 0, bitmap.Width, bitmap.Height), ImageLockMode.ReadOnly, format);
            int bytesPerPixel = Image.GetPixelFormatSize(format) / 8;
            float[,,] floatArray = new float[bitmap.Height, bitmap.Width, bytesPerPixel];
            int stride = bitmapData.Stride;
            IntPtr scan0 = bitmapData.Scan0;

            unsafe
            {
                byte* pointer = (byte*)scan0;

                for (int y = 0; y < bitmap.Height; y++)
                {
                    for (int x = 0; x < bitmap.Width; x++)
                    {
                        for (int b = 0; b < bytesPerPixel; b++)
                        {
                            floatArray[y, x, b] = pointer[y * stride + x * bytesPerPixel + b] / 255f;
                        }
                    }
                }
            }

            bitmap.UnlockBits(bitmapData);
            return floatArray;
        }

        public static OCRResult ExtractInformation(string text)
        {
            OCRResult result = new OCRResult();

            // Tìm và gán các giá trị từ văn bản
            result.HoTen = Regex.Match(text, @"(?i)Họ và tên[: ]*(.+)").Groups[1].Value.Trim();
            result.SoDienThoai = Regex.Match(text, @"(?i)SĐT[: ]*(\d{10,11})").Groups[1].Value.Trim();
            result.NgaySinh = Regex.Match(text, @"(?i)Ngày (sinh|ảinh)[: ]*(\d{2}/\d{2}/\d{4})").Groups[2].Value.Trim();
            result.DiaChi = Regex.Match(text, @"(?i)Địa chỉ[: ]*(.+)").Groups[1].Value.Trim();

            return result;
        }

    }
}