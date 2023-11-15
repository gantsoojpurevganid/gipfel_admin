import { useRouter } from "next/router";
import { useSWR } from "../../fetcher";

// import { PageHeader, Pagination } from "../components";
import { ORDER_STATUS_CHOICES, PER_PAGE } from "../../consts";
import ProductSkeleton from "@/components/skeleton/productSkeleton";
// import { toast } from "react-hot-toast";

export default function Order() {
  const router = useRouter();

  const { query } = router;

  const { data, isLoading } = useSWR("/api/admin/orders/", {
    method: "GET",
  });

  console.log("data", data);

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
          <p className="text-normal text-2xl font-semibold">Захиалга</p>
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
                          Мөнгө
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Төлөв
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Нэр
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Утас
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Хаяг
                        </th>
                        <th scope="col" class="px-6 py-4 border-[1px]">
                          Анхааруулга
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.results?.map((i) => (
                        <tr
                          key={i.pk}
                          class="border-b dark:border-neutral-500 hover:bg-neutral-100 border-[1px]"
                        >
                          <td class="whitespace-nowrap px-6 py-4 font-medium border-[1px]">
                            {i.user}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            {parseInt(i.grand_total).toLocaleString()}₮
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            <select
                              //   disabled={isMutating || isValidating}
                              onChange={async (_e, val) => {
                                try {
                                  if (val) {
                                    await trigger({
                                      pk: i.pk,
                                      status:
                                        Object.values(
                                          ORDER_STATUS_CHOICES
                                        ).indexOf(val),
                                    });
                                  }
                                } catch (error) {
                                  toast.error(`${error}`);
                                }
                              }}
                              value={ORDER_STATUS_CHOICES[i.status]}
                            >
                              {Object.values(ORDER_STATUS_CHOICES).map(
                                (value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            {i.name}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            <span>{i.phone_number}</span>
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            {i.address}
                          </td>
                          <td class="whitespace-nowrap px-6 py-4 border-[1px]">
                            {i.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
