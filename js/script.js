//Get data from server on page load
var jsonData = null;
var AllFoodTable = null;
var CurrentFoodTable = null;
$(document).ready(function () {
    $.ajax({
        url: '/Data/menu.csv',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            if (data != null) {
                var objectArray = [];
                var temp = data.split('\n').map(function (x) {
                    return x.split(',');
                });
                for (var i = 1; i < temp.length; i++) {
                    if (i < 260) {
                        objectArray.push(new MenuData(temp[i]));
                    }

                }
                jsonData = objectArray;
                if (jsonData != null) {
                    AllFoodTable = $('#AllFood').DataTable({
                        stateSave: true,
                        paging: false,
                        scrollY: 400,
                        data: jsonData,
                        columns: [
                            {
                                render: function (data, type, row) {
                                    return '<input type="checkbox" />';
                                }
                            },
                            {
                                data: 'item'
                            },
                            {
                                data: 'category'
                            },
                            {
                                data: 'servingSize'
                            },
                            {
                                data: 'calories'
                            },
                            {
                                data: 'fat'
                            },
                            {
                                data: 'cholesterol'
                            },
                            {
                                data: 'sodium'
                            },
                            {
                                data: 'sugar'
                            },
                            {
                                data: 'protein'
                            }
                        ]
                    });
                }
            }
        }
    });
    CurrentFoodTable = $('#CurrentFood').DataTable({
        stateSave: true,
        paging: false,
        data: null,
        columns: [
            {
                width: '5%',
                render: function (data, type, row) {
                    return '<img src="/Images/close_red.png" width="15px" />';
                }
            },
            {
                width: '25%',
                data: 'item'
            },
            {
                width: '13%',
                data: 'category'
            },
            {
                width: '15%',
                data: 'servingSize'
            },
            {
                width: '7%',
                data: 'calories'
            },
            {
                width: '7%',
                data: 'fat'
            },
            {
                width: '7%',
                data: 'cholesterol'
            },
            {
                width: '7%',
                data: 'sodium'
            },
            {
                width: '7%',
                data: 'sugar'
            },
            {
                width: '7%',
                data: 'protein'
            }
        ]
    });


});

//JSON Object for UI
class MenuData {
    constructor(text) {
        if (text.length != 24 && text.length != 25) {
            console.log('Whats going on (length): ' + text.length);
        } else {
            var count = 0;
            this.category = text[count++];
            this.item = text[count++];
            if (text.length == 25) {
                this.item += text[count++];
            }
            this.servingSize = text[count++];
            this.calories = text[count++];
            this.caloriesFat = text[count++];
            this.fat = text[count++];
            this.fatPercent = text[count++];
            this.saturatedFat = text[count++];
            this.saturatedPercent = text[count++];
            this.transFat = text[count++];
            this.cholesterol = text[count++];
            this.cholesterolPercent = text[count++];
            this.sodium = text[count++];
            this.sodiumPercent = text[count++];
            this.carbs = text[count++];
            this.carbPercent = text[count++];
            this.fiber = text[count++];
            this.fiberPercent = text[count++];
            this.sugar = text[count++];
            this.protein = text[count++];
            this.vitaminA = text[count++];
            this.vitaminC = text[count++];
            this.calcium = text[count++];
            this.iron = text[count++];
        }
    }
}
