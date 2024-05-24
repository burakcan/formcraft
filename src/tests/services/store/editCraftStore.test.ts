import { describe, it, expect, jest } from '@jest/globals';
import { createEditCraftStore } from '@/services/store/editCraftStore';

describe('editCraftStore', () => {
  const initialState = {
    craft: { id: 'craftId', title: 'Test Craft', userId: 'userId', organizationId: null, createdAt: new Date(), updatedAt: new Date(), archivedAt: null },
    editingVersion: { id: 'versionId', craftId: 'craftId', data: { pages: [], end_pages: [], flow: { nodes: [], edges: [] } }, createdAt: new Date(), updatedAt: new Date() },
    selectedPageId: '',
  };

  it('should initialize store with initial state', () => {
    const store = createEditCraftStore(initialState);
    expect(store.getState()).toEqual(initialState);
  });

  it('should set craft correctly', () => {
    const store = createEditCraftStore(initialState);
    const newCraft = { ...initialState.craft, title: 'Updated Craft' };
    store.getState().setCraft(newCraft);
    expect(store.getState().craft).toEqual(newCraft);
  });

  it('should set editing version correctly', () => {
    const store = createEditCraftStore(initialState);
    const newVersion = { ...initialState.editingVersion, id: 'newVersionId' };
    store.getState().setEditingVersion(newVersion);
    expect(store.getState().editingVersion).toEqual(newVersion);
  });

  it('should add a new page correctly', () => {
    const store = createEditCraftStore(initialState);
    const newPage = { id: 'newPageId', type: 'text', title: 'New Page', variableName: 'newPage', content: 'This is a new page' };
    store.getState().addPage(newPage);
    expect(store.getState().editingVersion.data.pages).toContainEqual(newPage);
  });

  it('should remove a page correctly', () => {
    const store = createEditCraftStore(initialState);
    const pageToRemove = { id: 'pageToRemoveId', type: 'text', title: 'Page to Remove', variableName: 'pageToRemove', content: 'This page will be removed' };
    store.getState().addPage(pageToRemove);
    store.getState().removePage(pageToRemove.id);
    expect(store.getState().editingVersion.data.pages).not.toContainEqual(pageToRemove);
  });

  it('should edit a page correctly', () => {
    const store = createEditCraftStore(initialState);
    const pageToEdit = { id: 'pageToEditId', type: 'text', title: 'Page to Edit', variableName: 'pageToEdit', content: 'This page will be edited' };
    store.getState().addPage(pageToEdit);
    const updatedPage = { ...pageToEdit, content: 'This page has been edited' };
    store.getState().editPage(pageToEdit.id, updatedPage);
    expect(store.getState().editingVersion.data.pages).toContainEqual(updatedPage);
  });

  it('should set selected page correctly', () => {
    const store = createEditCraftStore(initialState);
    const pageId = 'selectedPageId';
    store.getState().setSelectedPage(pageId);
    expect(store.getState().selectedPageId).toEqual(pageId);
  });

  // Additional tests for each action in the store can be added here
});
