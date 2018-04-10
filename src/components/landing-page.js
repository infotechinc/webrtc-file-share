const template = `
<div class="container has-text-centered">
<!-- Invite button -->
<br><br><br><br><br><br><br><br>
<a v-on:click="invite" class="button is-medium is-link has-text-weight-semibold">Click to invite a friend!</a>

<!-- Product copy -->
<div class="menu has-text-centered has-text-grey"><br><br><br><br><br><br><br>
  <p class="has-text-weight-semibold">Why {{ title }}?</p>
  <ul class='menu-list'>
    <li>We do secure, peer-to-peer transfers!</li>
    <li>There is NO third party and NO security risk!</li>
  </ul>
</div>
</div>
`;

Vue.component("landing-page", {
  template: template,
  props: ["title"],
  methods: {
    invite: function(event) {
      const array = new Uint32Array(4);
      window.crypto.getRandomValues(array);
      const room_id = array.join("");
      const url = `Join transfer: ${window.location}rooms/${room_id}`;
      //console.log(url);
      const body = encodeURI(
        `Hello,\n\n I would like to send you a file using ${
          this.title
        }, a secure website for peer-to-peer file transfers. Please click the invite link below to complete the transfer!\n\n${url}\n\nThank you!`
      );
      const subject = "File Transfer Request";
      event.target.href = `mailto:user@example.com?subject=${subject}&body=${body}`;
      window.history.pushState({}, "", `rooms/${room_id}`);
      // create our webrtc connection

      this.$emit("invite", { room_id: room_id });
    }
  }
});
