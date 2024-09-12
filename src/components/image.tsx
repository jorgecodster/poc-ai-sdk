import Image from "next/image";

export async function ImageComponent({ url }: { url: string }) {
  return (
    <img width={300} height={300} src={url} alt="image"/>
  );
}