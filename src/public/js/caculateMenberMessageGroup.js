function increaseNumberMessageGroup(divId) {
    let currentValue = +$(`.right[data-chat = ${divId}]`).find(".show-number-message").text();
    currentValue += 1;
    $(`.right[data-chat = ${divId}]`).find(".show-number-message").html(currentValue);
}
