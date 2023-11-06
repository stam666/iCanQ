import Image from "next/image";

export default function MenuCard({
  name,
  imgSrc,
  price,
}: {
  name: string;
  imgSrc?: string;
  price: string;
}) {
  return (
    <div className="flex flex-row rounded-2xl bg-white shadow-lg hover:cursor-pointer">
      <div className="w-2/3 flex flex-col p-4 space-y-2">
        <div className="flex flex-row space-x-4">
          <div className="text-left">{name}</div>
        </div>
        {price ? <p className="text-w text-2xl">{price + "฿"}</p> : null}
      </div>
      {imgSrc ? (
        <div className="w-1/3 relative">
          <Image
            fill={true}
            src={imgSrc}
            alt="restuarant picture"
            className="rounded-tr-2xl rounded-br-2xl object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
