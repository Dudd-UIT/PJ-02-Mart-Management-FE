import ProductTypePage from '../pages/ProductTypePage';
import LoginPage from '../pages/LoginPage';
import productTypeData from '../../fixtures/productType.json'
import users from '../../fixtures/user.json';
const productTypeValidData = productTypeData.validProductType
const productTypeInValidData = productTypeData.invalidProductType

describe('ProductType Page Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001/login');
        LoginPage.login(users.validUser.email, users.validUser.password);
        cy.get('h2', { timeout: 7000 }).contains("Quản lý nhà cung cấp") //wait text after login success
        cy.visit('http://localhost:3001/rule/product-type');
    });

    it('Should display product type page', ()=>{
        ProductTypePage.getInputSearch().should('be.visible');
        ProductTypePage.getCreateButton().should('be.visible');
        ProductTypePage.getProductTypeTable().should('be.visible');
        ProductTypePage.getPagination().should('be.visible')
    });

    it('Should create new product type success', ()=>{
        ProductTypePage.openCreateModal();
        ProductTypePage.getInputCreateModalByName().type(productTypeValidData.name);
        ProductTypePage.getButtonSaveCreateModal().click();
        ProductTypePage.assertToastSuccess('Tạo loại sản phẩm thành công');
    });

    it('Should not create new product type when data invalid', () => {
        ProductTypePage.openCreateModal()
        ProductTypePage.getButtonSaveCreateModal().click()
        ProductTypePage.assertToastError('name should not be empty');
    })

    it('Should open Update modal when click button edit on table', ()=>{
        const productName = "Đồ uống"
        ProductTypePage.openUpdateModal(productName);
        ProductTypePage.getUpdateProductTypeModal().should('be.visible')
        ProductTypePage.getButtonCancelUpdateModal().click();
    });

    it('Should open Delete modal when click button delete on table', () => {
        const productName = "Đồ uống"
        ProductTypePage.openDeleteModal(productName)
        ProductTypePage.getDeleteModal().should('be.visible')
        ProductTypePage.getButtonCancelDeleteModal().click();
    })
    
    it('Should update a product type success', () => {
        const productName = "Đồ uống" //search trước và tạo sau (logic test)
        const newProductName = "Đồ uống udpated"
        ProductTypePage.openUpdateModal(productName);
        ProductTypePage.getInputUpdateModalByName().clear().type(newProductName);
        ProductTypePage.getButtonSaveUpdateModal().click();
        ProductTypePage.assertToastSuccess('Cập nhật thông tin chi tiết loại sản phẩm thành công');
    });

    it('Should not update product type if invalid input (empty)', () => {
        const productName = 'Thực phẩm tươi sống';
        ProductTypePage.openUpdateModal(productName);
        ProductTypePage.getInputUpdateModalByName().clear();
        ProductTypePage.getButtonSaveUpdateModal().click();
        ProductTypePage.assertToastError("name should not be empty");
    });

    it('Should delete product type success', () => {
        const productName ="Thực phẩm khô";
        ProductTypePage.openDeleteModal(productName);
        ProductTypePage.getButtonAgreeDeleteModal().click();
        ProductTypePage.assertToastSuccess('Xóa dòng loại sản phẩm thành công');
    });

    it('Should not delete if click button Cancel delete', () => {
        const productName = "Đồ gia dụng"
        ProductTypePage.openDeleteModal(productName);
        ProductTypePage.getButtonCancelDeleteModal().click();
        cy.get('.modal-dialog').should('not.exist')
    })
});