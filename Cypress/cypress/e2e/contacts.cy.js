/// <reference types="cypress" />

describe('Тести додатка Contacts', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  const addContact = (name, phone) => {
    cy.get('[data-testid=name-input]').type(name);
    cy.get('[data-testid=phone-input]').type(phone);
    cy.get('[data-testid=add-button]').click();
  };

  it('Додає новий контакт', () => {
    const newContact = { name: 'Олександр Петров', phone: '111-222-3333' };
    addContact(newContact.name, newContact.phone);
    
    cy.get('[data-testid=contacts-list] li')
      .should('contain', newContact.name)
      .and('contain', newContact.phone);
  });

  it('Редагує існуючий контакт', () => {
    addContact('Олександр Петров', '111-222-3333');
    
    const editedContact = { name: 'Наталія Сидорова', phone: '999-888-7777' };
    cy.get('[data-testid=contacts-list] li:first-child [data-testid=edit-button]').click();

    cy.get('[data-testid=name-input]').clear().type(editedContact.name);
    cy.get('[data-testid=phone-input]').clear().type(editedContact.phone);
    cy.get('[data-testid=save-button]').click();

    cy.get('[data-testid=contacts-list] li:first-child')
      .should('contain', editedContact.name)
      .and('contain', editedContact.phone);
  });

  it('Видаляє контакт', () => {
    addContact('Олександр Петров', '111-222-3333');
    
    cy.get('[data-testid=contacts-list] li:first-child')
      .invoke('text')
      .then((contactName) => {
        cy.get('[data-testid=contacts-list] li:first-child [data-testid=delete-button]').click();
        cy.get('[data-testid=contacts-list]').should('not.contain', contactName.trim());
      });
  });

  it('Сортує контакти за ім’ям', () => {
    const contacts = [
      { name: 'Дмитро Бондар', phone: '555-123-4567' },
      { name: 'Катерина Лисенко', phone: '555-987-6543' },
      { name: 'Максим Ткаченко', phone: '555-555-5555' },
    ];
    contacts.forEach(({ name, phone }) => addContact(name, phone));

    cy.get('[data-testid=sort-button]').click();

    cy.get('[data-testid=contacts-list] li').then(($list) => {
      const names = Cypress._.map($list, (el) => el.innerText.split('\n')[0].trim());
      expect(names).to.deep.equal([...names].sort());
    });
  });
});
