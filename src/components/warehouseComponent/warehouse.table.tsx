import { WarehouseTableType } from '@/types/warehouse';
import { FaEye } from 'react-icons/fa6';
import { HiOutlineTrash } from 'react-icons/hi2';
import BatchTable from './batches.table';

function WarehouseTable({ product, batches, columnsBatch, level = 1 }: WarehouseTableType) {
  
  return (
    <div className="accordion" id="productTypeLevel">
      {level === 1 && Object.entries(product).map(([typeName, productLines], typeIndex) => (
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

      {level === 2 && Object.entries(product).flatMap(([_, productLines], typeIndex) =>
        renderProductLines(productLines, typeIndex)
      )}

      {level === 3 && Object.entries(product).flatMap(([_, productLines], typeIndex) =>
        Object.entries(productLines).flatMap(([_, productSamples], lineIndex) =>
          renderProductSamples(productSamples, typeIndex, lineIndex)
        )
      )}
    </div>
  );

  function renderProductLines(productLines: Record<string, { name: string }[]>, typeIndex: number) {
    return (
      <div className="accordion" id="productLineLevel">
        {Object.entries(productLines).map(([lineName, productSamples], lineIndex) => (
          <div className="accordion-item" key={`Type${typeIndex}Line${lineIndex}`}>
            <h2 className="accordion-header" id={`headingType${typeIndex}Line${lineIndex}`}>
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
        ))}
      </div>
    );
  }

  function renderProductSamples(productSamples: { name: string }[], typeIndex: number, lineIndex: number) {
    return (
      <div className="accordion" id="productSampleLevel">
        {productSamples.map((sample, sampleIndex) => (
          <div className="accordion-item" key={`Type${typeIndex}Line${lineIndex}Sample${sampleIndex}`}>
            <h2 className="accordion-header" id={`headingType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
                aria-expanded="true"
                aria-controls={`collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
              >
                {sample.name}
              </button>
            </h2>
            <div
              id={`collapseType${typeIndex}Line${lineIndex}Sample${sampleIndex}`}
              className="accordion-collapse collapse"
              data-bs-parent="#productSampleLevel"
            >
              <div className="accordion-body">
                {batches.filter(batch => batch.productSample === sample.name).length > 0 ? (
                  batches.filter(batch => batch.productSample === sample.name).map((filteredBatch, batchIndex) => (
                    <BatchTable
                      key={`BatchTable${batchIndex}`}
                      batches={[filteredBatch]}
                      columns={columnsBatch}
                      onMutate={() => {}}
                    />
                  ))
                ) : (
                  <table className="table">
                    <tbody>
                      <tr>
                        <td colSpan={columnsBatch.length + 1} className="text-center" style={{ borderRadius: '0.375rem' }}>
                          No data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default WarehouseTable;
