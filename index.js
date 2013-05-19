var Xbmc = require('xbmc');
var context, OpenNI = require('openni');

var connection = new Xbmc.TCPConnection({
  host: '127.0.0.1',
  port: 9000,
  verbose: true
});
var xbmcApi = new Xbmc.XbmcApi;

function exit() {
  context.close();
  process.exit();
}

context = OpenNI();
xbmcApi.setConnection(connection);

process.on('SIGINT', exit);
xbmcApi.on('connection:close', exit);

xbmcApi.on('connection:data', function()  { console.log('onData');  });

xbmcApi.on('connection:open', function()  {
  [ 'newuser',
    'userexit',
    'lostuser',
    'posedetected',
    'calibrationstart',
    'calibrationsucceed',
    'calibrationfail'
  ].forEach(function(eventType) {
      context.on(eventType, function(userId, x, y, z) {
        console.log('User %d emitted event: %s', userId, eventType);
      });
  });

  [ 'head',
    'neck',
    'torso',
    'waist',
    'left_collar',
    'left_shoulder',
    'left_elbow',
    'left_wrist',
    'left_hand',
    'left_fingertip',
    'right_collar',
    'right_shoulder',
    'right_elbow',
    'right_wrist',
    'right_hand',
    'right_fingertip',
    'left_hip',
    'left_knee',
    'left_ankle',
    'left_foot',
    'right_hip',
    'right_knee',
    'right_ankle',
    'right_foot'
  ].forEach(function(jointName) {
    context.on(jointName, function(user, x, y, z) {
      console.log(jointName + ' of user %d moved to (%d, %d, %d)', user, x, y, z);
    });
  });

});
