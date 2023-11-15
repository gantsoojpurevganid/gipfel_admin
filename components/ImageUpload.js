import React, { useState } from "react";
import axios from "axios";
const ImageUpload = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    onImageUpload(file);
    setSelectedImages(file);
  };

  const imagePost = async (e) => {
    console.log("selectedImages", selectedImages);
    try {
      const res = await axios.post(
        "https://image.bosa.mn/upload/",
        {
          url: selectedImage,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res) {
        console.log("res", res);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && <img src={selectedImage} alt="Selected" />}
      <button onClick={imagePost}>Хадгалах</button>
    </div>
  );
};

export default ImageUpload;
