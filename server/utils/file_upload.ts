import multer from "multer";

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    callback: (error: Error | null, destination: string) => void
  ) {
    callback(null, "./Images");
  },
  filename: function (
    req: any,
    file: any,
    callback: (error: Error | null, destination: string) => void
  ) {
    console.log("file upload file : " + file);

    const splittedFileName = file.originalname.split(".");
    const fileExtension = splittedFileName.pop();
    const fileNameWithoutExtension = splittedFileName.join(".");

    callback(
      null,
      `${fileNameWithoutExtension}_${Date.now()}.${fileExtension}`
    );
  },
});
const upload = multer({ storage });

export default upload;
