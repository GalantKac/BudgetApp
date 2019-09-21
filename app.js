//BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    }

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

        deleteItem: function (type, id) {

            var ids, index;

            //We created new array to check function id what have index
            // simply id = 6
            // ids = [1 2 6 9]
            // index = 2
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id); // find index number where element have that value (id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1); // deleted elements from this index and how much
            }
        },

        calculateBudget: function () {
            //calculate total + and -
            calculateTotal('exp');
            calculateTotal('inc');

            //sum budget
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    return {
        //public method
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {

            var html, newHTML, element;

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%">\n' +
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

                html = '<div class="item clearfix" id="exp-%id%">\n' +
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

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
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

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
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

        document.querySelector(DOM.container).addEventListener('click', controllerDeleteItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                controllerAddItem();
            }
        });
    };

    var updateBudget = function () {

        //calculate the budget
        budgetCtrl.calculateBudget();
        //return budget
        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function () {
        //calculate percentages
        budgetCtrl.calculatePercentages();
        //read this
        var percentages = budgetCtrl.getPercentages();
        //update UI
        UICtrl.displayPercentages(percentages);

    }

    // add new budget
    var controllerAddItem = function () {
        var input, newItem;

        //Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //Add the item to UI list
            UICtrl.addListItem(newItem, input.type);
            //Clear input fields
            UICtrl.clearFields();
            //Calculate and update budget
            updateBudget();
            updatePercentage();
        }
    };

    var controllerDeleteItem = function (event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //We creat array where elements are text who are between '-'. Split copied value to new array
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            //delete from date
            budgetCtrl.deleteItem(type, id);
            //delete from UI
            UICtrl.deleteListItem(itemID);
            //update
            updateBudget();
            updatePercentage();
        }
    };

    return {
        //public method
        init: function () {
            //start app
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();