import { StaticCardProps } from "@/types/commonType";

function Card(props: StaticCardProps) {
  const {title, data} = props
  return (
    <div className="col col-md-4">
      <button className="btn btn-outline w-75 ">
        <h4 className="text-start">{title}</h4>
        <h1 className="text-start fw-bold">{data?.toLocaleString('vi-VN')}</h1>
      </button>
    </div>
  );
}

export default Card;
