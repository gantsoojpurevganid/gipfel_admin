import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrop = ({ image, onCropComplete }) => {
  console.log("imagexxx", image);
  // console.log("onCropComplete", onCropComplete);
  const [crop, setCrop] = useState({ unit: "px", width: 30, aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    handleImageLoaded();
  }, []);

  const handleImageLoaded = (image) => {
    console.log("fffffff");
    setCrop({ width: 50, height: 80 });
  };
  // console.log("crop", crop);
  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (crop) => {
    if (image && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        setCroppedImage(URL.createObjectURL(blob));
        onCropComplete(blob);
      });
    }
  };

  return (
    <div>
      <ReactCrop
        src={image}
        crop={crop}
        onImageLoaded={handleImageLoaded}
        onChange={handleCropChange}
        onComplete={handleCropComplete}
      />
      {croppedImage && <img src={croppedImage} alt="Cropped" />}
    </div>
  );
};

export default ImageCrop;
