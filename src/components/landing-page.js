const template = `

<div>
<!-- Invite button -->
<br><br><br><br><br><br><br><br>
<a v-on:click="invite" class="button is-medium is-link has-text-weight-semibold">Click to invite a friend!</a>

<!-- Product copy -->
<div class="menu has-text-centered has-text-grey"><br><br><br><br><br><br><br>
  <p class="has-text-weight-semibold">Why {{ title }}?</p>
  <ul class='menu-list'>
    <li>We perform secure, peer-to-peer transfers!</li>
      <li>Your data is only transferred and never saved!</li>
      <li>You can't breach what you don't have!</li>
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
      const body = encodeURI(
        `Hello,\n\n I would like to send you a file using ${
          this.title
        }, a secure website for peer-to-peer file transfers. Please click the invite link below to complete the transfer!\n\n${url}\n\nThank you!`
      );
      const subject = "File Transfer Request";
      event.target.href = `mailto:?subject=${subject}&body=${body}`;
      window.history.pushState({}, "", `rooms/${room_id}`);

      this.$emit("invite", { room_id: room_id });
    }
  }
});
