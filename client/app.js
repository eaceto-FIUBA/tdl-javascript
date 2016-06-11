var app = angular.module('inputBasicDemo',  ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/chat/:username', {
    templateUrl: 'chat.html',
    controller: 'ChatCtrl',
  }).when('/', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl',
  })
 });

app.controller('LoginCtrl', function LoginCtrl($scope,$http, $route, $routeParams, $location)  {
  var login = function (username, callback) {
      $http.put('/api/user/' + username + '/login')
          .then(function (response) {
              if (response.data && response.data.loggedin) {
                  console.log(response);
                  if (callback) callback(true);
              } else {
                  console.log('error joining chat');
                  if (callback) callback(false);
              }
          }, function (response) {
              console.log('error joining chat');
              if (callback) callback(false);
          });
  };

  $scope.enterUsername = function(username){
    login(username, function(isLoggedIn){
      $location.path( "/chat/"+username );
    });
  }
});

app.controller('ChatCtrl', function ChatCtrl($scope, $http, $routeParams, $location) {
  $scope.isConnected = false;
  $scope.io = io();
  $scope.msg = "";
  $scope.messages = [];

  var joinChat = function (tmpSocket, username, callback) {
      tmpSocket.on('connect', function(){
          currentSocket = tmpSocket;

          var socketId = tmpSocket.io.engine.id;
          console.log('connected username: ' + username + ' socketId: ' + socketId);
          // call "join" endpoint
          $http.put('/api/user/' + username + '/join/' + socketId)
          .then(function (response)  {
                  if (response.data && response.data.username && response.data.socket) {
                      console.log('joined chat'+response.data.socket);
                      if (callback) callback(true);
                  } else {
                      console.log('error joining chat');
                      if (callback) callback(false);
                  }
              },
              function() {
                  console.log('error joining chat');
                  if (callback) callback(false);
              });
      });

      tmpSocket.on('disconnect', function() {
          var socketId = tmpSocket.io.engine.id;
          console.log('disconnected username: ' + username + ' socketId: ' + socketId);
          currentSocket = undefined;
      });

      tmpSocket.on('chat', function(msg){
        $scope.messages.push(msg);
        $scope.$apply();
      });
  };

  $scope.getUsernameColor = function(username) {
    //si no tengo ususario deveuelvo negro
    if (!username)
      return '#000';

    var COLORS = [
      '#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  $scope.enterMsg = function(){
    if ($scope.msg=="/exit") {
      $http.delete('/api/user/' + $routeParams.username + '/exit')
          .then(function (response) {
            $location.path( "/" );
          }, function (response) {
            $location.path( "/" );
          });
      return;
    }

    var msg = { username: $routeParams.username, 
                message: $scope.msg, 
                timestamp: Date.now(), 
                socketid: $scope.io.io.engine.id};
    $scope.messages.push(msg);
    $scope.io.emit('chat', msg);
    $scope.msg = "";
  }

  // at the bottom of your controller
  var init = function () {
    joinChat($scope.io,$routeParams.username,function(loaded){
      if(!loaded) {
        $location.path( "/" );
      }
      $scope.isConnected = loaded;
      $scope.messages.push({log:"Bienvenido "+ $routeParams.username +" al chat de Teoria del lenguaje"});
    });
  };
  init();
});


app.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);