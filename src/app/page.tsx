'use client';

import { Input } from '@/components/commonComponent/InputForm';
import RowHighlight from '@/components/nullComponent/RowHighlight';
import { FaFilter } from 'react-icons/fa';

export default function Home() {
  return (
    //Trong layout đã bọc sẵn children vào container rồi nên không cần className="container" trong children nữa
    <div className="container">
      {/* Thêm ở đầu nếu có bảng có ô tick chọn */}
      <RowHighlight />
      {/* Multilevel list */}
      <div className="container">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Accordion Item #1
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="accordion" id="accordionExampleChild">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOneChild"
                        aria-expanded="true"
                        aria-controls="collapseOneChild"
                      >
                        Accordion Item #1
                      </button>
                    </h2>
                    <div
                      id="collapseOneChild"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExampleChild"
                    >
                      <div className="accordion-body">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">First</th>
                              <th scope="col">Last</th>
                              <th scope="col">Handle</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th scope="row">1</th>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                            <tr>
                              <th scope="row">2</th>
                              <td>Jacob</td>
                              <td>Thornton</td>
                              <td>@fat</td>
                            </tr>
                            <tr>
                              <th scope="row">3</th>
                              <td>Larry the Bird</td>
                              <td>Larry the Bird</td>
                              <td>@twitter</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwoChild"
                        aria-expanded="false"
                        aria-controls="collapseTwoChild"
                      >
                        Accordion Item #2
                      </button>
                    </h2>
                    <div
                      id="collapseTwoChild"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExampleChild"
                    >
                      <div className="accordion-body">
                        <strong>
                          This is the second item's accordion body.
                        </strong>{' '}
                        It is hidden by default, until the collapse plugin adds
                        the appropriate classes that we use to style each
                        element. These classes control the overall appearance,
                        as well as the showing and hiding via CSS transitions.
                        You can modify any of this with custom CSS or overriding
                        our default variables. It's also worth noting that just
                        about any HTML can go within the{' '}
                        <code>.accordion-body</code>, though the transition does
                        limit overflow.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThreeChild"
                        aria-expanded="false"
                        aria-controls="collapseThreeChild"
                      >
                        Accordion Item #3
                      </button>
                    </h2>
                    <div
                      id="collapseThreeChild"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExampleChild"
                    >
                      <div className="accordion-body">
                        <strong>
                          This is the third item's accordion body.
                        </strong>{' '}
                        It is hidden by default, until the collapse plugin adds
                        the appropriate classes that we use to style each
                        element. These classes control the overall appearance,
                        as well as the showing and hiding via CSS transitions.
                        You can modify any of this with custom CSS or overriding
                        our default variables. It's also worth noting that just
                        about any HTML can go within the{' '}
                        <code>.accordion-body</code>, though the transition does
                        limit overflow.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Accordion Item #2
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{' '}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Accordion Item #3
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{' '}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table bình thường */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry the Bird</td>
            <td>Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
      {/* Table có tick chọn */}
      <table className="table table-responsive table-hover">
        <thead>
          <tr className="bg-light">
            <th scope="col">
              {/* <input className="form-check-input" type="checkbox" /> */}
            </th>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Customer</th>
            <th scope="col">Purchased</th>
            <th scope="col" className="text-end">
              <span>Revenue</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <input className="form-check-input" type="checkbox" />
            </th>
            <td>12</td>
            <td>1 Oct, 21</td>
            <td>
              <i className="fa fa-check-circle-o green"></i>
              <span className="ms-1">Paid</span>
            </td>
            <td>
              <img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Althan
              Travis
            </td>
            <td>Wirecard for figma</td>
            <td className="text-end">
              <span className="fw-bolder">$0.99</span>{' '}
              <i className="fa fa-ellipsis-h  ms-2"></i>
            </td>
          </tr>

          <tr>
            <th scope="row">
              <input className="form-check-input" type="checkbox" />
            </th>
            <td>14</td>
            <td>12 Oct, 21</td>
            <td>
              <i className="fa fa-dot-circle-o text-danger"></i>
              <span className="ms-1">Failed</span>
            </td>
            <td>
              <img src="https://i.imgur.com/nmnmfGv.png" width="25" /> Tomo
              arvis
            </td>
            <td>Altroz furry</td>
            <td className="text-end">
              <span className="fw-bolder">$0.19</span>{' '}
              <i className="fa fa-ellipsis-h  ms-2"></i>
            </td>
          </tr>

          <tr>
            <th scope="row">
              <input className="form-check-input" type="checkbox" />
            </th>
            <td>17</td>
            <td>1 Nov, 21</td>
            <td>
              <i className="fa fa-check-circle-o green"></i>
              <span className="ms-1">Paid</span>
            </td>
            <td>
              <img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Althan
              Travis
            </td>
            <td>Apple Macbook air</td>
            <td className="text-end">
              <span className="fw-bolder">$1.99</span>{' '}
              <i className="fa fa-ellipsis-h  ms-2"></i>
            </td>
          </tr>

          <tr>
            <th scope="row">
              <input className="form-check-input" type="checkbox" />
            </th>
            <td>90</td>
            <td>19 Oct, 21</td>
            <td>
              <i className="fa fa-check-circle-o green"></i>
              <span className="ms-1">Paid</span>
            </td>
            <td>
              <img src="https://i.imgur.com/VKOeFyS.png" width="25" /> Travis
              head
            </td>
            <td>Apple Macbook Pro</td>
            <td className="text-end">
              <span className="fw-bolder">$9.99</span>{' '}
              <i className="fa fa-ellipsis-h  ms-2"></i>
            </td>
          </tr>

          <tr>
            <th scope="row">
              <input className="form-check-input" type="checkbox" />
            </th>
            <td>12</td>
            <td>1 Oct, 21</td>
            <td>
              <i className="fa fa-check-circle-o green"></i>
              <span className="ms-1">Paid</span>
            </td>
            <td>
              <img src="https://i.imgur.com/nmnmfGv.png" width="25" /> Althan
              Travis
            </td>
            <td>Wirecard for figma</td>
            <td className="text-end">
              <span className="fw-bolder">$0.99</span>{' '}
              <i className="fa fa-ellipsis-h  ms-2"></i>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Input */}
      <Input title="Tìm kiếm" size={2} onChange={() => {}} />
      <Input
        title="Readonly"
        size={3}
        readOnly={true}
        required={true}
        onChange={() => {}}
      />
      <Input
        title="Tìm kiếm"
        size={4}
        onChange={() => {}}
        valid="success"
        options={['1', '2', '3']}
        placeholder="Select"
      />
      <Input
        title="Tìm kiếm"
        size={5}
        onChange={() => {}}
        valid="error"
        icon={<FaFilter />}
      />
    </div>
  );
}
