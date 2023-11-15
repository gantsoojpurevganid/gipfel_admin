import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState, Fragment } from "react";
// import useSWR, { mutate } from "swr";
// import useSWRMutation from "swr/mutation";
import { read, utils } from "xlsx";
import { useSWR } from "../../fetcher";
import { useSWRMutation } from "../../fetcher";
import ProductSkeleton from "@/components/skeleton/productSkeleton";
// import { PageHeader, Pagination } from "../components";
import { ORDER_STATUS_CHOICES, PER_PAGE } from "../../consts";
import { axios } from "../../fetcher";
// import { toast } from "react-hot-toast";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
export default function Product() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const router = useRouter();

  const { query } = router;
  const { trigger, isMutating } = useSWRMutation("/product-import/");
  const { data: productData, isLoading } = useSWR("/api/products/", {
    method: "GET",
  });

  // const { trigger, isMutating } = useSWRMutation(
  //   "/api/admin/product/code",
  //   async (url, { arg }) => {
  //     for (rows in el) {
  //       try {
  //         const res = await trigger(el);
  //         if (res.order_id) {
  //           toast.success("Амжилттай захиалга үүслээ та төлбөрөө төлнө үү!!!", {
  //             position: "top-center",
  //             autoClose: 3000,
  //             hideProgressBar: true,
  //             newestOnTop: false,
  //             closeOnClick: true,
  //             draggable: true,
  //           });
  //         } else {
  //           toast.error("Алдаа гарлаа.", {
  //             position: "top-center",
  //             autoClose: 2000,
  //             hideProgressBar: true,
  //             newestOnTop: false,
  //             closeOnClick: true,
  //             draggable: true,
  //           });
  //         }
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     }
  //   }

  const onSubmits = async (d) => {
    console.log("ddddd", d);
    d.map(async (el) => {
      try {
        console.log("el", el);
        const res = await trigger(el);
        if (res) {
          console.log("res", res);
        } else {
          toast.error("Алдаа гарлаа.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            newestOnTop: false,
            closeOnClick: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    });
  };

  // async (url, { arg }) => {
  //   console.log("arg", arg);
  //   const values = [];
  //   let index = 0;

  //   for (const item of arg) {
  //     console.log("argttt", arg);
  //     try {
  //       const res = await axios.post(url, { ...item }).then((r) => r.data);
  //       console.log("res", res);
  //       if (res.status === "success") {
  //         setUploadStatus((prev) => insert(prev, index, "SUCCESS"));
  //         values.push(res);
  //         index++;
  //       }
  //       console.log("index", index);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }

  //   return values;
  // },
  // {
  //   onSuccess: (res) => {
  //     console.log("Res", res);
  //     toastSuccess();
  //   },
  // }
  // );

  console.log("product data", productData);

  const productDetail = (tag) => {
    console.log("tag", tag);
  };

  const onSubmit = async (e) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    console.log("file", file);
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const workbook = read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const data = utils.sheet_to_json(workSheet);
      setColumns(utils.sheet_to_json(workSheet, { header: 1 })[0]);
      setRows(data);
      setUploadStatus(Array.from({ length: data.length }).fill("DRAFT"));
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  //   const { trigger, isMutating } = useSWRMutation(
  //     "/api/admin/order/status",
  //     async (url, { arg }: { arg: { status: number; pk: number } }) =>
  //       await axios.post(url, arg).then((r) => r.data),
  //     {
  //       onSuccess: (data) => {
  //         if (data.status === "success") {
  //           toastSuccess();
  //           mutate("/api/admin/order");
  //         }
  //       },
  //     }
  //   );

  return (
    <>
      {isLoading ? (
        <ProductSkeleton />
      ) : (
        <>
          <div className="flex justify-between">
            <p className="text-normal text-2xl font-semibold">Бүтээгдэхүүн</p>
            {/* <button className="px-4 py-3 w-48 bg-blue-500 p-2 rounded-md text-white grid justify-items-end justify-end">
              Бүтээгдэхүүн импорт
            </button> */}
            {/* <div
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <input
                accept=".xlsx, .xls, .csv"
                onChange={onSubmit}
                type="file"
                placeholder="Бараа импорт хийх"
                name="ggg"
              />
            </div> */}

            <div class="mb-6">
              <label
                for="large-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Бараа бүтээгдэхүүн импорт
              </label>
              <input
                accept=".xlsx, .xls, .csv"
                onChange={onSubmit}
                type="file"
                placeholder="Бараа импорт хийх"
                id="large-input"
                class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {/* <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="file_input"
              >
                Бараа бүтээгдэхүүн импорт
              </label>
              <input
                accept=".xlsx, .xls, .csv"
                onChange={onSubmit}
                class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
              ></input> */}
            </div>
          </div>
          {rows.length ? (
            <div
              direction="row"
              gap={2}
              sx={{ alignItems: "center" }}
              className="pt-4"
            >
              {/* <div>{rows.length} мөр</div> */}
              <button
                onClick={async () => {
                  const res = await trigger(rows);
                  console.log("res", res);
                  if (res.detail == "imported") {
                    setColumns([]);
                    setRows([]);
                    toast.success("Амжилттай хадгалаалаа.", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: true,
                      newestOnTop: false,
                      closeOnClick: true,
                      draggable: true,
                    });
                  } else {
                    toast.error("Алдаа гарлаа дахин оролдоно уу!!!", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: true,
                      newestOnTop: false,
                      closeOnClick: true,
                      draggable: true,
                    });
                  }
                }}
                className="bg-primary text-white py-3 px-3"
              >
                Импорт хийх
              </button>
            </div>
          ) : (
            <div class="flex flex-col pt-4">
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
                            Ангилал
                          </th>
                          <th scope="col" class="px-6 py-4 border-[1px]">
                            Үнэ
                          </th>
                          <th scope="col" class="px-6 py-4 border-[1px]">
                            Тоо хэмжээ
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
                        </tr>
                      </thead>
                      <tbody>
                        {productData?.map((i) => (
                          <tr
                            key={i.id}
                            class="border-b dark:border-neutral-500 hover:bg-neutral-100 border-[1px]"
                          >
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                              {i.code}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px] text-blue-500">
                              <p
                                // onClick={productDetail(i)}
                                onClick={() => {
                                  router.push(`/product/${i.id}/`);
                                  console.log("iiii", i);
                                }}
                                className="cursor-pointer"
                              >
                                {i.name}
                              </p>
                              {/* <Link href={`/products/${i.id}/detail/`}>
                                {i.name}
                              </Link> */}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                              {i.category_name}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                              {i.price}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                              {i.quantity}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                              {i.is_new ? (
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
                              {i.is_hit == true ? (
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
                              {i.is_active ? (
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isMutating ? (
            <ProductSkeleton />
          ) : (
            <div className="pt-4">
              <table class="min-w-full text-left text-sm font-light ">
                <thead>
                  <tr>
                    {/* {uploadStatus.length ? (
                    <th scope="col" class="px-6 py-4 border-[1px]">
                      <p>state</p>
                    </th>
                  ) : null} */}

                    {columns.map((i, idx) => (
                      <th
                        key={`${i}${idx}`}
                        scope="col"
                        class="px-6 py-4 border-[1px]"
                      >
                        <p>{i}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={`${row[columns[0]]}${idx}`}>
                      {/* <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                        <p>
                          {uploadStatus[idx] === "SUCCESS" ? (
                            <p style={{ fill: "green" }} />
                          ) : (
                            "Ноорог"
                          )}
                        </p>
                      </td> */}
                      {columns.map((column, idx) => (
                        <td
                          key={`${column}${idx}`}
                          class="whitespace-nowrap px-6 py-4 font-base border-[1px]"
                        >
                          <p>{row[column]}</p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <ToastContainer />
        </>
      )}
    </>
  );
}
