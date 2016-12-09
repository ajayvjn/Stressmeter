FCMPlugin.getToken(
  function(token){
    alert(token);
  },
  function(err){
    console.log('error retrieving token: ' + err);
  }
)

FCMPlugin.onNotification(
  function(data){
    if(data.wasTapped){
      //Notification was received on device tray and tapped by the user.
      alert( JSON.stringify(data) );
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified.
      alert( JSON.stringify(data) );
    }
  },
  function(msg){
    console.log('onNotification callback successfully registered: ' + msg);
  },
  function(err){
    console.log('Error registering onNotification callback: ' + err);
  }
);