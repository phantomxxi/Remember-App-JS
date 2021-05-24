//Hide lists, hide remember form, if name in LS - show list form and grab stuff from LS
document.addEventListener("DOMContentLoaded", function(event) {
 UICtrl.hideListForm();
 UICtrl.hideItemList();
 UICtrl.hideCompletedItemList();
 UICtrl.hideStartOverBtn();
 const name = localStorage.getItem('name');
 if(name !== null){
   UICtrl.updateName(name);
   UICtrl.hideNameForm();
   UICtrl.showListForm();
   UICtrl.hideUpdateItemBtn();
   UICtrl.showStartOverBtn();
   getEverythingFromStorage();
 }
 });

//Grab everything from LS to display it
function getEverythingFromStorage(){
  const items = ItemCtrl.getItems();
  const completedItems = ItemCtrl.getCompletedItems();

  if (items.length > 0){
    UICtrl.populateItemList(items);
    UICtrl.showListItems();
  } else {
    UICtrl.hideItemList();
  }

  if (completedItems.length > 0) {
    UICtrl.populateCompleteItemsList(completedItems);
    UICtrl.showCompletedListItems();
  } else {
    UICtrl.hideCompletedItemList();
  }
}

//Local Storage Controller
const StorageCtrl = (function(){
  return {
    storeName: function(name){
      localStorage.setItem('name', name);
    },
    storeItem: function(item){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item)
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    addCompletedItemToStorage(item){
      let completedItems;
      if(localStorage.getItem('completedItems') === null){
        completedItems = [];
        completedItems.push(item)
        localStorage.setItem('completedItems', JSON.stringify(completedItems));
      } else {
        completedItems = JSON.parse(localStorage.getItem('completedItems'));
        completedItems.push(item);
        localStorage.setItem('completedItems', JSON.stringify(completedItems));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    getCompletedItemsFromStorage: function(){
      let completedItems;
      if(localStorage.getItem('completedItems') === null){
        completedItems = [];
      } else {
        completedItems = JSON.parse(localStorage.getItem('completedItems'));
      }
      return completedItems;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteCompletedItemFromStorage: function(id){
      let completedItems = JSON.parse(localStorage.getItem('completedItems'));
      completedItems.forEach(function(item, index){
        if(id === item.id){
          completedItems.splice(index, 1);
        }
      });
      localStorage.setItem('completedItems', JSON.stringify(completedItems));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    },
    clearCompletedItemsFromStorage: function(){
      localStorage.removeItem('completedItems');
    }
  }
})();


//Item Controller
const ItemCtrl = (function(){

  const Item = function(name, id){
    this.id = id;
    this.name = name;
  }

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    completedItems: StorageCtrl.getCompletedItemsFromStorage(),
    currentItem: null,
  }

  return {
    getItems: function(){
      return data.items;
    },
    getCompletedItems: function(){
      return data.completedItems;
    },
    addItem: function(name){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      newItem = new Item(name, ID);
      data.items.push(newItem);
      return newItem;
    },
    addCompletedItem: function(item){
      const completedItem = ItemCtrl.getItemById(item.id)
      data.completedItems.push(completedItem);
      return completedItem;
    },
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    getCompletedItemById: function(id){
      let found = null;
      data.completedItems.forEach(function(item){
        if(item.id === id){
        found = item;
      }
    });
      return found;
    },
    updateItem: function(name){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    deleteItem: function(id){
      const ids = data.items.map(function(item){
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    deleteCompletedItem: function(id){
      const ids = data.completedItems.map(function(item){
        return item.id;
      });
      const index = ids.indexOf(id);
      data.completedItems.splice(index, 1)
    },
    clearAllItems: function(){
      data.items = [];
      localStorage.removeItem('items');
    },
    clearCompletedItems: function(){
      data.completedItems = [];
    },
    getItemIdFromDom: function(e){
      const listId = e.target.parentNode.parentNode.id
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      return id;
    }
  }
})();


//UI Controller
const UICtrl = (function(){

  const UISelectors = {
    name: '#name',
    nameBtn: '.name-btn',
    title: '.title',
    nameForm: '#name-form',
    listForm: '#list-form',
    itemList: '#item-list',
    listItems: '#item-list li',
    listGroup: '.item-list',
    rememberBtn: '.remember-btn',
    editBtn: '.edit-item',
    updateBtn: '.update-btn',
    checkBtn: '.complete-item',
    itemInputField: '#item',
    completeListGroup: '.complete-item-list',
    completeItemList: '#complete-item-list',
    clearRememberBtn: '.clear-remember',
    clearCompletedBtn: '.clear-completed',
    startOver: '.sign-out'
  }

//public methods
  return {
    getSelectors: function(){
      return UISelectors;
    },
    getNameInput: function(){
      const name = document.querySelector(UISelectors.name).value;
      return name;
    },
    getItemInput: function(){
      const item = document.querySelector(UISelectors.itemInputField).value;
      return item;
    },
    updateName: function(name){
      document.querySelector('.fa-user').style.display = 'none';
      document.querySelector(UISelectors.title).innerHTML = `<h1 class="animated zoomIn delay-3s">hello ${name}!<br>what do you need to remember?</h1><h1 class="animated bounceIn delay-4s"><i class="fa fa-bell" aria-hidden="true"></i></h1>`;
    },
    //hide name form
    hideNameForm: function(){
      document.querySelector(UISelectors.nameForm).style.display = 'none';
    },
    //show remember! form
    showListForm: function(){
      document.querySelector(UISelectors.listForm).style.display = 'block';
    },
    //hide remember! form
    hideListForm: function(){
      document.querySelector(UISelectors.listForm).style.display = 'none';
    },
    //hide update button
    hideUpdateItemBtn: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
    },
    //show list of items
    showListItems: function(){
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    //hide list of items
    hideItemList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    //show list of completed items
    showCompletedListItems: function(){
      document.querySelector(UISelectors.completeItemList).style.display = 'block';
      document.querySelector(UISelectors.completeListGroup).style.display = 'block';
    },
    //hide list of completed items
    hideCompletedItemList: function(){
      document.querySelector(UISelectors.completeItemList).style.display = 'none';
      document.querySelector(UISelectors.completeListGroup).style.display = 'none';
    },
    //show start over button
    showStartOverBtn: function(){
      document.querySelector(UISelectors.startOver).style.display = 'block';
    },
    //hide start over button
    hideStartOverBtn: function(){
      document.querySelector(UISelectors.startOver).style.display = 'none';
    },
    //reset name form on clear all button
    resetRememberForm: function(){
      document.querySelector(UISelectors.rememberBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.itemInputField).style.display = 'inline-block';
    },
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `
          <li class="list-group-item remember-list-item" id="item-${item.id}">${item.name}
          <a href="#" class="secondary-content">
            <i class="delete-item fa fa-trash"></i>
          </a>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          <a href="#" class="secondary-content">
            <i class="complete-item fa fa-check"></i>
          </a>
          </li>`;
     });
     // Insert list items
     document.querySelector(UISelectors.listGroup).innerHTML = html;
   },
   populateCompleteItemsList: function(completedItems){
     let html = '';
     completedItems.forEach(function(item){
       html += `
         <li class="list-group-item animated slideInDown delay-2s completed-list-item" id="item-${item.id}">${item.name}
         <a href="#" class="secondary-content">
           <i class="delete-completed-item fa fa-trash"></i>
         </a>
         </li>`;
    });
    document.querySelector(UISelectors.completeListGroup).innerHTML = html;
    },
   updateListItem: function(item){
     let listItems = document.querySelectorAll(UISelectors.listItems);

     // Turn Node list into array
     listItems = Array.from(listItems);

     listItems.forEach(function(listItem){
       const itemID = listItem.getAttribute('id');
       if(itemID === `item-${item.id}`){
         document.querySelector(`#${itemID}`).innerHTML = `
         ${item.name}
         <a href="#" class="secondary-content">
           <i class="delete-item fa fa-trash"></i>
         </a>
         <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
         </a>
         <a href="#" class="secondary-content">
           <i class="complete-item fa fa-check"></i>
         </a>
         </li>`;
       }
     });
   },
   addItemToForm: function(){
    document.querySelector(UISelectors.itemInputField).value = ItemCtrl.getCurrentItem().name;
    UICtrl.showEditState();
  },
  showEditState: function(){
    document.querySelector(UISelectors.editBtn).style.display = 'inline';
    document.querySelector(UISelectors.checkBtn).style.display = 'inline';
    document.querySelector(UISelectors.rememberBtn).style.display = 'none';
    document.querySelector(UISelectors.updateBtn).style.display = 'inline';
    document.querySelector(UISelectors.updateBtn).classList.add('btn-success');
  },
  clearInput: function(){
    document.querySelector(UISelectors.itemInputField).value = '';
    document.querySelector(UISelectors.itemInputField).value = '';
  },
  clearEditState: function(){
    UICtrl.clearInput();
    this.clearInput();
    document.querySelector(UISelectors.itemInputField).style.border = "none";
    document.querySelector(UISelectors.itemInputField).style.color = "#4e2e6b";
    document.querySelector(UISelectors.updateBtn).style.display = 'none';
    document.querySelector(UISelectors.editBtn).style.display = 'inline';
    document.querySelector(UISelectors.checkBtn).style.display = 'inline';
    document.querySelector(UISelectors.rememberBtn).style.display = 'inline';
    document.querySelector(UISelectors.updateBtn).classList.remove('btn-success');
  },
  displayItemListIfItems: function(){
    const items = ItemCtrl.getItems();
    if (items.length > 0){
      UICtrl.populateItemList(items);
      UICtrl.showListItems();
    } else {
      UICtrl.hideItemList();
    }
  },
  displayCompletedItemsIfItems: function(){
    const completedItems = ItemCtrl.getCompletedItems();
    if (completedItems.length > 0){
      UICtrl.populateCompleteItemsList(completedItems);
      UICtrl.showCompletedListItems();
    } else {
      UICtrl.hideCompletedItemList();
    }
  },
  redisplayNameForm: function(){
    document.querySelector(UISelectors.nameForm).style.display = 'block';
    document.querySelector(UISelectors.itemInputField).style.display = 'none';
    document.querySelector(UISelectors.rememberBtn).style.display = 'none';
    document.querySelector(UISelectors.title).innerHTML = `<h1 class="animated zoomIn delay-3s">hello again...what was your name?</h1><h1 class="animated bounceIn delay-4s"><i class="fa fa-bell" aria-hidden="true"></i></h1>`;
  },
}
})();


// App Controller
const App = (function(UICtrl, ItemCtrl, StorageCtrl){
  // Load event listeners
  const loadEventListeners = function(){
    //Disable use of enter button
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Display greeting event
    document.querySelector(UISelectors.nameBtn).addEventListener('click', displayGreeting);

    //Add Item Event
    document.querySelector(UISelectors.rememberBtn).addEventListener('click', addItem);

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', editItemClick);

    //Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItem);

    //Delete icon click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', deleteItemClick);

    //Mark item as complete
    document.querySelector(UISelectors.itemList).addEventListener('click', completeItem);

    //Edit completed item
    document.querySelector(UISelectors.completeItemList).addEventListener('click', deleteCompletedItem);

    //Clear all buttons
    document.querySelector(UISelectors.clearRememberBtn).addEventListener('click', clearRememberList);
    document.querySelector(UISelectors.clearCompletedBtn).addEventListener('click', clearCompletedList);
    document.querySelector(UISelectors.startOver).addEventListener('click', clearEverythingFromStorage);
  }

  //Display greeting to user, hide/show forms
  const displayGreeting = function(e){
    e.preventDefault();
    let name = UICtrl.getNameInput();
    UICtrl.updateName(name);
    StorageCtrl.storeName(name);
    UICtrl.hideNameForm();
    UICtrl.showListForm();
    UICtrl.hideUpdateItemBtn();
    UICtrl.hideItemList();
    UICtrl.showStartOverBtn();
    if(localStorage.getItem('name') !== null){
      UICtrl.resetRememberForm();
    }
  }

  //Add item to item list
  const addItem = function(e){
    const item = UICtrl.getItemInput();
    const newItem = ItemCtrl.addItem(item);
    StorageCtrl.storeItem(newItem);
    const items = ItemCtrl.getItems();
    UICtrl.populateItemList(items);
    UICtrl.showListItems();
    UICtrl.clearInput();
    e.preventDefault();
  }

  const editItemClick = function(e){
    if(e.target.classList.contains('edit-item')){
      const id = ItemCtrl.getItemIdFromDom(e);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  //Edit item
  const updateItem = function(e){
    e.preventDefault();
    const item = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(item);
    UICtrl.updateListItem(updatedItem);
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    e.preventDefault();
  }

  //Delete item
  const deleteItemClick = function(e){
    e.preventDefault();
    if(e.target.classList.contains('delete-item')){
      window.confirm("Are you sure?");
      const id = ItemCtrl.getItemIdFromDom(e);
      const itemToDelete = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToDelete);
      ItemCtrl.deleteItem(itemToDelete.id);
      StorageCtrl.deleteItemFromStorage(itemToDelete.id);
      UICtrl.displayItemListIfItems();
    }
  }

  //Mark item as complete
  const completeItem = function(e){
    if(e.target.classList.contains('complete-item')){
      const id = ItemCtrl.getItemIdFromDom(e);
      const item = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(item);
      //add item to completed item list
      ItemCtrl.addCompletedItem(item);
      StorageCtrl.addCompletedItemToStorage(item);
      //delete item from Items data structure & LS
      const itemToDelete = ItemCtrl.getCurrentItem();
      ItemCtrl.deleteItem(itemToDelete.id);
      StorageCtrl.deleteItemFromStorage(itemToDelete.id);
      //redisplay item list
      UICtrl.displayItemListIfItems();
      //redisplay completed item list
      UICtrl.displayCompletedItemsIfItems();
    }
    e.preventDefault();
  }

  //Delete completed item
  const deleteCompletedItem = function(e){
    if (e.target.classList.contains('delete-completed-item')){
      window.confirm("Are you sure?");
      const id = ItemCtrl.getItemIdFromDom(e);
      const item = ItemCtrl.getCompletedItemById(id);
      ItemCtrl.setCurrentItem(item);
      const itemToDelete = ItemCtrl.getCurrentItem();
      ItemCtrl.deleteCompletedItem(itemToDelete.id);
      StorageCtrl.deleteCompletedItemFromStorage(itemToDelete.id);
      //redisplay completed item list
      UICtrl.displayCompletedItemsIfItems();
    }
    e.preventDefault();
  }

  //Clear list of things to remember
  const clearRememberList = function(e){
    e.preventDefault();
    window.confirm("Are you sure?");
    ItemCtrl.clearAllItems();
    UICtrl.hideItemList();
    StorageCtrl.clearItemsFromStorage();
  }

  //Clear list of completed items
  const clearCompletedList = function(e){
    e.preventDefault();
    window.confirm("Are you sure?");
    ItemCtrl.clearCompletedItems();
    UICtrl.hideCompletedItemList();
    StorageCtrl.clearCompletedItemsFromStorage();
  }

  const clearEverythingFromStorage = function(e){
    e.preventDefault();
    window.confirm("Are you sure?");
    localStorage.clear();
    ItemCtrl.clearAllItems();
    UICtrl.hideItemList();
    ItemCtrl.clearCompletedItems();
    UICtrl.hideCompletedItemList();
    UICtrl.redisplayNameForm();
  }

  // Public methods
  return {
    init: function(){
      // Load event listeners
      loadEventListeners();
    }
  }

})(UICtrl, ItemCtrl, StorageCtrl);

// Initialize App
App.init();
