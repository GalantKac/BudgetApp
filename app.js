//BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, description, value) {

            var newItem, id;

            //Creat new ID
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            //Creat new item
            if (type === 'exp') {
                newItem = new Expense(id, description, value);
            } else if (type === 'inc') {
                newItem = new Income(id, description, value);
            }

            //Push it into data
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        test: function () {
            console.log(data);
        }
    }
})();

// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        //public method
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                text: document.querySelector(DOMstrings.inputDescription).value,
                number: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {

            var html, newHTML, element;

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            } else if (type === 'exp') {

                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__percentage">21%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: function(){
            var fields, fieldsArray;

            //this return list of selectors
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            //soo we must convert it on array, use Object Array and his prototype using slice to copy list by call method(this method is for list, use apply to array)
            fieldsArray = Array.prototype.slice.call(fields);
            //clear all index
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            })
            fieldsArray[0].focus();
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    //setup event listeners
    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', controllerAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                controllerAddItem();
            }
        });
    };

    // add new budget
    var controllerAddItem = function () {
        var input, newItem;

        //Get the field input data
        input = UICtrl.getInput();
        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.text, input.number);
        //Add the item to UI list
        UICtrl.addListItem(newItem, input.type);
        //Clear input fields
        UICtrl.clearFields();

    }

    return {
        //public method
        init: function () {
            //start app
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();