/**
 *  1) Setting up first event listeners
 *  2) Reading input data
 *  3) Creating init function 
 *  4) Creating income and expense function constructors 
 *  5) Adding a new item to budget controller
 *  6) Adding a new item to the UI
 *  7) Clear HTML fields, use querySelectorAll, convert list to array
 *  8) Preventing false inputs, convert input to num
 *  9) Updating the budget - creating simple, reusable functions with one purpose (budget ctrl)
 * 10) Updating the UI - DOM manipulation - updating the budget and total vals (UI ctrl)
 * 
 * 11) TODO: -> delete functionality,
 * 12) Setting up the delete event listener using EVENT DELEGATION 
 * 13) Deleting an item from budget controller -> delete from data structure, UI, update budget
 * 
 */


 /**
  * BUDGET CONTROLLER - IIFE
  * 
  * Expense, Income - function contructors.
  * calculateTotal - calculates income or expenses based on type.
  * data - object in which all items are stored. allItems obj - exp or inc properties (array). 
  * totals obj - stores total expenses and income. 
  * data object - budget and percentage.
  * 
  * returns 
  *     addItem 
  *     calculateBudget 
  *     getBudget
  */
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // for calculating income or expenses - type keyword
    var calculateTotal  = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value; //curr referes either to inc or exp object
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0 ) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {

            // id = 6
            // if we have ids = [1 2 4 6 8] 
            // index = 3

            //map -> similar to forEach, but it creates a new array
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1); //splice -> start deleting at index, delete 1 number
            }

        },

        calculateBudget: function() {

            // total income and total expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calc budget
            data.budget = data.totals.inc - data.totals.exp;

            // percentage of income we spended
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    };

})();

/**
 * UI CONTROLLER
 * 
 * DOMStrings object
 * 
 * returns
 *      getInput function gets user input type, description and value 
 *      addListItem function creates child HTML element that contains input vals
 *      deleteListItem deletes child HTML element
 *      clearFields clears description and value fields, returns pointer to description
 *      displayBudget displays total budget, income, expenses and percentage
 *      getDOMStrings function returns DOMStrings obj
 * 
 */
var UIController = (function() {

    var DOMStrings = {
        
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {

        getInput: function() {
            return {

                type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) // parseFloat -> takes string and converts it to num
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc'){
                element = DOMStrings.incomeContainer;
                //console.log('type is inc');
                html = ' <div class="item clearfix" id="inc-%id%""><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                //console.log('type is exp');
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            

            if (element != null) {
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            }
        },

        // we can only remove a child element
        deleteListItem: function(selectorID) { 
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); // returns a list 

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(curr, i, arr) {
                curr.value = "";
            });

            fieldsArr[0].focus(); // return pointer to description field
        },

        displayBudget: function(obj) {

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

/**
 * GLOBAL APP CONTROLLER
 * 
 * setupEventListeners event listeners
 * updateBudget function calculates budget and displays it on UI
 * ctrlAddItem adds item to the data structure and UI, updates Budget
 * ctrlDeleteItem deletes item from data structure and UI, updates Budget
 * 
 * returns init function
 *  
 */
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMStrings();
        // using HTML CLASS selector
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
       });

       document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function() {

        // 1. calculate the budget
        budgetController.calculateBudget();

        // 2. return the budget
        var budget = budgetController.getBudget();

        // 3. display the budget on the UI
        //console.log(budget);
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. get the field input data
        input = UICtrl.getInput();
        //console.log(input);

        // 2. add the item to the budget controller if val is > 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            newItem = budgetController.addItem(input.type, input.description, input.value);
            
            // 3. add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear the fields
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        // DOM travesing 
        // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);  --> four parent elements up, id of that element
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // delete item from data structure
            budgetController.deleteItem(type, ID);
            // delete item from UI
            UIController.deleteListItem(itemID);
            // update and show the new budget
            updateBudget();
        }
    };

    return {
        // @ app start
        init: function() {
            console.log('application has started');
            //reset the display
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();