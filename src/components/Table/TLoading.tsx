import { Spinner } from "@telefonica/mistica";

export default function TLoading() {
  return (
    <section className="flex justify-center items-center w-full h-full rounded-[16px] overflow-auto border-[#D1D5E4] border-[1px]">
      <Spinner size={56} />
    </section>
  );
}
