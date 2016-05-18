$(document).ready(setup);

function processSettings(incomingSettings) {
    var outgoing = [],
        isSafe = true,
        numbers = /^\d+$/;
    for(var i=0;i<incomingSettings.length;i++) {
        var setting = incomingSettings[i].trim();
        if (setting.length === 0) continue;

        if (numbers.test(setting)) {
            outgoing.push(setting);
        }
        else {
            isSafe = false;
            break;
        }
    }

    return { "isSafe":isSafe, "settings":outgoing };
}

function setup() {
    chrome.storage.sync.get({
            "blockedUsers": []
        },
        function(items) {
            $("#optionBlockedUsers").val(items.blockedUsers.join(','));
        }
    );

    $("#saveOptions").click(function() {
        var blockedUsers = $("#optionBlockedUsers").val();

        var result = processSettings(blockedUsers.split(','));
        if (result.isSafe) {
            $(".error").hide();
            chrome.storage.sync.set({
                    "blockedUsers": result.settings
                }
            );
        }
        else {
            $(".error").show();
        }
    });
}
