var app = new Vue({
  el: "#app",
  data: {
    peer: null,
    peerIsReady: null,
    webrtc: null,
    message: "File Friend",
    room_id: window.location.pathname.startsWith("/rooms/")
      ? window.location.pathname.replace("/rooms/", "")
      : null,
    sentFiles: [],
    receivedFiles: []
  },

  created: function() {
    if (this.room_id) this.initWebRtc(false);
  },

  methods: {
    invite: function(event) {
      this.room_id = Math.random().toString();
      const url = `Join transfer: ${window.location}rooms/${this.room_id}`;
      //console.log(url);
      const body = encodeURI(
        `Hello,\n\n I would like to send you a file using File Friend, a secure website for peer-to-peer file transfers. Please click the invite link below to complete the transfer!\n\n${url}\n\nThank you!`
      );
      const subject = "File Transfer Request";
      event.target.href = `mailto:user@example.com?subject=${subject}&body=${body}`;
      window.history.pushState({}, "", `rooms/${this.room_id}`);
      // create our webrtc connection
      this.initWebRtc(true);
    },
    initWebRtc: function(createRoom) {
      console.log("created");
      this.webrtc = new SimpleWebRTC({
        // we don't do video
        localVideoEl: "",
        remoteVideosEl: "",
        // dont ask for camera access
        autoRequestMedia: false,
        // dont negotiate media
        receiveMedia: {
          offerToReceiveAudio: false,
          offerToReceiveVideo: false
        }
      });
      console.log(this.webrtc); // called when a peer is created
      this.webrtc.on("createdPeer", peer => {
        //arrow functions
        console.log("Created peer was called", peer);
        this.peer = this.initPeer(peer);
      });
      if (createRoom)
        this.webrtc.createRoom(this.room_id, (err, name) => {
          console.log("create room", err, name);
        }); //callback methods
      else
        this.webrtc.joinRoom(this.room_id, (err, name) => {
          console.log("join room", err, name);
        }); //callback methods
    },
    initPeer: function(peer) {
      peer.pc.on("iceConnectionStateChange", event => {
        const state = peer.pc.iceConnectionState;
        this.peerIsReady = state == "connected" || state == "completed";
        console.log("iceConnectionStateChange", state);
      });
      peer.on("fileTransfer", (metadata, receiver) => {
        console.log("fileTransfer", metadata, receiver);
        receiver.on("progress", bytesReceived => {
          console.log("progress", bytesReceived);
        });
        receiver.on("receivedFile", (file, metadata) => {
          console.log("receivedFile", file, metadata);
          this.receivedFiles.unshift({
            //Unshift puts latest file on top
            name: metadata.name,
            bytesReceived: metadata.size,
            file: URL.createObjectURL(file)
          });
          receiver.channel.close();
        });
      });
      return peer;
    },
    onFileChange: function(event) {
      if (event.target.files.length == 0) return;
      console.log(event);
      const sender = this.peer.sendFile(event.target.files[0]);
      this.sentFiles.unshift({
        name: event.target.files[0].name,
        bytesSent: 0,
        size: event.target.files[0].size,
        complete: false
      });
      sender.on("progress", bytesSent => {
        this.sentFiles[0].bytesSent = bytesSent;
        console.log(bytesSent);
      });
      sender.on("complete", () => {
        this.sentFiles[0].complete = true;
        console.log("complete");
      });
    }
  }
});
