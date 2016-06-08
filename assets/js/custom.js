var client;
var host = "127.0.0.1";
var port = 8083;
var client_id = "webclient_" + $.now();
var username = "webclient";
var password = "wc@mqtt:p@ss";

function connect() {
  client = new Paho.MQTT.Client(host, port, client_id);

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({ 
    onSuccess: onConnect,
    userName: username,
    password: password
  });

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    messageNotif = new Paho.MQTT.Message("I, user " + username + ", is now subscribed.");
    messageNotif.destinationName = "runic/webclient/admin";
    client.send(messageNotif);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    var topic = message.destinationName;
    var payload = message.payloadString;

    var dissectedTopic = topic.split("/");
    if ((dissectedTopic[0] === "runic") && (dissectedTopic[1] === username)) {
      if (dissectedTopic[2] === "info") {
        process_info[dissectedTopic[3]](payload);
      }
    }
  }
}

var process_info = {
  online: function(payload) {
    console.log("Info >>> Online");
    var uname = payload.split(":")[1];
    console.log("UNAME >>> " + uname);
    $("#users-li-"+uname).css("color", "green");
  }
}

$(document).ready(function() {
  connect();

  $.ajax({
    type: "GET",
    url: "/v1/users"
  })
  .done(function(data) {
    if (data && data.code === 0) {
      var content = "";
      var users = data.result;
      var user_list = $("#users-ul");
      $usr = $( user_list );
      $usr.empty();
      for (var u in users) {
        $usr.append(
          $("<li/>")
            .attr("id", "users-li-"+users[u].username)
            .addClass("users-li")
            .append(
              $("<label/>")
                .append(
                  $("<span/>")
                    .addClass("user-name-span")
                    .text(users[u].username))
            .append(
              $("<input/>")
                .addClass("user-del-button")
                .attr("type", "button")
                .attr("id", "user-del-button-"+users[u].id)
                .data("user-id", users[u].id)
                .data("user-name", users[u].username)
                .val("X"))
          ));
      }
    } else {
      console.log("ERROR!!! #1");
    }
  });
});

$(document).on("click", "input.user-del-button", function() {
  var id = $(this).data("user-id");
  var uname = $(this).data("user-name");
  $.ajax({
    type: "DELETE",
    url: "/v1/users?username=" + uname,
  })
  .done(function(data) {
    if (data && data.code === 0) {
      $("#users-li-"+id).remove();
    } else {
      console.log("ERROR!!! #2")
    }
  });
});

// var processMessage = {
//   info: {
//     online: function(payload) {
//       console.log("Info >>> Online");
//       var uname = payload.split(":")[1];
//       console.log("UNAME >>> " + uname);
//       $("#users-li-"+uname).css("color", "green");
//     }
//   }
// }