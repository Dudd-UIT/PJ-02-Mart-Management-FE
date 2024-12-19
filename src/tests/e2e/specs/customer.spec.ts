// src/tests/e2e/specs/customer.spec.ts
import CustomersPage from "../pages/CustomersPage";
import LoginPage from "../pages/LoginPage"; // Import LoginPage
import customerData from '../../fixtures/customer.json';
import users from '../../fixtures/user.json';


const customerValidData = customerData.validCustomer;
const customerInValidData = customerData.invalidCustomer;

describe('Customer Page Test', () => {

    beforeEach(() => {
        cy.intercept('GET', '/suppliers*').as('suppliers'); //intercept request '/suppliers' và alias lại nó

        cy.visit('http://localhost:3001/login'); // Visit the login page first
        LoginPage.login(users.validUser.email, users.validUser.password);

        cy.wait('@suppliers'); //wait the api '/suppliers' is successfull

        //After success login go to customers page
        cy.visit('http://localhost:3001/customers');
       
     });

    it('Should display customer page', () => {
      CustomersPage.getInputSearch().should('be.visible');
      CustomersPage.getCreateButton().should('be.visible');
      CustomersPage.getCustomerTable().should('be.visible');
      CustomersPage.getPagination().should('be.visible')
    });
   
    it('Should create new customer success', () => {
      CustomersPage.openCreateModal();
      CustomersPage.getCreateCustomerModal().should('be.visible');
      CustomersPage.getInputCreateModalByName().type(customerValidData.name);
      CustomersPage.getInputCreateModalByPhone().type(customerValidData.phone);
      CustomersPage.getButtonSaveCreateModal().click();
      CustomersPage.assertToastSuccess("Tạo mới khách hàng thành công");
    });

    it('Should not create new customer with invalid name and phone', () => {
      CustomersPage.openCreateModal();
      CustomersPage.getButtonSaveCreateModal().click();
      CustomersPage.assertToastError("name should not be empty, phone should not be empty");
    });
    
    it('Should open Update modal when click button edit on table', () => {
       const customerName = 'Khách hàng test 2'
         CustomersPage.openUpdateModal(customerName);
         CustomersPage.getUpdateCustomerModal().should('be.visible');
         CustomersPage.getButtonCancelUpdateModal().click();
    });
     
    it('Should open Delete modal when click button delete on table', () => {
      const customerName = 'Khách hàng test 2';
      CustomersPage.openDeleteModal(customerName);
      CustomersPage.getDeleteModal().should('be.visible');
      CustomersPage.getButtonCancelDeleteModal().click();
    });

    it('Should update a customer success', () => {
      const customerName = "Lê Văn Khách"
      const updateName = "Khách hàng update 1";
      const updatePhone = "0909090911"
      CustomersPage.openUpdateModal(customerName)
      CustomersPage.getInputUpdateModalByName().clear().type(updateName);
      CustomersPage.getInputUpdateModalByPhone().clear().type(updatePhone);
      CustomersPage.getButtonSaveUpdateModal().click();
      CustomersPage.assertToastSuccess("Cập nhật thông tin chi tiết khách hàng thành công");
    });

    it('Should delete customer success', () => {
      const customerName = "Khách hàng test 4";
      CustomersPage.openDeleteModal(customerName)
      CustomersPage.getButtonAgreeDeleteModal().click();
      CustomersPage.assertToastSuccess("Xóa người dùng thành công")
    })
});