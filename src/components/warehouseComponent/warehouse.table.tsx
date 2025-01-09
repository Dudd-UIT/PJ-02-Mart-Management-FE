import { WarehouseTableType } from '@/types/warehouse';
import BatchTable from './batches.table';

function WarehouseTable({
  product,
  batches,
  columnsBatch,
  level = 1,
  onMutate,
}: WarehouseTableType) {
  return (
    <div className="accordion" id="productTypeLevel">
      {level === 1 &&
        Object.entries(product).map(([typeName, productLines], typeIndex) => (
          <div className="accordion-item" key={`Type${typeIndex}`}>
            <h2 className="accordion-header" id={`headingType${typeIndex}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseType${typeIndex}`}
                aria-expanded="true"
                aria-controls={`collapseType${typeIndex}`}
              >
                {typeName}
              </button>
            </h2>
            <div
              id={`collapseType${typeIndex}`}
              className="accordion-collapse collapse"
              data-bs-parent="#productTypeLevel"
            >
              <div className="accordion-body">
                {renderProductLines(productLines, typeIndex)}
              </div>
            </div>
          </div>
        ))}

      {level === 2 &&
        Object.entries(product).flatMap(([_, productLines], typeIndex) =>
          renderProductLines(productLines, typeIndex),
        )}

      {level === 3 &&
        Object.entries(product).flatMap(([_, productLines], typeIndex) =>
          Object.entries(productLines).flatMap(
            ([_, productSamples], lineIndex) =>
              renderProductSamples(productSamples, typeIndex, lineIndex),
          ),
        )}
    </div>
  );

  function renderProductLines(
    productLines: Record<
      string,
      Record<
        string,
        { id: number; name: string; sellPrice: number; image: string }[]
      >
    >,
    typeIndex: number,
  ) {
    return (
      <div className="accordion" id="productLineLevel">
        {Object.entries(productLines).map(
          ([lineName, productSamples], lineIndex) => (
            <div
              className="accordion-item"
              key={`Type${typeIndex}Line${lineIndex}`}
            >
              <h2
                className="accordion-header"
                id={`headingType${typeIndex}Line${lineIndex}`}
              >
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseType${typeIndex}Line${lineIndex}`}
                  aria-expanded="true"
                  aria-controls={`collapseType${typeIndex}Line${lineIndex}`}
                >
                  {lineName}
                </button>
              </h2>
              <div
                id={`collapseType${typeIndex}Line${lineIndex}`}
                className="accordion-collapse collapse"
                data-bs-parent="#productLineLevel"
              >
                <div className="accordion-body">
                  {renderProductSamples(productSamples, typeIndex, lineIndex)}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  function renderProductSamples(
    productSamples: Record<
      string,
      { id: number; name: string; sellPrice: number; image: string }[]
    >,
    typeIndex: number,
    lineIndex: number,
  ) {
    return (
      <div className="accordion" id="productSampleLevel">
        {Object.entries(productSamples).map(
          ([sampleName, units], sampleIndex) => (
            <div
              className="accordion-item"
              key={`Type${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
            >
              <h2
                className="accordion-header"
                id={`headingType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
              >
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
                  aria-expanded="true"
                  aria-controls={`collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
                >
                  {sampleName}
                </button>
              </h2>
              <div
                id={`collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
                className="accordion-collapse collapse"
                data-bs-parent="#productSampleLevel"
              >
                <div className="accordion-body">
                  {renderProductUnits(units, typeIndex, lineIndex, sampleIndex)}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  function renderProductUnits(
    units: { id: number; name: string; sellPrice: number; image: string }[],
    typeIndex: number,
    lineIndex: number,
    sampleIndex: number,
  ) {
    return (
      <div className="accordion" id="productUnitLevel">
        {units.map((unit, unitIndex) => {
          const relatedBatches = batches.filter(
            (batch) => batch.uniqueUnitKey === `${unit.id}_${unit.name}`,
          );
          console.log('`${unit.id}_${unit.name}`', `${unit.id}_${unit.name}`);

          return (
            <div
              className="accordion-item"
              key={`Unit${unitIndex}`}
              id={`unit${unitIndex}`}
            >
              <h2 className="accordion-header" id={`headingUnit${unitIndex}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseUnit${unitIndex}`}
                  aria-expanded="true"
                  aria-controls={`collapseUnit${unitIndex}`}
                >
                  <strong>{unit.name}</strong> - {unit.sellPrice} VND
                </button>
              </h2>
              <div
                id={`collapseUnit${unitIndex}`}
                className="accordion-collapse collapse"
                data-bs-parent="#productUnitLevel"
              >
                <div className="accordion-body">
                  {relatedBatches.length > 0 ? (
                    <BatchTable
                      batches={relatedBatches}
                      columns={columnsBatch}
                      onMutate={onMutate}
                    />
                  ) : (
                    <table className="table">
                      <tbody>
                        <tr>
                          <td
                            colSpan={columnsBatch.length + 1}
                            className="text-center"
                            style={{ borderRadius: '0.375rem' }}
                          >
                            Không có dữ liệu
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default WarehouseTable;
