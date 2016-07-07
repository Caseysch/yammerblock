$(document).ready(setup);

function processUsers(incomingUsers) {
    var users = [],
        error = false,
        numbers = /^\d+$/;
    for (var i = 0; i < incomingUsers.length; i++) {
        var setting = incomingUsers[i].trim();
        if (setting.length === 0) continue;

        if (numbers.test(setting)) {
            users.push(setting);
        }
        else {
            error = true;
            break;
        }
    }

    return { "error": error, "users": users };
}

function processPhrases(incomingPhrases) {
    var phrases = [];
    for (var i = 0; i < incomingPhrases.length; i++) {
        var setting = incomingPhrases[i].trim();
        if (setting.length === 0) continue;
        phrases.push(setting);
    }

    return phrases;
}

function setup() {
    var currentVersion = 1;

    chrome.storage.sync.get({
            users: {
                blocked: [],
                blockedMethod: 0
            },
            posts: {
                hideGroups: true,
                hideJoins: true,
                hidePraises: true,
                hideRead: false,
                phrases: []
            },
            options: {
                hideAllCo: false
            }
        },
        function(data) {
            $("#optionBlockedUsers").val(data.users.blocked.join(','));
            $("#optionBlockedUsersMethod").val(data.users.blockedMethod);
            $("#optionBlockedPhrases").val(data.posts.phrases.join(','));
            $("#optionAllCo").prop("checked", data.options.hideAllCo);
            $("#optionGroups").prop("checked", data.posts.hideGroups);
            $("#optionJoins").prop("checked", data.posts.hideJoins);
            $("#optionPraises").prop("checked", data.posts.hidePraises);
            $("#optionRead").prop("checked", data.posts.hideRead);
        }
    );

    $("#saveOptions").click(function() {
        var result = processUsers($("#optionBlockedUsers").val().split(','));
        if (!result.error) {
            $(".error").hide();
            var data = {
                version: currentVersion,
                users: {
                    blocked: result.users,
                    blockedMethod: $("#optionBlockedUsersMethod").val()
                },
                posts: {
                    hideGroups: $("#optionGroups").prop("checked"),
                    hideJoins: $("#optionJoins").prop("checked"),
                    hidePraises: $("#optionPraises").prop("checked"),
                    hideRead: $("#optionRead").prop("checked"),
                    phrases: processPhrases($("#optionBlockedPhrases").val().split(','))
                },
                options: {
                    hideAllCo: $("#optionAllCo").prop("checked")
                }
            };

            chrome.storage.sync.set(data);
        }
        else {
            $(".error").show();
        }
    });
}
