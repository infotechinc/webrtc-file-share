import "./app-header.js";
import "./landing-page.js";

const template = `

<div>

<app-header v-bind:title=title></app-header>

<landing-page v-if="!room_id && !peerIsReady" v-bind:title=title></landing-page>

<!-- Loading page to show after room id is generated (Hide previous)-->
<div v-if="room_id && !peerIsReady" class="container has-text-centered">

<p class="is-size-5 has-text-weight-semibold"><br><br><br>Waiting for your friend to connect!<br><br><br></p>

<!-- Spinner icon -->
<span class="icon is-large has-text-primary">
  <i class="fas fa-spinner fa-3x fa-pulse"></i>
</span>

</div>
<!-- End loading page -->

<!-- File upload page to show when peer is ready (Hides previous)-->
<section class="section">
  <div v-if="peerIsReady">
    <div class="content has-text-centered">

      <h2><br>Connection complete!<br><br></h2>
      <p>Your friend has connected! Now choose the file you would like to transfer.<br><br></p>

      <div class="file is-centered">
        <!-- File Input Button -->
        <label class="file-label">
        <input class="file-input" type="file" name="resume" @change = "onFileChange"><br><br><br>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">
            Choose a file...
          </span>
        </span>
      </label>
    </div>

  </div>

  <div class="columns">
    <div class="column is-half has-text-centered">
      <!-- To make the column colored: notification is-primary -->
     <h1><strong>Sent Files</strong></h1>
      <!-- Dynamic progress bar -->
      <div v-for="sentFile in sentFiles">
        <div>
          <!-- Show checkbox if file is fully sent -->
          <p><span v-if="sentFile.complete" class="icon has-text-primary">
            <i class="fas fa-check-square"></i>
          </span>
          {{ sentFile.name }}</p>
          <progress v-if="!sentFile.complete" class="progress is-primary" v-bind:value="sentFile.bytesSent" v-bind:max="sentFile.size"></progress>
        </div>
      </div>
    </div>
    <div class="column is-half has-text-centered">
      <h1><strong>Received Files</strong></h1>
        <div v-for="receivedFile in receivedFiles">
          <a v-bind:download=receivedFile.name v-bind:href=receivedFile.file>{{ receivedFile.name }}</a>
        </div>
    </div>
  </div>


  </div>
</section>

</div>
`;

Vue.component("application", {
  template: template,
  data: function() {
    return {
      peer: null,
      peerIsReady: null,
      webrtc: null,
      title: "File Friend",
      room_id: window.location.pathname.startsWith("/rooms/")
        ? window.location.pathname.replace("/rooms/", "")
        : null,
      sentFiles: [],
      receivedFiles: []
    };
  },

  created: function() {
    if (this.room_id) this.initWebRtc(false);
  },

  methods: {
    invite: function(inviteData) {
      this.room_id = inviteData.room_id;
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
