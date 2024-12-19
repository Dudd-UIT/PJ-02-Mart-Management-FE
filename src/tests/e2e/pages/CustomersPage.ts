//src/tests/e2e/pages/CustomersPage.ts
class CustomersPage {
 
    getSelectSearchType(){
        return  cy.get('select[aria-label="Chọn loại tìm kiếm"]')
    }
    getInputSearch(){
      return  cy.get('input[placeholder^="Nhập"]')
    }
 
     getButtonSearch(){
       return cy.get('input[placeholder^="Nhập"]').parent().find('button')
     }
     getCreateButton(){
      return  cy.contains('button','Thêm')
     }
    // Table
     getCustomerTable(){
      return  cy.get('table')
     }
     getPagination(){
       return cy.get('.pagination')
     }
 
   //Modal
   openCreateModal(){
      this.getCreateButton().click()
      cy.get('.modal-dialog').should('be.visible')
   }
      
   //create Modal
 
    getCreateCustomerModal(){
      return cy.get('.modal-dialog')
    }
 
    getInputCreateModalByName() {
      return cy.get('.modal-dialog input[id="Tên khách hàng"]')
    }
      
     getInputCreateModalByPhone(){
      return cy.get('.modal-dialog input[id="Số điện thoại"]')
    }
          
    getButtonCancelCreateModal(){
      return cy.get('.modal-dialog').contains('button', 'Thoát');
    }
      
    getButtonSaveCreateModal() {
        return  cy.get('.modal-dialog').contains('button', 'Lưu')
    }
  // Edit
  openUpdateModal(nameCustomer:string){
      this.getCustomerTable()
        .contains('td', nameCustomer)
        .parent('tr')
         .find('button')
           .first()
              .click()
            
  }
 
   getUpdateCustomerModal(){
     return cy.get('.modal-dialog');
  }
 
 
  getInputUpdateModalByName(){
    return cy.get('.modal-dialog input[id="Tên khách hàng"]')
  }
  
    getInputUpdateModalByPhone(){
      return cy.get('.modal-dialog input[id="Số điện thoại"]')
   }
 
      
    getButtonCancelUpdateModal(){
    return this.getUpdateCustomerModal().contains('button','Thoát')
  }
   
      
    getButtonSaveUpdateModal(){
      return   this.getUpdateCustomerModal().contains('button', 'Lưu')
      }
 
  openDeleteModal(nameCustomer: string){
   this.getCustomerTable()
    .contains('td', nameCustomer)
    .parent('tr')
     .find('button')
       .eq(1)
          .click();
 
   
  }
 
    getDeleteModal() {
    return  cy.get('.modal-dialog');
   }
 
      getButtonCancelDeleteModal() {
           return   this.getDeleteModal().contains('button', 'Hủy')
        }
 
  getButtonAgreeDeleteModal() {
          return  this.getDeleteModal().contains('button', 'Đồng ý')
       }
       assertToastSuccess(message:string){
              cy.get('.Toastify__toast--success',{ timeout: 5000})
                 .should('include.text', message)
        }
 
      assertToastError(message:string){
         cy.get('.Toastify__toast--error',{timeout:5000})
          .should('include.text', message);
      }
 
 }
export default new CustomersPage()