 
/**
 * IIFE 
 * 
 * 
 * 1) Setting up first event listeners
 * 2) Reading input data
 * 3) Creating init function 02.03.
 */
 // BUDGET CONTROLLER
var budgetController = (function() {

})();


// UI CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
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

    };

   
    var ctrlAddItem = function() {
        // 1. get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. add the item to the budget controller

        // 3. add the new item to the UI

        // 4. calculate the budget

        // 5. display the budget on the UI
    };

    return {
        // when application starts...
        init: function() {
            console.log('application has started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();