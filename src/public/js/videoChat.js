function videoChat(divId) {
    $(`#video-chat-${divId}`)
        .unbind("click")
        .on("click", function () {
            let targetId = $(this).data("chat");
            let callerName = $("#navbar-username").text();
            let dataToEmit = {
                listenerId: targetId,
                callerName: callerName,
            };
            // Step 01: of caller
            socket.emit("caller-check-listener-online-or-not", dataToEmit);
        });
}

$(document).ready(function () {
    // Step o2: callner
    socket.on("server-send-listener-is-offline", function () {
        alertify.notify("Người dùng này hiện không Online", "error", 7);
    });
    let getPeerId = "";
    const peer = new Peer();
    peer.on("open", function (peerId) {
        getPeerId = peerId;
    });

    // Step 03: of listener
    socket.on("server-request-peer-id-of-listener", function (response) {
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerPeerId: getPeerId,
            listenerName: listenerName,
        };

        // Step 04: of listener
        socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });
    socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
        console.log(response);

        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerPeerId: response.listenerPeerId,
            listenerName: response.listenerName,
        };
        //Step 06: of caller
        socket.emit("caller-request-call-to-server", dataToEmit);
        let timerInterval;
        Swal.fire({
            title: `Đang gọi cho&nbsp <span style="color:#2ECC71">${response.listenerName}</span>&nbsp <i class="fa fa-volume-control-phone"></i>`,
            html: `
                Thời gian: <strong style="color:#d43af3a"></strong> giây.</br></br>
                <button id="btn-cancel-call" class="btn btn-danger">Hủy Cuộc Gọi</button>
                `,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, //30 seconds

            onBeforeOpen: () => {
                $("#btn-cancel-call")
                    .unbind("click")
                    .on("click", function () {
                        Swal.close();
                        clearInterval(timerInterval);
                        // Step 07: of caller
                        socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                    });
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 1000);
            },
            onOpen: () => {
                //Step12: Of caller
                socket.on("server-send-reject-call-to-caller", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    Swal.fire({
                        type: "info",
                        title: `<span style="color:#2ECC71">${response.listenerName}</span>&nbsp; Hiện tại không thể nghe máy  <i class="fa fa-volume-control-phone"></i>`,
                        backdrop: "rgba(85,85,85,0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ecc71",
                        confirmButtonText: "Xác Nhận",
                    });
                });
                socket.on("server-send-accept-call-to-caller", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("Caller OK");
                    //
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });
    //step 8 Server request-call-user2
    socket.on("server-send-request-call-to-listener", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerPeerId: response.listenerPeerId,
            listenerName: response.listenerName,
        };
        let timerInterval;
        Swal.fire({
            title: `<span style="color:#2ECC71">${response.callerName}</span>&nbsp Muốn trò chuyện video với bạn &nbsp <i class="fa fa-volume-control-phone"></i>`,
            html: `
                Thời gian: <strong style="color:#d43af3a"></strong> giây.</br></br>
                <button id="btn-reject-call" class="btn btn-danger">Từ Chối</button>
                <button id="btn-accept-call" class="btn btn-success">Đồng Ý</button>
                `,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, //30 seconds

            onBeforeOpen: () => {
                $("#btn-reject-call")
                    .unbind("click")
                    .on("click", function () {
                        Swal.close();
                        clearInterval(timerInterval);
                        // Step 10: of listener
                        socket.emit("listener-reject-request-call-to-server", dataToEmit);
                    });
                $("#btn-accept-call")
                    .unbind("click")
                    .on("click", function () {
                        Swal.close();
                        clearInterval(timerInterval);
                        // Step 11: of listener
                        socket.emit("listenner-accept-request-call-to-server", dataToEmit);
                    });
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                }, 1000);
            },
            onOpen: () => {
                // Step 09: of listenner
                socket.on("server-send-cancel-request-call-to-listener", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                });
                // Step 14: of listener
                socket.on("server-send-accept-call-to-listener", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                    console.log("Caller OK");
                    //
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });
});
