var choices = [];
var items = [];
var currentChoice = 0;
var setCompare = function() {
    $("#currentChoice").text(currentChoice);
    var percent = Math.round(currentChoice*100/choices.length);
    $("#bar-full").text(percent + "%");
    $("#bar-full").height(percent + "%");
    $("#bar-empty").height((100-percent) + "%");
    $("#thing0").text(choices[currentChoice][0]);
    $("#thing1").text(choices[currentChoice][1]);
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
        choices = [];
        currentChoice = 0;
        $("#textContainter").removeClass("error");
        $("#errorLabel").addClass("hidden");
        $("#inputs").addClass("hidden");
        $.each(items, function(index1, thing1) {
            $.each(items, function(index2, thing2) {
                if (index2 > index1) {
                    choices.push([thing1, thing2, 0]);
                }
            });
        });
        $("#totalChoices").text(choices.length);
        $("#compare").removeClass("hidden");
        setCompare();
    });

    $(".choice").click(function() {
        choices[currentChoice][2] = choices[currentChoice][0]==$(this).text() ? 1 : 0;
        currentChoice++;
        if (currentChoice == choices.length) {
            $("#compare").addClass("hidden");
            $("#output").removeClass("hidden");
            var sortable = [];
            var weights = {};
            for (var num in items) {
                weights[items[num]] = 0;
            }
            var fullChoicesMatrix = [];
            for (var num in choices) {
                var choice = choices[num];
                fullChoicesMatrix.push(choice);
                var subChoice = [choice[1], choice[0], 1-choice[2]];
                fullChoicesMatrix.push(subChoice);
            }
            for (var num in fullChoicesMatrix) {
                var choice = fullChoicesMatrix[num];
                weights[choice[0]] += choice[2];
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
        setCompare();
    });

    $(".back").click(function(){
        if (currentChoice > 0) {
            currentChoice--;
            setCompare();
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