function traceActivity(message) {
    console.log("YAMBLOCK: " + message);
}

function removeBlockedUsers(blockedUsers) {
    blockedUsers.forEach(function(userId) {
        userId = userId.trim();
        $(".yj-message-list-item--avatar[data-userid=" + userId + "]").not("[style='display: none;']").each(function() {
            traceActivity("Removing post from user:" + userId);

            if ($(this).parents().eq(2).hasClass("yj-thread-reply-list-item")) {
                $(this).parents().eq(2).hide();
            } else {
                $(this).parents().eq(3).hide();
            }

            $(this).hide();
        });
    });
}

function removeWorthlessPosts() {
    var groups = $("span.yj-message-list-item--body-message:visible:contains('has created the ')").not("[style='display: none;']"),
        joins = $("a.yammer-object:visible:contains('#joined')").not("[style='display: none;']"),
        praises = $(".yj-praise-view--title").not("[style='display: none;']");

    groups.each(function() {
        $(this).parents().eq(4).hide();
    });
    joins.each(function() {
        $(this).parents().eq(5).hide();
    });
    praises.each(function() {
        $(this).parents().eq(5).hide();
    });

    if (joins.length + groups.length + praises.length > 0) {
        traceActivity("Removed " + joins.length + " joined posts, " + groups.length + " group created posts, and " + praises.length + " praised posts. " + $("li.yj-thread-list-item:visible").length + " actual posts");
    }
}

function processDOMChanged() {
    chrome.storage.sync.get({
            "blockedUsers": []
        },
        function(items) {
            removeBlockedUsers(items.blockedUsers);
        }
    );

    removeWorthlessPosts();
}

MutationObserver = window.MutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    processDOMChanged();
});

observer.observe(document.body, {
  subtree: true, childList: true
});
