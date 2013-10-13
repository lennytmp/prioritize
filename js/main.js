var choices = {};
var items = [];
var history = [];
var currentText1 = '', currentText2  = '', choicesLeft = 0;
var updateStatus = function() {
    var i = 0;
    var isNextChoice = false;
    $.each(choices, function(text1, subChoices) {
        $.each(subChoices, function(text2, choice) {
            if (isNaN(choice)) {
                if (i == 0) {
                    currentText1 = text1;
                    currentText2 = text2;
                    isNextChoice = true;
                }
                i++;
            }
        });
    });
    choicesLeft = i/2;
    if (isNextChoice) {
        setCompare();
    }
    return isNextChoice;
};
var cloneObject = function(obj) {
    var copiedObject = {};
    $.extend(true, copiedObject, obj);
    return copiedObject;
}
/*
var optimizeSorting = function(arr) {
    var changed = false;
    $.each(arr, function(index1, choice1) {
        if (choice1[2] == 1) {
            //choice1[1] > choice1[2]
            $.each(arr, function(index2, choice2) {
                if (choice2[1] == choice1[0] && choice2[2] == 1) {

                }
            });
        }
    });
    return changed;
};*/
var setCompare = function() {
    var totalChoices = (items.length*items.length - items.length)/2;
    $("#currentChoice").text(totalChoices - choicesLeft);
    var percent = Math.round((totalChoices - choicesLeft)*100/totalChoices);
    $("#bar-full").text(percent + "%");
    $("#bar-full").height(percent + "%");
    $("#bar-empty").height((100-percent) + "%");
    $("#thing0").text(currentText1);
    $("#thing1").text(currentText2);
};
var validateData = function(text) {
    if (text=="") {
        reportError();
        return null;
    }
    var itemsToCheck = text.match(/[^\r\n]+/g);
    var items = [];
    $.each(itemsToCheck, function(index1, item) {
        if (item != "" && items.indexOf(item) == -1) {
            items.push(item);
        }
    });
    if (!items || items.length < 2) {
        reportError();
        return null;
    }
    return items;
};
var reportError = function() {
    $("#textContainter").addClass("error");
    $("#errorLabel").removeClass("hidden");
};
$(function() {
    $("#start").click(function() {
        var text = $("#text").val();
        items = validateData(text);
        if (!items) {return;}
        choices = {};
        $("#textContainter").removeClass("error");
        $("#errorLabel").addClass("hidden");
        $("#inputs").addClass("hidden");
        $.each(items, function(index1, thing1) {
            choices[thing1] = {};
            $.each(items, function(index2, thing2) {
                if (index2 == index1) {
                    choices[thing1][thing2] = 0;
                } else {
                    choices[thing1][thing2] = NaN;
                }
            });
        });
        updateStatus();
        $("#totalChoices").text(choices.length);
        $("#compare").removeClass("hidden");
    });

    $(".choice").click(function() {
        var was = cloneObject(choices);
        history.push(cloneObject(choices));
        choices[currentText1][currentText2] = currentText1==$(this).text() ? 1 : 0;
        choices[currentText2][currentText1] = 1 - choices[currentText1][currentText2];
        var isNextChoice = updateStatus();
        if (!isNextChoice) {
            $("#compare").addClass("hidden");
            $("#output").removeClass("hidden");
            var sortable = [];
            var weights = {};
            for (var num in items) {
                weights[items[num]] = 0;
            }
            for (var text1 in choices) {
                if(typeof weights[text1] === 'undefined'){
                    weights[text1] = 0;
                }
                for (var text2 in choices[text1]) {
                    weights[text1] += choices[text1][text2];
                }
            }
            for (var item in weights) {
                sortable.push([item, weights[item]]);
            }
            sortable.sort(function(a, b) {return b[1] - a[1]});
            var $tmp;
            var $result = $("#result");
            for (var one in sortable) {
                $tmp = $('<li></li>');
                $tmp.text(sortable[one][0]);
                $result.append($tmp);
            }
            return;
        }
    });

    $(".back").click(function(){
        if (history.length > 0) {
            var lastElem = history.length-1;
            choices = cloneObject(history[lastElem]);
            delete history[lastElem];
            history.splice(lastElem, 1);
            updateStatus();
            if ($("#compare").hasClass("hidden")) {
                $("#compare").removeClass("hidden");
                $("#result").html("");
                $("#output").addClass("hidden");
            }
        } else {
            $("#inputs").removeClass("hidden");
            $("#compare").addClass("hidden");
        }
    });
});