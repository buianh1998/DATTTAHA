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
function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    };
}
function closeVideoStream(stream) {
    return stream.getTracks().forEach((track) => track.stop());
}
$(document).ready(function () {
    // Step o2: callner
    socket.on("server-send-listener-is-offline", function () {
        alertify.notify("Người dùng này hiện không Online", "error", 7);
    });
    let iceServerList = $("#ice-server-list").val();

    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        port: 443,
        config: { iceServers: JSON.parse(iceServerList) },
        // debug: 3,
    });

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
    let timerInterval;

    // Step: 05 of caller
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
                if (Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
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
                if (Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
            },
            onOpen: () => {
                // Step 09: of listenner
                socket.on("server-send-cancel-request-call-to-listener", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            return false;
        });
    });
    // Step: 13: of caller
    socket.on("server-send-accept-call-to-caller", function (response) {
        Swal.close();
        clearInterval(timerInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia(
            { video: true, audio: true },
            function (stream) {
                // Show modal streamming
                $("#streamModal").modal("show");
                // Play in my stream in local
                playVideoStream("local-stream", stream);
                // Call to listener
                let call = peer.call(response.listenerPeerId, stream);
                // listen & play Stream of listener
                call.on("stream", function (remoteStream) {
                    // Play stream of listener.
                    playVideoStream("remote-stream", remoteStream);
                });
                // Close modal remove stream
                $("#streamModal").on("hidden.bs.modal", function () {
                    closeVideoStream(stream);
                    Swal.fire({
                        type: "info",
                        title: `Đã kết thúc cuộc gọi với &nbsp;<span style="color:#2ECC71">${response.listenerName}
                        </span>&nbsp;  <i class="fa fa-volume-control-phone"></i>`,
                        backdrop: "rgba(85,85,85,0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ecc71",
                        confirmButtonText: "Xác Nhận",
                    });
                });
            },
            function (err) {
                console.log("Failed to get local stream", err);
                if (err.toString() === "NotAllowedError: Permission denied") {
                    alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào máy ảnh và mic, vui lòng mở lại", "error", 7);
                }
                if (err.toString() === "NotFoundError: Requested device not found") {
                    alertify.notify("Xin lỗi Không tìm thấy thiết bị nghe gọi trên máy tính của bạn", "error", 7);
                }
            }
        );
    });
    // Step 14: of listener
    socket.on("server-send-accept-call-to-listener", function (response) {
        Swal.close();
        clearInterval(timerInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on("call", function (call) {
            getUserMedia(
                { video: true, audio: true },
                function (stream) {
                    // Show modal streamming
                    $("#streamModal").modal("show");
                    // Play in my stream in local(of listener)
                    playVideoStream("local-stream", stream);
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on("stream", function (remoteStream) {
                        // Play stream of caller.
                        playVideoStream("remote-stream", remoteStream);
                    });
                    // Close modal remove stream
                    $("#streamModal").on("hidden.bs.modal", function () {
                        closeVideoStream(stream);
                        Swal.fire({
                            type: "info",
                            title: `Đã kết thúc cuộc gọi với &nbsp;<span style="color:#2ECC71">${response.callerName}
                            </span>&nbsp;  <i class="fa fa-volume-control-phone"></i>`,
                            backdrop: "rgba(85,85,85,0.4)",
                            width: "52rem",
                            allowOutsideClick: false,
                            confirmButtonColor: "#2ecc71",
                            confirmButtonText: "Xác Nhận",
                        });
                    });
                },
                function (err) {
                    console.log("Failed to get local stream", err);
                    if (err.toString() === "NotAllowedError: Permission denied") {
                        alertify.notify("Xin lỗi bạn đã tắt quyền truy cập vào máy ảnh và mic, vui lòng mở lại", "error", 7);
                    }
                    if (err.toString() === "NotFoundError: Requested device not found") {
                        alertify.notify("Xin lỗi Không tìm thấy thiết bị nghe gọi trên máy tính của bạn", "error", 7);
                    }
                }
            );
        });
    });
});
