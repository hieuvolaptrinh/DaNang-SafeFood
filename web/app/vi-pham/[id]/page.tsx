export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  return <div>Chi tiết vi phạm {id}</div>;
}
