export async function ImageComponent({ url }: { url: string }) {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid white', borderRadius: '10px', padding: '10px', backgroundColor: 'white'}}>
      <img width={300} height={300} src={url} alt="image"/>
    </div>
  );
}