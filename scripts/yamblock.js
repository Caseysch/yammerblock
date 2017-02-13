function traceActivity(message) {
    console.log("YAMBLOCK: " + message);
}

function removeBlockedUsers(userData) {
    userData.blocked.forEach(function(userId) {
        userId = userId.trim();
        $(".yj-message-list-item--avatar[data-userid=" + userId + "]").not("[style='display: none;']").each(function() {
            traceActivity("Removing post from user: " + userId);

            var index = $(this).parents().eq(2).hasClass("yj-thread-reply-list-item") ? 2 : 3;
            if (userData.blockedMethod === "0") {
                $(this).parents().eq(index).hide();
            }
            else {
                $(this).parents().eq(index).text("[hidden]");
            }

            $(this).hide();
        });
    });
}

function removeWorthlessPosts(postData) {
    // Only remove read posts if the setting is on, it's on unread topics, and it's a group that has been joined
    var shouldHideRead = postData.hideRead && !window.location.href.endsWith("&view=all") && $(".yj-follow-button").filter(function () { return this.textContent.includes("Join Group"); }).length == 0;

    var $groups = postData.hideGroups ? $("span.yj-message-list-item--body-message:visible:contains('has created the ')").not("[style='display: none;']") : $(""),
        $joins = postData.hideJoines ? $("a.yammer-object:visible:contains('#joined')").not("[style='display: none;']") : $(""),
        $praises = postData.hidePraises ? $(".yj-praise-attachment:visible").not("[style='display: none;']") : $(""),
        $read = shouldHideRead ? $(".yj-thread-starter .yj-message-attributes--unviewed-indicator").filter(function () { return $(this).css("opacity") == 0 }) : $("");

    postData.phrases.forEach(function (phrase) {
        var $posts = $("span.yj-message-list-item--body-message:visible:contains('" + phrase + "')").not("[style='display: none;']");
        if ($posts.length > 0) {
            traceActivity("Removing " + $posts.length + " posts containing phrase \"" + phrase + "\"");
            $posts.each(function () {
                var index = $(this).parents().eq(3).hasClass("yj-thread-starter") ? 4 : 3;
                $(this).parents().eq(index).hide();
            });
        }
    });

    $groups.each(function() {
        $(this).parents().eq(4).hide();
    });
    $joins.each(function() {
        $(this).parents().eq(5).hide();
    });
    $praises.each(function() {
        $(this).parents().eq(5).hide();
    });
    $read.each(function () {
        $(this).parents().eq(7).hide();
    });
    
    if ($joins.length + $groups.length + $praises.length + $read.length > 0) {
        traceActivity("Removed " + $joins.length + " joined posts, " + $groups.length + " group created posts, " + $praises.length + " praised posts, and " + $read.length + " previously read topics.");
    }
}

function processOptions(options) {
    if (options.hideAllCo) {
        $(".all-company-list-item").hide();
    }
    if (options.hidePrivateMessages) {
        $(".yj-nav-menu--private-messages-group-list").hide();
    }
}

function processDOMChanged() {
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
                hideAllCo: false,
                hidePrivateMessages: false
            }
        },
        function (data) {
            removeBlockedUsers(data.users);
            removeWorthlessPosts(data.posts);
            processOptions(data.options);
        }
    );
}

MutationObserver = window.MutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    processDOMChanged();
});

observer.observe(document.body, {
  subtree: true, childList: true
});
