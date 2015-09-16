var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  Meteor.subscribe('news');
  Meteor.subscribe('bookmarkCounts');
  feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('latestActivity', function() {
      dataReadyHold.release();
    });
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function() {
    this.feedSubscription = feedSubscription;
  }
});

RecipesController = RouteController.extend({
  data: function() {
    return _.values(RecipesData);
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function() {
    if (Meteor.user())
      return _.values(_.pick(RecipesData, Meteor.user().bookmarkedRecipeNames));
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('recipe', this.params.name);
  },
  data: function() {
    return RecipesData[this.params.name];
  }
});

AdminController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('news');
  }
});

Router.route('home', {
  name: 'home',
  path: '/'
});

Router.route('feed', {
  name: 'feed'
});

Router.route('recipes', {
  name: 'recipes'
});

Router.route('bookmarks', {
  name: 'bookmarks'
});

Router.route('about', {
  name: 'about'
});

Router.route('recipe', {
  name: 'recipe',
  path: '/cars/:name'
});

Router.route('admin', {
  name: 'admin',
  layoutTemplate: null
});

// Router.route(function() {
//   this.route('home', {path: '/'});
//   this.route('feed');
//   this.route('recipes');
//   this.route('bookmarks');
//   this.route('about');
//   this.route('recipe', {path: '/cars/:name'});
//   this.route('admin', { layoutTemplate: null });
// });

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
