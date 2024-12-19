import { StatisticsCardProps } from '@/types/commonType';

function Card(props: StatisticsCardProps) {
  function formatCurrency(value: number) {
    if (value < 1000000) {
      return value.toLocaleString('vi-VN');
    } else if (value < 1000000000) {
      const millions = (value / 1000000).toFixed(1);
      return `${millions}M`;
    } else {
      const billions = (value / 1000000000).toFixed(1);
      return `${billions}B`;
    }
  }

  const { title, data, unit } = props;
  return (
    <div className="col col-md-4">
      <button className="btn btn-outline w-75 ">
        <h4 className="text-start">{title}</h4>
        <h1 className="text-start fw-bold" style={{ display: 'inline' }}>
          {typeof data === 'string'
            ? data
            : typeof data === 'number'
            ? formatCurrency(data)
            : '0'}{' '}
        </h1>
        <h5 style={{ display: 'inline' }}>{unit}</h5>
      </button>
    </div>
  );
}

export default Card;
