import { Batch, SelectBatchModalProps } from '@/types/batch';
import {
  ProductUnitTransform,
  SelectedProductUnitTableProps,
} from '@/types/productUnit';
import { formatCurrencyLong } from '@/utils/format';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function SelectBatchModal(props: SelectBatchModalProps) {
  const { isModalOpen, onCloseModal, onSelectBatch, columns, batches } = props;

  return (
    <>
      <Modal show={isModalOpen} onHide={onCloseModal} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn lô hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <table className="table table-hover">
              <thead>
                <tr>
                  {columns?.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="text-center align-middle"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batches?.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="text-center align-middle"
                    onClick={() => onSelectBatch(row)}
                  >
                    {columns.map((column, colIndex) => {
                      const cellData = row[column.key as keyof Batch];

                      if (
                        column.key === 'expiredAt' &&
                        typeof cellData === 'string'
                      ) {
                        return (
                          <td key={colIndex}>
                            {new Date(cellData).toLocaleDateString('vi-VN')}
                          </td>
                        );
                      }
                      if (
                        column.key === 'discount' &&
                        typeof cellData === 'string'
                      ) {
                        return <td key={colIndex}>{`${+cellData * 100} %`}</td>;
                      }

                      if (typeof cellData === 'object') {
                        return <td key={colIndex}>{`Batches: ${cellData}`}</td>;
                      }

                      return <td key={colIndex}>{cellData}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseModal}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SelectBatchModal;
