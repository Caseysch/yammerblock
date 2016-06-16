function traceActivity(message) {
    console.log("YAMBLOCK: " + message);
}

function removeBlockedUsers(userData) {
    userData.blocked.forEach(function(userId) {
        userId = userId.trim();
        $(".yj-message-list-item--avatar[data-userid=" + userId + "]").not("[style='display: none;']").each(function() {
            traceActivity("Removing post from user:" + userId);

            var index = $(this).parents().eq(2).hasClass("yj-thread-reply-list-item") ? 2 : 3;
            if (userData.blockedMethod === "0") {
                $(this).parents().eq(index).hide();
            }
            else {
                $(this).parents().eq(index).find(".yj-message-list-item--body-message").eq(0).text("[hidden]");
            }

            $(this).hide();
        });
    });
}

function removeWorthlessPosts(postData) {
    var groups = postData.hideGroups ? $("span.yj-message-list-item--body-message:visible:contains('has created the ')").not("[style='display: none;']") : $(""),
        joins = postData.hideJoines ? $("a.yammer-object:visible:contains('#joined')").not("[style='display: none;']") : $(""),
        praises = postData.hidePraises ? $(".yj-message-list-item--praise-content:visible").not("[style='display: none;']") : $(""),
        read = postData.hideRead && !window.location.href.endsWith("&view=all") ? $(".yj-thread-starter .yj-message-list-item--unviewed-indicator").filter(function () { return $(this).css("opacity") == 0 }) : $("");

    groups.each(function() {
        $(this).parents().eq(4).hide();
    });
    joins.each(function() {
        $(this).parents().eq(5).hide();
    });
    praises.each(function() {
        $(this).parents().eq(4).hide();
    });
    read.each(function () {
        $(this).parents().eq(7).hide();
    });

    if (joins.length + groups.length + praises.length + read.length > 0) {
        traceActivity("Removed " + joins.length + " joined posts, " + groups.length + " group created posts, " + praises.length + " praised posts, and " + read.length + " previously read topics.");
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
                hideRead: false
            }
        },
        function (data) {
            removeBlockedUsers(data.users);
            removeWorthlessPosts(data.posts);
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
