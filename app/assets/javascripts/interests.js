//our angular module, with all its controllers and services/factories
var app = angular.module('InterestCenter', ['ngRoute', 'ngResource']);

//Factories
app.factory('Interests', ['$resource', function($resource) {
    return $resource('/interests.json', {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    }) 
}]);

app.factory('Interest', ['$resource', function($resource) {
    return $resource('/interests/:id.json', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    })
}])

app.factory('Tweets', ['$resource', function($resource) {
  return $resource('/interests/:id/tweets.json', {
    id: '@interest_id'})
}

]);

//Controllers
app.controller('InterestListCtrl', ['$scope', '$resource', 'Interests', 'Interest', '$location',
    function($scope, $resource, Interests, Interest, $location) {
        $scope.interests = Interests.query();
        
        $scope.twitterImage = '/images/twitter.png';
        $scope.thiefImage = '/images/thief.jpg';
        
        $scope.deleteInterest = function (interestId) {
             if (confirm("Are you sure you want to delete this user?")){
      Interest.delete({ id: interestId }, function(){
        $scope.interests = Interests.query();
        $location.path('/interests');
      });
            }
          };
}]);

app.controller('InterestAddCtrl', ['$scope', '$resource', 'Interests', '$location',
    function($scope, $resource, Interests,  $location) {
        $scope.interest = {};
        $scope.save = function() {
           if ($scope.interestForm.$valid){
      Interests.create({interest: $scope.interest}, function(){
        $location.path('/interests');
      }, function(error){
        console.log(error)
      });
            }
        }
}]);

app.controller("InterestUpdateCtrl", ['$scope', '$resource', 'Interest', '$location', '$routeParams', function($scope, $resource, Interest, $location, $routeParams) {
   $scope.interest = Interest.get({id: $routeParams.id})
   $scope.update = function(){
     if ($scope.interestForm.$valid){
       Interest.update($scope.interest,function(){
         $location.path('/interests');
       }, function(error) {
         console.log(error)
      });
     }
   };
}]);

app.controller("HomeCtrl", ['$scope','Interest','Tweets', '$routeParams', function($scope,Interest,Tweets, $routeParams) {
    
      //get user and create a callback to manipulate data before sending to view
      $scope.interest = Interest.get({id: $routeParams.id}, function(data) {
     
     //get hashtags, and if not empty split them by empty space into an array, and then create scope for checkbox
      $scope.hashtagString = data.hashtags;
      if ($scope.hashtagString) {
            $scope.hashtags = $scope.hashtagString.split(" ");
            for(var i = 0; i <$scope.hashtags.length; i++) {
                $scope.hashtags[i] += " ";
            }
            
            $scope.checkTags = (function(){
                var checkTags = [];
                for(var i=0; i< $scope.hashtags.length; i++){
                    if(checkTags.indexOf($scope.hashtags[i]) === -1){
                        checkTags.push($scope.hashtags[i]);
                    }
                }
                return checkTags;
            })();
            
            $scope.TagFilter = {}; 
      } else $scope.hashtags = 0;
      
      //same for user mentions
      $scope.user_mentions = data.user_mentions;
      if ($scope.user_mentions) {
            $scope.mentions = $scope.user_mentions.split(" ");
          
            $scope.checkMentions = (function(){
            var checkMentions = [];
            for(var i=0; i< $scope.mentions.length; i++){
                if(checkMentions.indexOf($scope.mentions[i]) === -1){
                    checkMentions.push($scope.mentions[i]);
                }
            }
            return checkMentions;
            })();
            
            $scope.MentionFilter = {}; 
      } else $scope.mentions = 0;
});
  
    //get tweets from the query based on the user's id taken from params
    $scope.tweets = Tweets.query({id: $routeParams.id});
    $scope.works = "it works!";
}]);


//Config
app.config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        
        $routeProvider.when('/interests',{
            templateUrl: '/templates/index.html',
            controller: 'InterestListCtrl'
        });
         $routeProvider.when('/interests/new',{
            templateUrl: '/templates/new.html',
            controller: 'InterestAddCtrl'
        });
          $routeProvider.when('/interests/:id/edit',{
            templateUrl: '/templates/edit.html',
            controller: 'InterestUpdateCtrl'
        });
        $routeProvider.when('/interests/:id/tweets',{
            templateUrl: '/templates/tweets.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.otherwise({
          redirectTo: '/interests'
        })
       $locationProvider.html5Mode(true);
    }
]);

