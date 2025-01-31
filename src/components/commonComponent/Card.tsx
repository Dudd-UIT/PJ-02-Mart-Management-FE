import { StatisticsCardProps } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';

export function Card(props: StatisticsCardProps) {
  const { title, data, unit, size } = props;

  return (
    <div className={size ?  `col col-md-${size}` : `col col-md-4`}>
      <div className="stat-card w-75 ">
        <h4 className="text-start">{title}</h4>
        <h1 className="text-start fw-bold" style={{ display: 'inline' }}>
          {typeof data === 'string'
            ? data
            : typeof data === 'number'
            ? formatCurrency(data)
            : '0'}{' '}
        </h1>
        <h5 style={{ display: 'inline' }}>{unit}</h5>
      </div>
    </div>
  );
}

export function CardSmall(props: StatisticsCardProps) {
  const { title, data, unit } = props;
  return (
    <div className="col col-md-5">
      <div className="stat-card w-100 ">
        <h6 className="text-start">{title}</h6>
        <h3 className="text-start fw-bold" style={{ display: 'inline' }}>
          {typeof data === 'string'
            ? data
            : typeof data === 'number'
            ? formatCurrency(data)
            : '0'}{' '}
        </h3>
        <p style={{ display: 'inline' }}>{unit}</p>
      </div>
    </div>
  );
}
