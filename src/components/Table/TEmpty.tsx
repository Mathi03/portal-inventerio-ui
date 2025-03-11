import Icon from "../Icon";

export default function TEmpty() {
  return (
    <section
      className="flex flex-col justify-center items-center w-full h-full rounded-[16px] overflow-auto border-[#D1D5E4] border-[1px] bg-[#fafafa] text-gray-500"
      style={{ gridRow: "2/3" }}
    >
      <Icon icon="table" style={{ fontSize: "112px" }} />
      <h6 className="text-[22px] font-bold">Sin resultados</h6>
      <p>Por el momento no se han registrado datos para mostrar en la tabla.</p>
    </section>
  );
}
