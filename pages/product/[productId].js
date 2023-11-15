import React, { useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { useSWR } from "../../fetcher";
import ProductSkeleton from "@/components/skeleton/productSkeleton";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { BASE_URL, IMAGE_URL, IMAGE_RESIZE, PRODUCT_IMAGE_URL } from "@/consts";
import { useSWRMutationImage, useSWRMutationImageDelete } from "@/fetcher";
import { imgPreview } from "@/components/imgPreview";
import { canvasPreview } from "@/components/canvasPreview";
import CartContext from "@/context/CartContext";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDebounceEffect } from "@/components/useDebounceEffect";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ProductId() {
  const { query } = useRouter();
  const router = useRouter();
  const [imageId, setImageId] = useState(null);
  const id = query.productId;
  const { trigger: deleteTrigger, isMutating: deleteMutating } =
    useSWRMutationImageDelete(`/set-product-image/${imageId}`);
  const { trigger, isMutating } = useSWRMutationImage(
    id ? `/set-product-image/${id}/` : null
  );
  const { data, isLoading } = useSWR(
    id
      ? `/products/${id}/detail/`
      : {
          method: "POST",
        }
  );

  const { toastTag } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [responsiveImages, setResponsiveImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");

  // const [crop, setCrop] = useState({ unit: "px", width: 30, aspect: 1 });

  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  var blobUrlRef = "";
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    console.log("image", image);
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    console.log("previewCanvas", previewCanvas);

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    console.log("offscreen", offscreen);
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    const file = new File([blob], "image.png", { type: "image/png" });
    console.log("blob", blob);
    console.log("file fff", file);

    if (blobUrlRef) {
      URL.revokeObjectURL(blobUrlRef);
    }
    blobUrlRef = URL.createObjectURL(blob);
    hiddenAnchorRef.current.href = blobUrlRef;
    hiddenAnchorRef.current.click();
    console.log("hiddenAnchorRef", hiddenAnchorRef.current.href);
    convert(file);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 10);
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    setSelectedImage(URL.createObjectURL(file));
    // handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    const lp = document.createElement("img");
    const formData = new FormData();
    const responsiveImages = [];
    var responsiveUrls = [];
    IMAGE_RESIZE.map(async (idx) => {
      try {
        const file = event.target.files[0];
        console.log("file s", file);

        const imageDesktop = await resizeFile(file, idx);

        lp.setAttribute("src", imageDesktop);
        console.log("lpwidth", lp.width);
        console.log("lpheight", lp.height);
        console.log("imageDesktop", imageDesktop);
        const newFile = dataURIToBlob(imageDesktop);
        console.log("newFile", newFile);
        formData.append("files[]", newFile, "image.png");
        const response = await fetch(IMAGE_URL, {
          method: "POST",
          body: formData,
        });
        console.log("response", response);
        if (response.status === 200) {
          const responseData = await response.text();
          const responseJson = JSON.parse(responseData);
          appendUrl(responseJson);
        }
        responsiveImages.push({
          height: lp.height,
          width: lp.width,
          image: imageDesktop,
          name: idx.name,
        });
        setResponsiveImages(responsiveImages);
      } catch (err) {
        console.log(err);
      }
    });
  };
  const convert = async (file) => {
    const lp = document.createElement("img");
    const formData = new FormData();
    const responsiveImages = [];
    IMAGE_RESIZE.map(async (idx) => {
      try {
        const imageDesktop = await resizeFile(file, idx);
        lp.setAttribute("src", imageDesktop);
        const newFile = dataURIToBlob(imageDesktop);
        formData.append("files[]", newFile, "image.png");
        const response = await fetch(IMAGE_URL, {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          const responseData = await response.text();
          const responseJson = JSON.parse(responseData);
          appendUrl(responseJson);
        }

        responsiveImages.push({
          height: lp.height,
          width: lp.width,
          image: imageDesktop,
          name: idx.name,
        });
        setResponsiveImages(responsiveImages);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const appendUrl = async (e) => {
    if (e.image_paths.length == 3) {
      try {
        const res = await trigger({
          product: id,
          high_url: `${PRODUCT_IMAGE_URL}${e.image_paths[0].slice(0, -4)}.png`,
          mid_url: `${PRODUCT_IMAGE_URL}${e.image_paths[1].slice(0, -4)}.png`,
          low_url: `${PRODUCT_IMAGE_URL}${e.image_paths[2].slice(0, -4)}.png`,
        });
        toastTag({
          color: "red-300",
          icon: "HiFire",
          message: "Амжилттай зураг хувиргаж хадгалаалаа.",
          type: "success",
        });
        setTimeout(() => {
          router.reload();
        }, 3000);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const resizeFile = (file, size) =>
    new Promise((resolve) => {
      console.log("size", size);
      Resizer.imageFileResizer(
        file,
        250,
        size.height,
        "PNG",
        20,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        250,
        size.height
      );
    });

  const dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(",");
    console.log("splitDataURI[0]", splitDataURI[0]);
    console.log("splitDataURI[0][1]", splitDataURI[0].split(":")[1]);
    console.log(
      "splitDataURI[0][2]",
      splitDataURI[0].split(":")[1].split(";")[0]
    );
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    console.log("mimeString", mimeString);
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    console.log("ia", ia);
    return new Blob([ia], { type: mimeString });
  };

  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }
  const deleteImage = async (e) => {
    setImageId(e.target.value);
    if (imageId) {
      try {
        const res = await deleteTrigger();
        console.log("res", res);
        if (res.status == 204) {
          toastTag({
            color: "red-300",
            icon: "HiFire",
            message: "Амжилттай устгалаа.",
            type: "success",
          });
          setTimeout(() => {
            router.reload();
          }, 1000);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <>
          <p className="text-normal text-2xl font-semibold">Бүтээгдэхүүн</p>
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Код
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Нэр
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Үнэ
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Үлдэгдэл
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Шинэ
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Хит
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Хямдралтай
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Зураг
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b dark:border-neutral-500 hover:bg-neutral-100 border-[1px]">
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.code}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.name}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.price}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.quantity}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.is_new ? (
                            <label className="text-green-500 border-[1px] px-2 rounded-md ring-green-800">
                              Тийм
                            </label>
                          ) : (
                            <label className="text-blue-500 border-[1px] px-2 rounded-md ring-blue-500">
                              Үгүй
                            </label>
                          )}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.is_hit == true ? (
                            <label className="text-green-500 border-[1px] px-2 rounded-md ring-green-800">
                              Тийм
                            </label>
                          ) : (
                            <label className="text-blue-500 border-[1px] px-2 rounded-md ring-blue-500">
                              Үгүй
                            </label>
                          )}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                          {data?.is_active ? (
                            <label className="text-green-500 border-[1px] px-2 rounded-md ring-green-800">
                              Тийм
                            </label>
                          ) : (
                            <label className="text-blue-500 border-[1px] px-2 rounded-md ring-blue-500">
                              Үгүй
                            </label>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Дугаар
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Компьютер
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Таблет
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Гар утас
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Үйлдэл
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.product_images.map((i) => (
                        <tr
                          class="border-b dark:border-neutral-500 hover:bg-neutral-100 border-[1px]"
                          key={i.id}
                        >
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            {i?.id}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            <Image
                              priority
                              src={i.high_url}
                              alt="Add to Card"
                              className="w-[125px] h-[180px]"
                              width={125}
                              height={200}
                            />
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            <Image
                              priority
                              src={i.mid_url}
                              alt="Add to Card "
                              className="w-[125px] h-[110px]"
                              width={125}
                              height={110}
                            />
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            <Image
                              priority
                              src={i.low_url}
                              alt="Add to Card"
                              className="w-[125px] h-[144px]"
                              width={125}
                              height={144}
                            />
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            <button
                              className="px-4 py-2 bg-red-500 text-white"
                              onClick={deleteImage}
                              value={i.id}
                            >
                              Устгах
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              Зураг оруулах
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              placeholder="Зураг оруулах"
            />
          </div>
          <div className="flex flex-row gap-6">
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minHeight={200}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={selectedImage}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}

            {!!completedCrop && (
              <>
                <div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: "1px solid black",
                      objectFit: "contain",
                      width: completedCrop.width,
                      height: completedCrop.height,
                    }}
                  />
                </div>
                <div>
                  <button
                    className="px-6 py-2 bg-primary grid justify-items-center content-center cursor-pointer text-white"
                    onClick={onDownloadCropClick}
                  >
                    Хадгалах
                  </button>
                  <a
                    href="#hidden"
                    ref={hiddenAnchorRef}
                    download
                    style={{
                      position: "absolute",
                      top: "-200vh",
                      visibility: "hidden",
                    }}
                  >
                    Hidden download
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-row gap-6">
            {responsiveImages?.map((el, index) => (
              <div className="border-[1px] p-6" key={index}>
                <p className="grid justify-items-center">{el.name}</p>
                <div className="flex flex-row justify-between">
                  <p>Өргөн</p> <p>{el?.width}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Өндөр</p> <p>{el?.height}</p>
                </div>

                <img src={el.image} alt="Selected" />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
