var weights = {};
var choices = [];
var currentChoice = 0;
var setCompare = function() {
    $("#thing0").text(choices[currentChoice][0]);
    $("#thing1").text(choices[currentChoice][1]);
};
var validateData = function(text) {
    if (text=="") {
        reportError();
        return null;
    }
    var thingsToCheck = text.match(/[^\r\n]+/g);
    var things = [];
    $.each(thingsToCheck, function(index1, thing1) {
        if (thing1 != "") {
            things.push(thing1);
        }
    });
    if (!things || things.length < 2) {
        reportError();
        return null;
    }
    return things;
};
var reportError = function() {
    $("#textContainter").addClass("error");
    $("#errorLabel").removeClass("hidden");
};
$(function() {
    $("#start").click(function() {
        var text = $("#text").val();
        var things = validateData(text);
        if (!things) {return;}
        $("#textContainter").removeClass("error");
        $("#errorLabel").addClass("hidden");
        $("#inputs").addClass("hidden");
        $.each(things, function(index1, thing1) {
            weights[thing1] = 0;
            $.each(things, function(index2, thing2) {
                if (index2 > index1) {
                    choices.push([thing1, thing2]);
                }
            });
        });
        $("#compare").removeClass("hidden");
        setCompare();
    });

    $(".choice").click(function() {
        weights[$(this).text()]++;
        currentChoice++;
        if (currentChoice == choices.length) {
            $("#compare").addClass("hidden");
            $("#output").removeClass("hidden");
            var sortable = [];
            for (var thing in weights)
                sortable.push([thing, weights[thing]]);
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
});