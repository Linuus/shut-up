import "phoenix_html";
import {Socket, Presence} from "phoenix";
import $ from "jquery";

let $status = $("#status");
let $messages = $("#messages");
let $input = $("#message-input");
let $username = $("#username");
let $usernameContainer = $("#username-container");
let $userList = $("#user-list");

$status.hide();
$messages.hide();
$input.hide();

$username.off("keypress").on("keypress", e => {
  if (e.keyCode == 13) {
    initiateChat($username.val());
  }
});

let initiateChat = (username) => {
  let socket = new Socket("/socket", { params: {username: username} });

  socket.connect();

  $usernameContainer.hide();
  $status.show();
  $messages.show();
  $input.show();
  $input.focus();

  let sanitize = (html) => { return $("<div/>").text(html).html(); };

  let messageTemplate = (msg) => {
    let body = sanitize(msg.body);
    let user = sanitize(msg.user || "anonymous");

    return (`<p><a href='#'>[${user}]</a> ${body}</p>`);
  };

  let chan = socket.channel("room:lobby", {});
  chan.join().receive("ok", () => console.log("join ok"))
    .receive("timeout", () => console.log("Connection interruption"));
  chan.onError(e => console.log("something went wrong", e));
  chan.onClose(e => console.log("channel closed", e));

  $input.off("keypress").on("keypress", e => {
    if (e.keyCode == 13) {
      chan.push("new:msg", {body: $input.val()});
      $input.val("");
    }
  });

  chan.on("new:msg", msg => {
    $messages.append(messageTemplate(msg));
    scrollTo(0, document.body.scrollHeight);
  });

  chan.on("user:entered", msg => {
    let user = sanitize(msg.user || "anonymous");
    $messages.append(`<br/><i>[${user} entered]</i>`);
  })



  ////////////////////////////////////
  // Presence stuff
  let listBy = (id, {metas: [first, ...rest]}) => {
    first.name = id;
    first.count = rest.length + 1;
    return first;
  };

  let render = (presences) => {
    // listBy is a function where we choose what we want to do for the multiple
    // presences that might be around based on how many tabs, devices, etc.
    // they're connected via.
    $userList.html(
      Presence.list(presences, listBy)
        .map(user => `<li>${user.name} (${user.count}) [${user.device}]</li>`)
        .join("")
    );
  };

  // We'll add an empty object to track our presences in:
  let presences = {};

  // and we'll handle the messages over the channel to sync our state and render
  // our presences.
  chan.on("presence_state", state => {
    presences = Presence.syncState(presences, state);
    render(presences);
  });

  // We also need to handle a `presence_diff` event, which is how we get updates
  // on users being added and removed.
  chan.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff);
    render(presences);
  });
};
