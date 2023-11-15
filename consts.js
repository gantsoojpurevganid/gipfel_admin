import { S3Client } from "@aws-sdk/client-s3";

export const globalStylesConfig = {
  svg: {
    color: "var(--Icon-color)",
    margin: "var(--Icon-margin)",
    fontSize: "var(--Icon-fontSize, 24px)",
    width: "1em",
    height: "1em",
  },
};

export const BASE_URL = "https://api2.bgb.mn";
export const IMAGE_RESIZE = [
  { height: 398, width: 250, name: "desktop", url: "high_url" },
  { height: 227, width: 250, name: "tablet", url: "mid_url" },
  { height: 288, width: 250, name: "mobile", url: "low_url" },
];
export const IMAGE_URL = "https://image.bosa.mn/upload/";
export const PRODUCT_IMAGE_URL = "https://image.bosa.mn";
// export const BASE_URL = "http://api2.bgb.mn";
export const client_id = "AMhC8zAMoo13L7e9pfhnt0VFzsZmDQfPxGtDnj7Q";
export const client_secret =
  "6mGViZdgbdzet5b3c2Zdb3iR3WbOItaYp3i6X1FrW0ym4qyc27t7g3qi25c00Xn4SH9Xenv42qJXuVAlOFbhMqkdqF8i2F9iLw2S7M4chSe5uVgmf5VgIrrklhAMPeZ8";

export const CDNendpoint = "https://sgp1.digitaloceanspaces.com";
export const CDNregion = "ap-southeast-1";
export const CDNBucket = "gipfel";

export const s3Client = new S3Client({
  endpoint: CDNendpoint,
  forcePathStyle: false,
  region: CDNregion,
  credentials: {
    // accessKeyId: process.env.DO_ACCESS_KEY!,
    // secretAccessKey: process.env.DO_SECRET_ACCESS_KEY!,
  },
});

export const PER_PAGE = 20;

export const IMAGE_SIZES = [
  { width: 800, folderName: "thumbnail-high", name: "high" },
  { width: 200, folderName: "thumbnail-small", name: "small" },
  { width: 400, folderName: "thumbnail-mid", name: "mid" },
];

export const ORDER_STATUS_CHOICES = {
  0: "Захиалга өгсөн",
  1: "Хүлээн авсан",
  2: "Бэлтгэгдэж байгаа",
  3: "Хүргэлтэнд гарсан",
  4: "Хүргэгдсэн",
  5: "Хаагдсан",
};
