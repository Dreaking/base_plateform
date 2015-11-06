/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.0.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('app', [
            'app.core',
            'app.services',
            'app.filters',
            'app.routes',
            'app.colors',
            'app.utils',
            'app.sidebar',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.icons',
            'app.forms',
            'app.controllers'
        ])              
})();
(function() {
    'use strict';

    angular
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.forms', []);
})();
(function() {
    'use strict';

    angular
        .module('app.icons', []);
})();
(function() {
    'use strict';

    angular
        .module('app.preloader', []);
})();


(function() {
    'use strict';

    angular
        .module('app.loadingbar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.translate', []);
})();
(function() {
    'use strict';

    angular
        .module('app.utils', [
          'app.colors'
          ]);
})();

(function() {
    'use strict';

    angular
        .module('app.colors')
        .constant('APP_COLORS', {
          'primary':                '#5d9cec',
          'success':                '#27c24c',
          'info':                   '#23b7e5',
          'warning':                '#ff902b',
          'danger':                 '#f05050',
          'inverse':                '#131e26',
          'green':                  '#37bc9b',
          'pink':                   '#f532e5',
          'purple':                 '#7266ba',
          'dark':                   '#3a3f51',
          'yellow':                 '#fad732',
          'gray-darker':            '#232735',
          'gray-dark':              '#3a3f51',
          'gray':                   '#dde6e9',
          'gray-light':             '#e4eaec',
          'gray-lighter':           '#edf1f2'
        })
        ;
})();
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.colors')
        .service('Colors', Colors);

    Colors.$inject = ['APP_COLORS'];
    function Colors(APP_COLORS) {
        this.byName = byName;

        ////////////////

        function byName(name) {
          return (APP_COLORS[name] || '#fff');
        }
    }

})();

/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('filestyle', filestyle);

    function filestyle () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var options = element.data();
          
          // old usage support
          options.classInput = element.data('classinput') || options.classInput;
          
          element.filestyle(options);
        }
    }

})();

/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('formWizard', formWizard);

    formWizard.$inject = ['$parse'];
    function formWizard ($parse) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          var validate = $parse(attrs.validateSteps)(scope),
              wiz = new Wizard(attrs.steps, !!validate, element);
          scope.wizard = wiz.init();
        }

        function Wizard (quantity, validate, element) {
          
          var self = this;
          self.quantity = parseInt(quantity,10);
          self.validate = validate;
          self.element = element;
          
          self.init = function() {
            self.createsteps(self.quantity);
            self.go(1); // always start at fist step
            return self;
          };

          self.go = function(step) {
            
            if ( angular.isDefined(self.steps[step]) ) {

              if(self.validate && step !== 1) {
                var form = $(self.element),
                    group = form.children().children('div').get(step - 2);

                if (false === form.parsley().validate( group.id )) {
                  return false;
                }
              }

              self.cleanall();
              self.steps[step] = true;
            }
          };

          self.active = function(step) {
            return !!self.steps[step];
          };

          self.cleanall = function() {
            for(var i in self.steps){
              self.steps[i] = false;
            }
          };

          self.createsteps = function(q) {
            self.steps = [];
            for(var i = 1; i <= q; i++) self.steps[i] = false;
          };

        }
    }


})();

/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('masked', masked);

    function masked () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.inputmask)
            $elem.inputmask();
        }
    }

})();

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.forms')
        .filter('propsFilter', propsFilter);

    function propsFilter() {
        return filterFilter;

        ////////////////
        function filterFilter(items, props) {
          var out = [];

          if (angular.isArray(items)) {
            items.forEach(function(item) {
              var itemMatches = false;

              var keys = Object.keys(props);
              for (var i = 0; i < keys.length; i++) {
                var prop = keys[i];
                var text = props[prop].toLowerCase();
                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                  itemMatches = true;
                  break;
                }
              }

              if (itemMatches) {
                out.push(item);
              }
            });
          } else {
            // Let the output be the input untouched
            out = items;
          }

          return out;
        }
    }

})();
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('tagsinput', tagsinput);

    tagsinput.$inject = ['$timeout'];
    function tagsinput ($timeout) {
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
          element.on('itemAdded itemRemoved', function(){
            // check if view value is not empty and is a string
            // and update the view from string to an array of tags
            if(ngModel.$viewValue && ngModel.$viewValue.split) {
              ngModel.$setViewValue( ngModel.$viewValue.split(',') );
              ngModel.$render();
            }
          });

          $timeout(function(){
            element.tagsinput();
          });
        }
    }

})();

/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('validateForm', validateForm);

    function validateForm () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.parsley)
            $elem.parsley();
        }
    }

})();

/**=========================================================
 * Module: skycons.js
 * Include any animated weather icon from Skycons
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.icons')
        .directive('skycon', skycon);

    function skycon () {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          var skycons = new Skycons({'color': (attrs.color || 'white')});

          element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');

          skycons.add(element.children()[0], attrs.skycon);

          skycons.play();
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.preloader')
        .directive('preloader', preloader);

    preloader.$inject = ['$animate', '$timeout', '$q'];
    function preloader ($animate, $timeout, $q) {

        var directive = {
            restrict: 'EAC',
            template: 
              '<div class="preloader-progress">' +
                  '<div class="preloader-progress-bar" ' +
                       'ng-style="{height: loadCounter + \'%\'}"></div>' +
              '</div>'
            ,
            link: link
        };
        return directive;

        ///////

        function link(scope, el) {

          scope.loadCounter = 0;

          var counter  = 0,
              timeout;

          // disables scrollbar
          angular.element('body').css('overflow', 'hidden');
          // ensure class is present for styling
          el.addClass('preloader');

          appReady().then(endCounter);

          timeout = $timeout(startCounter);

          ///////

          function startCounter() {

            var remaining = 100 - counter;
            counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

            scope.loadCounter = parseInt(counter, 10);

            timeout = $timeout(startCounter, 20);
          }

          function endCounter() {

            $timeout.cancel(timeout);

            scope.loadCounter = 100;

            $timeout(function(){
              // animate preloader hiding
              $animate.addClass(el, 'preloader-hidden');
              // retore scrollbar
              angular.element('body').css('overflow', '');
            }, 300);
          }

          function appReady() {
            var deferred = $q.defer();
            var viewsLoaded = 0;
            // if this doesn't sync with the real app ready
            // a custom event must be used instead
            var off = scope.$on('$viewContentLoaded', function () {
              viewsLoaded ++;
              // we know there are at least two views to be loaded 
              // before the app is ready (1-index.html 2-app*.html)
              if ( viewsLoaded === 2) {
                // with resolve this fires only once
                $timeout(function(){
                  deferred.resolve();
                }, 3000);

                off();
              }

            });

            return deferred.promise;
          }

        } //link
    }

})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .config(loadingbarConfig)
        ;
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];
    function loadingbarConfig(cfpLoadingBarProvider){
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .run(loadingbarRun)
        ;
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];
    function loadingbarRun($rootScope, $timeout, cfpLoadingBar){

      // Loading bar transition
      // ----------------------------------- 
      var thBar;
      $rootScope.$on('$stateChangeStart', function() {
          if($('.wrapper > section').length) // check if bar container exists
            thBar = $timeout(function() {
              cfpLoadingBar.start();
            }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function(event) {
          event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
          });
      });

    }

})();
(function() {
    'use strict';

    angular
        .module('app.translate')
        .config(translateConfig)
        ;
    translateConfig.$inject = ['$translateProvider'];
    function translateConfig($translateProvider){
  
      $translateProvider.useStaticFilesLoader({
          prefix : 'app/i18n/',
          suffix : '.json'
      });
      $translateProvider.preferredLanguage('en');
      $translateProvider.useLocalStorage();
      $translateProvider.usePostCompiling(true);

    }
})();
(function() {
    'use strict';

    angular
        .module('app.translate')
        .run(translateRun)
        ;
    translateRun.$inject = ['$rootScope', '$translate'];
    
    function translateRun($rootScope, $translate){

      // Internationalization
      // ----------------------

      $rootScope.language = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'en':       'English',
          'es_AR':    'Español'
        },
        // display always the current ui language
        init: function () {
          var proposedLanguage = $translate.proposedLanguage() || $translate.use();
          var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
          $rootScope.language.selected = $rootScope.language.available[ (proposedLanguage || preferredLanguage) ];
        },
        set: function (localeId) {
          // Set the new idiom
          $translate.use(localeId);
          // save a reference for the current language
          $rootScope.language.selected = $rootScope.language.available[localeId];
          // finally toggle dropdown
          $rootScope.language.listIsOpen = ! $rootScope.language.listIsOpen;
        }
      };

      $rootScope.language.init();

    }
})();
/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('animateEnabled', animateEnabled);

    animateEnabled.$inject = ['$animate'];
    function animateEnabled ($animate) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.animateEnabled, scope);
          }, function (newValue) {
            $animate.enabled(!!newValue, element);
          });
        }
    }

})();

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Browser', Browser);

    Browser.$inject = ['$window'];
    function Browser($window) {
      return $window.jQBrowser;
    }

})();

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('resetKey', resetKey);

    resetKey.$inject = ['$state', '$localStorage'];
    function resetKey ($state, $localStorage) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              resetKey: '@'
            }
        };
        return directive;

        function link(scope, element) {
          element.on('click', function (e) {
              e.preventDefault();

              if(scope.resetKey) {
                delete $localStorage[scope.resetKey];
                $state.go($state.current, {}, {reload: true});
              }
              else {
                $.error('No storage key specified for reset.');
              }
          });
        }
    }

})();

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('toggleFullscreen', toggleFullscreen);

    toggleFullscreen.$inject = ['Browser'];
    function toggleFullscreen (Browser) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          // Not supported under IE
          if( Browser.msie ) {
            element.addClass('hide');
          }
          else {
            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {
                  
                  screenfull.toggle();
                  
                  // Switch icon indicator
                  if(screenfull.isFullscreen)
                    $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                  else
                    $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                  $.error('Fullscreen not enabled');
                }

            });
          }
        }
    }


})();

/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          element.on('click', function (e) {
              if(element.is('a')) e.preventDefault();
              var uri = attrs.loadCss,
                  link;

              if(uri) {
                link = createLink(uri);
                if ( !link ) {
                  $.error('Error creating stylesheet link element.');
                }
              }
              else {
                $.error('No stylesheet location defined.');
              }

          });
        }
        
        function createLink(uri) {
          var linkId = 'autoloaded-stylesheet',
              oldLink = $('#'+linkId).attr('id', linkId + '-old');

          $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
          }));

          if( oldLink.length ) {
            oldLink.remove();
          }

          return $('#'+linkId);
        }
    }

})();

/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('now', now);

    now.$inject = ['dateFilter', '$interval'];
    function now (dateFilter, $interval) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var format = attrs.format;

          function updateTime() {
            var dt = dateFilter(new Date(), format);
            element.text(dt);
          }

          updateTime();
          var intervalPromise = $interval(updateTime, 1000);

          scope.$on('$destroy', function(){
            $interval.cancel(intervalPromise);
          });

        }
    }

})();

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('checkAll', checkAll);

    function checkAll () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('change', function() {
            var $this = $(this),
                index= $this.index() + 1,
                checkbox = $this.find('input[type="checkbox"]'),
                table = $this.parents('table');
            // Make sure to affect only the correct checkbox column
            table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
              .prop('checked', checkbox[0].checked);

          });
        }
    }

})();

/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('triggerResize', triggerResize);

    triggerResize.$inject = ['$window', '$timeout'];
    function triggerResize ($window, $timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('click', function(){
            $timeout(function(){
              $window.dispatchEvent(new Event('resize'));
            });
          });
        }
    }

})();

/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Utils', Utils);

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];
    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element('html'),
            $win  = angular.element($window),
            $body = angular.element('body');

        return {
          // DETECTION
          support: {
            transition: (function() {
                    var transitionEnd = (function() {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            }, name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && { end: transitionEnd };
                })(),
            animation: (function() {

                var animationEnd = (function() {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   function(callback){ window.setTimeout(callback, 1000/60); },
            /*jshint -W069*/
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
          },
          // UTILITIES
          isInView: function(element, options) {
              /*jshint -W106*/
              var $element = $(element);

              if (!$element.is(':visible')) {
                  return false;
              }

              var window_left = $win.scrollLeft(),
                  window_top  = $win.scrollTop(),
                  offset      = $element.offset(),
                  left        = offset.left,
                  top         = offset.top;

              options = $.extend({topoffset:0, leftoffset:0}, options);

              if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                  left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
              } else {
                return false;
              }
          },
          
          langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

          isTouch: function () {
            return $html.hasClass('touch');
          },

          isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
          },

          isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
          },

          isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
          }

        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.core', [
            'ngRoute',
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'ngResource',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'ui.utils'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload', []);
})();
(function() {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar', []);
})();
(function() {
	'use strict';
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.filters',[]);
	angular.module('app.controllers', [
		'app.core',
		'app.routes',
		'app.sidebar',
		'app.translate',
		'app.settings',
		// 'ngMd5'
	]);
})();
/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('Application', Application)

  Application.$inject = ['$rootScope', '$scope', '$location', '$http', '$state', 'userResourceApi', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService'];

  function Application($rootScope, $scope, $location, $http, $state, userResourceApi, USER_ROLES, AUTH_EVENTS, AuthService) {
    //--未登录--
    $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
       console.log('未登录')
        $state.go('page.login');
      })
      //--权限不足--
    $scope.$on(AUTH_EVENTS.notAuthorized, function() {
      console.log('权限不足')
        $state.go('page.login');
      })
      //--系统出错--
    $scope.$on(AUTH_EVENTS.systemError, function() {
      console.log('系统出错')
      $state.go('page.login');
    })
    $scope.$on('$stateChangeStart', function(event, toState) {
      var authorizedRoles = toState.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user not login in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  }
})();
/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .factory('AuthService', ['$http','$cookieStore', 'USER_ROLES', function($http,$cookieStore, USER_ROLES) {
      var authService = {};
      authService.login = function(credentials) {

      };

      authService.isAllowRole=function(roles){
        var role=$cookieStore.get('session').role;
        if(!!!role)
          return false;
        return roles.indexOf(role)!==-1;
      }
      authService.isAuthenticated = function() {
        return !!$cookieStore.get('session');
      };

      authService.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        if (authorizedRoles[0] == USER_ROLES.all)
          return true;
        return (authService.isAuthenticated()&&authService.isAllowRole(authorizedRoles));
      };
      return authService;
    }]);
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ApplyTeamController', ApplyTeamController)
  ApplyTeamController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog', 'Upload']

  function ApplyTeamController($scope, $timeout, $state, schoolResourceApi, ngDialog, Upload) {
    var vm = this;
    $scope.authMsg = '';
    $scope.header = '';
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.file = null;
    vm.uploadFiles = function(file) {
      console.log(123456)
      if (file && !file.$error) {
        Upload.dataUrl(file, true).then(function(urls) {
          vm.file = urls.slice((urls.indexOf('base64,') + 7))
        });
      }
    }
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.replyTeam = function() {
      vm.submitted = true;
      console.log(vm.formValidate.$valid, vm.file)
      if (!vm.file) {
        vm.openTimed('<p class="text-center text-danger">请上传团队文件</p>')
      } else if (vm.formValidate.$valid) {
        schoolResourceApi.ApplyNewTeam({
          team_name: vm.title,
          excel_file: vm.file,
          material: vm.content
        }).$promise.then(function(data) {
          switch (data.status) {
            case 440:
              $scope.header = '<span class="text-danger">注册失败<span>';
              $scope.authMsg = '团队名已存在';
              break;
            case 423:
              $scope.header = '<span class="text-danger">注册失败<span>';
              $scope.authMsg = '个人信息未完善';
              $timeout(function() {
                $state.go(visitor.info)
              });
              break;
            case 200:
              $scope.header = '<span class="text-success">注册成功<span>';
              $scope.authMsg = '申请成功，请耐心等候管理员审核，审核结果将会通过短信通知';
              break;
            default:
              break;
          }
          ngDialog.open({
            template: 'alert',
            className: 'ngdialog-theme-default',
            scope: $scope
          })
          $timeout(function() {
            vm.title = '';
            vm.content = '';
          }, 0, true)
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    }
  }
})();
  (function() {
    'use strict';

    angular
      .module('app.controllers')
      .controller('BaseActivityController', BaseActivityController)
      .filter('NowTime', NowTime)
      .filter('removeTag', removeTag);

    function NowTime() {
      return function(input, params) {
        return moment.unix(input).format('ll');
      }
    }

    function removeTag() {
      return function(input, params) {
        input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        input = input.replace(/ /ig, '');
        return input;
      }
    }
    BaseActivityController.$inject = ['schoolResourceApi', 'adminResourceApi','ngDialog', 'APP_PARMAS']

    function BaseActivityController(schoolResourceApi, adminResourceApi,ngDialog, APP_PARMAS) {
      var vm = this;
      vm.editorConfig = {
        initialFrameHeight: 300
      }
      vm.activity = {
        title: '',
        content: '',
        type: 2
      }
      loadActivityList();

      function loadActivityList() {
        adminResourceApi.BaseActivityQuery({
          type: 2
        }, function(data) {
          vm.activities = data.data;
        })
      }
      vm.downloadExcel = function(id) {
        schoolResourceApi.DownloadActivityExcel({
          activity_id: id
        }, function(data) {
          window.open(data.file_url);
        })
      }
      vm.submitted = false;
      vm.validateInput = function(name, type) {
        var input = vm.formValidate[name];
        return (input.$dirty || vm.submitted) && input.$error[type];
      };
      vm.delecteActivity = function(index, activitie) {
        ngDialog.openConfirm({
          template: 'confirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          schoolResourceApi.DelectInfo({
            notice_id: activitie.notice_id
          }, function(data) {
            console.log(data);
          })
          vm.activities.splice(index, 1);
        }, function(reason) {});
      }
      vm.addActivity = function(activity) {
        vm.submitted = true;
        if (vm.formValidate.$valid) {
          schoolResourceApi.BaseInfoAdd(activity, function(data) {
            vm.activity.title = '';
            vm.activity.content = '';
            vm.formValidate.title.$dirty = false;
            vm.formValidate.content.$dirty = false;
            vm.submitted = false;
            loadActivityList();
          })
        } else {
          console.log('Not valid!!');
          return false;
        }
      }
    }
  })();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseGameController', BaseGameController)
    .filter('NowTime', NowTime)
    .filter('removeTag', removeTag);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('ll');
    }
  }

  function removeTag() {
    return function(input, params) {
      input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      input = input.replace(/ /ig, '');
      return input;
    }
  }
  BaseGameController.$inject = ['schoolResourceApi', 'adminResourceApi', 'ngDialog', 'APP_PARMAS']

  function BaseGameController(schoolResourceApi, adminResourceApi, ngDialog, APP_PARMAS) {
    var vm = this;
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.game = {
      title: '',
      content: '',
      type: 1
    }
    vm.GameQuery = function() {
      adminResourceApi.BaseGameQuery({
        type: 1
      }, function(data) {
        vm.games = data.data;
      })
    }
    vm.GameQuery();
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.delecteGame = function(index, game) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DelectInfo({
          notice_id: game.notice_id
        }, function(data) {
          console.log(data);
        })
        vm.games.splice(index, 1);
      }, function(reason) {});
    }
    vm.addGame = function(game) {
      console.log(game)
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        schoolResourceApi.BaseInfoAdd(game, function(data) {
          vm.game.title = '';
          vm.game.content = '';
          vm.formValidate.title.$dirty = false;
          vm.formValidate.content.$dirty = false;
          vm.submitted = false;
          vm.GameQuery();
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    }
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseIntroduceCtroller', BaseIntroduceCtroller)

  BaseIntroduceCtroller.$inject = ['$scope', '$timeout', 'schoolResourceApi', 'adminResourceApi', 'ngDialog', 'APP_PARMAS']

  function BaseIntroduceCtroller($scope, $timeout, schoolResourceApi, adminResourceApi, ngDialog, APP_PARMAS) {
    var vm = this;
    $scope.content = '';
    vm.reset = function() {
      vm.myImage = '';
      vm.editorConfig = {
        initialFrameHeight: 300
      }
      vm.myCroppedImage = '';
      vm.myImage = '';
      vm.imgcropType = 'square';
      schoolResourceApi.IntroduceContentQuery(function(data) {
        $timeout(function() {
          $scope.content = data ? data.data.content : '';
        }, 0, true)
      })
      schoolResourceApi.IntroduceLogoQuery(function(data) {
        $timeout(function() {
          vm.myCroppedImage = data ? DataWrap(data.data.content) : '';
          console.log(vm.myImage)
        }, 0, true)
      })
    };

    function DataWrap(str) {
      return 'data:image/png;base64,' + str;
    }
    vm.reset();
    var handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function( /*$scope*/ ) {
          vm.myImage = evt.target.result;
        });
      };
      if (file)
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    vm.saveIntroduce = function() {
      var transition = vm.myCroppedImage.slice(22);
      var dialog = ngDialog.open({
        template: '<div class="panel-body loader-demo"><div class="sk-spinner sk-spinner-double-bounce"><div class="sk-double-bounce1"></div><div class="sk-double-bounce2"></div></div></div>',
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      schoolResourceApi.UpdateIntroduce({
        logo_file: transition,
        content: $scope.content
      }, function(data) {
        dialog.close();
      })
    }
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseNoticeController', BaseNoticeController)
    .filter('NowTime', NowTime)
    .filter('removeTag', removeTag);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('ll');
    }
  }

  function removeTag() {
    return function(input, params) {
      input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      input = input.replace(/ /ig, '');
      return input;
    }
  }
  BaseNoticeController.$inject = ['schoolResourceApi', 'adminResourceApi','ngDialog', 'APP_PARMAS']

  function BaseNoticeController(schoolResourceApi, adminResourceApi,ngDialog, APP_PARMAS) {
    var vm = this;
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.notice = {
      title: '',
      content: '',
      type: 0
    }
    NoticeQuery();

    function NoticeQuery() {
      adminResourceApi.BaseInfoQuery({
        type: 0
      }, function(data) {
        vm.notices = data.data;
      })
    }
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.delecteNotice = function(index, notice) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DelectInfo({
          notice_id: notice.notice_id
        }, function(data) {
          console.log(data);
        })
        vm.notices.splice(index, 1);
      }, function(reason) {});
    }
    vm.addNotice = function(notice) {
      console.log(notice)
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        schoolResourceApi.BaseInfoAdd(notice, function(data) {
          vm.notice.title = '';
          vm.notice.content = '';
          vm.formValidate.title.$dirty = false;
          vm.formValidate.content.$dirty = false;
          vm.submitted = false;
          NoticeQuery();
        })
      } else {
        return false;
      }
    }
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BasePostController', BasePostController)
    .filter('fromNow', fromNow)
    .filter('removeTag', removeTag);

  function fromNow() {
    return function(input, params) {
      return moment.unix(input).fromNow();
    }
  }

  function removeTag() {
    return function(input, params) {
      input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      input = input.replace(/ /ig, '');
      return input;
    }
  }
  BasePostController.$inject = ['$timeout', '$state', 'schoolResourceApi', 'adminResourceApi', 'paginationConfig', 'ngDialog']

  function BasePostController($timeout, $state, schoolResourceApi, adminResourceApi, paginationConfig, ngDialog) {
    var vm = this;
    vm.maxSize = 1; //最大页码数
    vm.bigCurrentPage = 1;
    vm.delectAllPosts = function() {
      $timeout(function() {}, 0, true);
      console.log(vm.posts)
    }
    getSectionList();

    function getSectionList() {
      adminResourceApi.ModuleQuery(function(data) {
        vm.sections = data.data;
        vm.section_id = data.data[0].section_id;
        vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
      })
    }
    vm.delectAllPosts = function() {
      var ids = [],
        promiseList = [];
      for (var i in vm.posts) {
        if (vm.posts[i].selected)
          ids.push(vm.posts[i].recruit_id)
      };
      if (ids.length > 0) {
        ngDialog.openConfirm({
          template: 'allconfirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          for (var i = 0, len = ids.length; i < len; i++)
            promiseList.push(schoolResourceApi.PostDelete({
              recruit_id: ids[i]
            }).$promise);
          $q.all(promiseList).then(function(){
            vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
            vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
          })
        }, function(reason) {});
      } else
        vm.openTimed('<h3 class="text-center">请选择要删除的文章</h3>');
    }
    vm.checkAll = function(event) {
      event.stopPropagation();
      vm.selectAll = !vm.selectAll;
      $timeout(function() {
        for (var i in vm.posts) {
          vm.posts[i]['selected'] = vm.selectAll;
        };
      }, 0, true)
    }
    vm.delectPost = function(id) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.PostDelete({
          recruit_id: id
        }, function(data) {
          console.log(data);
          vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
          vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
        })
      }, function(reason) {});
    }
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.getPostList = function(num, size) {
      adminResourceApi.PostListQuery({
        section_id: vm.section_id,
        page_num: num,
        page_size: size
      }, function(data) {
        vm.posts = data.data.post_list;
        $timeout(function() {
          vm.bigTotalItems = data.data.recruit_count;
        }, 0, true)
      })
    }
    vm.pageChanged = function() {
      vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
    };
    vm.maxSize = 5;
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseTeamOrderController', BaseTeamOrderController)
    .filter('NowTime', NowTime)
    .filter('TypeFilter', TypeFilter)
    .filter('MoneyFilter', MoneyFilter);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('l');
    }
  }

  function MoneyFilter() {
    return function(input, params) {
      return input > 0 ? '+' + input : input;
    }
  }

  function TypeFilter() {
    return function(input, params) {
      return input == 0 ? '管理员加钱' : input == 1 ? '管理员扣钱' : '团队支出';
    }
  }

  BaseTeamOrderController.$inject = ['$scope', '$timeout', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'schoolResourceApi', 'teamResourceApi', 'adminResourceApi'];

  function BaseTeamOrderController($scope, $timeout, DTOptionsBuilder, DTColumnDefBuilder, schoolResourceApi, teamResourceApi, adminResourceApi) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4).notSortable(),
      DTColumnDefBuilder.newColumnDef(5)
    ];
    vm.exportExcel = function() {
      adminResourceApi.TeamRecordExport({
        team_id: $scope.selectTeam,
        start_date: vm.starttimeunix,
        end_date: vm.endtimeunix
      }, function(data) {
        window.open(data.data.file_url);
      })
    }
    vm.checkChange = function() {
      vm.starttimeunix = new Date(new Date(vm.starttime).getFullYear() + '-' + (new Date(vm.starttime).getMonth() + 1)).getTime() / 1000,
        vm.endtimeunix = new Date(new Date(vm.endtime).getFullYear() + '-' + (new Date(vm.endtime).getMonth() + 1)).getTime() / 1000;
      if (!vm.starttimeunix || !vm.endtimeunix || vm.starttimeunix >= vm.endtimeunix)
        getRecordListWithOutTime($scope.selectTeam);
      else
        getRecordListWithTime($scope.selectTeam, vm.starttimeunix, vm.endtimeunix)
    }

    function getRecordListWithTime(id, start, end) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        start_date: start,
        end_date: end,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }

    function getRecordListWithOutTime(id) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
    };

    // Disable weekend selection
    vm.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();

    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.startopened = true;
      }, 0, true)
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.endopened = true;
      }, 0, true)
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.dateOptions = {
      formatYear: '@',
      startingDay: 1,
      navigationAsDateFormat: true
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月';
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      console.log(toParams)
      $scope.selectTeam = toParams.id;
      getRecordListWithOutTime(toParams.id)
    });
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CheckApplyThingController', CheckApplyThingController)
    .filter('NowTime', NowTime)
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('lll');
      }
    }
  CheckApplyThingController.$inject = ['$scope', 'ngDialog', 'schoolResourceApi'];

  function CheckApplyThingController($scope, ngDialog, schoolResourceApi) {
    var vm = this;
    $scope.passApply=function(id){
      ngDialog.openConfirm({
              template: 'passconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              schoolResourceApi.PassThingApply({room_apply_id:id},function(data){
                getList();
              })
            }, function (reason) {
      });
    }
    $scope.rejectApply=function(id){
      ngDialog.openConfirm({
              template: 'rejectconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              schoolResourceApi.RejectThingApply({room_apply_id:id}).$promise.then(function(){
                getList();
              })
            }, function (reason) {
      });
    }
    function getList(){
      schoolResourceApi.ApplyThingList(function(data){
        vm.applys=data.data;
      })
    }
    getList();
  }
})();
(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('GoodListController', GoodListController);

    GoodListController.$inject = ['$scope','$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function GoodListController($scope,$filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        vm.goods=[];
        getGoodList();
        function getGoodList(){
          schoolResourceApi.GoodsQuery(function(data){
            vm.goods=data.data;
            console.log(vm.goods)
          })
        }
        vm.checkName = function(data) {
            if (!data||data=='') {
              return '商品名不能为空';
            }
        };
        vm.checkPrice=function(data){
            var re= /^[0-9]+$/;
            if (!re.test(data)) {
              return '请输入正确价格';
            }
        }
        vm.saveGood = function(good,id) {
          console.log(good,id)
          if(!!id){
            return adminResourceApi.EditGoods({goods_price:good.goods_price,goods_name:good.goods_name,goods_id:id},function(data){
               getGoodList();
            })
          }
          else
            return adminResourceApi.AddGoods(good,function(data){
               getGoodList();
            })
        };
        vm.removeGood = function(index,good) {
            $scope.deletedGood=good.good_name;
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.DelectGoods({goods_id:index});
              vm.goods.splice(index, 1);
            }, function (reason) {
            });
          };

          // add good
          vm.addGood = function() {
            vm.inserted = {
              goods_name: '',
              goods_price: ''
            };
            vm.goods.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter goods to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.goods, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          vm.cancel = function(rowform,id) {
            rowform.$cancel();
            if(!!!id)
            vm.goods.pop();
          };

        }
})();

/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .config(cookiesConfig)
    .controller('LoginController', LoginController);
  cookiesConfig.$inject = ['$cookiesProvider'];
  LoginController.$inject = ['$rootScope', '$scope', '$cookies', '$http', '$state', 'userResourceApi', 'USER_ROLES', 'AUTH_EVENTS'];

  function cookiesConfig($cookiesProvider){
    var date = new Date();
    $cookiesProvider.expires = date.setMinutes(date.getMinutes() + 20);
}
  function LoginController($rootScope, $scope, $cookies, $http, $state, userResourceApi, USER_ROLES, AUTH_EVENTS) {
    var vm = this;
    activate();
    $scope.logout = function() {
      removeSession();
      userResourceApi.logout(function(data) {
        $state.go('page.login');
      })
    }

    function setSession(id, role) {
      removeSession();
      $cookies.putObject('session', {
        sessionID: id,
        role: role
      })
    }

    function removeSession() {
      $cookies.remove('session');
    }

    function activate() {
      // bind here all data from the form
      vm.account = {};
      // place the message if something goes wrong
      vm.authMsg = '';

      vm.login = function() {
        vm.authMsg = '';
        if (vm.loginForm.$valid) {
          userResourceApi.login({
            username: vm.account.username,
            password: vm.account.password
          }).$promise.then(function(data) {
            if (data.status == 200) {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data.data.type);
              setSession(1, data.data.type.toString())
              switch (data.data.type.toString()) {
                case USER_ROLES.baseadmin:
                  $state.go('admin.secondAdmin');
                  break;
                case USER_ROLES.admin:
                  $state.go('admin.userManagement');
                  break;
                case USER_ROLES.teamleader:
                  $state.go('team.teamworker');
                  break;
                case USER_ROLES.teamworker:
                  $state.go('team.team');
                  break;
                case USER_ROLES.visitor:
                  $state.go('visitor.info');
                  break;
                default:
                  $state.go('page.login');
              }
            } else {
              vm.authMsg = '账号名或密码错误';
            }
          })
        } else {
          vm.loginForm.account_username.$dirty = true;
          vm.loginForm.account_password.$dirty = true;
        }
      };
    }
  }
})();
(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ModulesListController', ModulesListController);

    ModulesListController.$inject = ['$scope','$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function ModulesListController($scope,$filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        vm.sections=[];
        getModulesList();
        function getModulesList(){
          adminResourceApi.ModuleQuery(function(data){
            vm.sections=data.data;
            console.log(vm.sections)
          })
        }
        vm.checkName = function(data) {
            if (!data||data=='') {
              return '模块名不能为空';
            }
        };
        vm.saveModule = function(section,id) {
          console.log(section,id)
          if(!!id){
            return schoolResourceApi.ModuleEdit({section_id:id,name:section.name},function(data){
               getModulesList();
            })
          }
          else
            return schoolResourceApi.ModuleAdd(section,function(data){
               getModulesList();
            })
        };
        vm.removeModule= function(index,section) {
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default',
              data:{name:section.section_name},
              controller:['$scope',function(scope){
                scope.deletedModule=scope.ngDialogData.name;
              }]
            }).then(function (value) {
              schoolResourceApi.ModuleDelect({sections_id:index});
               getModulesList();
            }, function (reason) {
            });
          };

          // add section
          vm.addModule = function() {
            vm.inserted = {
              name: ''
            };
            vm.sections.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter sections to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.sections, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          vm.cancel = function(rowform,id) {
            rowform.$cancel();
            if(!!!id)
            vm.sections.pop();
          };

        }
})();

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('NestableController', NestableController);
  NestableController.$inject = ['schoolResourceApi', 'adminResourceApi', 'ngDialog']

  function NestableController(schoolResourceApi, adminResourceApi, ngDialog) {
    var vm = this;
    vm.type = 'in';
    vm.typeList = {
      'out': [{
        item: '建立级联后请移除该模块',
        children: []
      }],
      'in': [{
        item: '建立级联后请移除该模块',
        children: []
      }]
    }
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.getList = function() {
      schoolResourceApi.PaymentList(function(data) {
        vm.typeList = data.data ? angular.fromJson(data.data) : vm.typeList;
        vm.items = vm.typeList[vm.type];
      })
    }
    vm.getList();
    vm.typeChange = function() {
      vm.getList();
      console.log(vm.type)
    }
    vm.PaymentEdit = function(data) {
      adminResourceApi.PaymentEdit({
        payment_type_list: data
      }, function(data) {
        vm.openTimed('<h3 class="text-center text-success">保存成功</h3>')
      })
    }
    vm.unuseitems = [];
    vm.saveChange = function() {
      vm.typeList[vm.type] = vm.items;
      vm.PaymentEdit(angular.toJson(vm.typeList));
    }
    vm.addNest = function(item) {
      vm.unuseitems.push({
        item: item,
        children: []
      })
      vm.item = '';
    }
  }
})();

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('PageChangePasswordController', PageChangePasswordController);

    PageChangePasswordController.$inject = ['$scope','$http', '$state','$timeout','schoolResourceApi'];
    function PageChangePasswordController($scope,$http, $state,$timeout,schoolResourceApi) {
        var vm = this,timer;
          vm.account = {phone:'',checkCode:'',password:'',account_password_confirm:''};
          vm.submited=false;
          vm.authMsg = '';
          vm.register = function() {
            vm.authMsg = '';
            vm.submited=true;
            if(vm.registerForm.$valid) {
              schoolResourceApi.ChangePasswordUseCode({mobile:vm.account.phone,verify_code:vm.account.checkCode,new_password:vm.account.password}).$promise.then(function(data){
                $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 422:vm.authMsg='帐号不存在';break;
                  case 200:vm.successMsg='注册成功';$timeout(function(){$state.go('page.login');},3000,true);break;
                  default:break;
                 }
                },0,true)
                
              })
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_phone.$dirty = true;
              vm.registerForm.checkcode.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              
            }
          };
    }
})();

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('PostsViewController', PostsViewController)
    .filter('fromNow', fromNow)

  function fromNow(){
    return function(input,params){
      return moment.unix(input).fromNow();
    }
  }
  PostsViewController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog']

  function PostsViewController($scope, $timeout, $state, schoolResourceApi, ngDialog) {
    var vm = $scope;
    vm.comments=[];
    vm.submitted = false;
    vm.notMore=false;
    vm.validateInput = function(name, type) {
      var input = vm.replyFrom[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.replyTo=function(){
      vm.submitted = true;
      if (vm.replyFrom.$valid) {
        schoolResourceApi.PostRepplyQuery({post_id:vm.post_id,content:vm.reply}).$promise.then(function(data){
          vm.openTimed('<h3 class="text-center text-success">回复成功</h3>');
        })
      }
      else{
          vm.openTimed('<h3 class="text-center">请填写回复内容</h3>');
      }
      console.log(vm.reply)
    }
    function getDetail(id) {
      vm.post_id=id;
      schoolResourceApi.GetPostDetail({
        post_id: id
      }, function(data) {
        vm.recruit = data.data;
      })
    }
    vm.getMoreComment=function(id){
      schoolResourceApi.RepplyQuery({post_id:vm.post_id,is_refresh:0,reply_count:5,last_reply_id:id},function(data){
        if(data.data.length<5)
          vm.notMore=true;
        $timeout(function(){vm.comments=vm.comments.concat(data.data)},0,true);
      })
    }
    vm.getCommentList=function(id){
      schoolResourceApi.RepplyQuery({post_id:id,is_refresh:1,reply_count:5},function(data){
        if(data.data.length<5)
          vm.notMore=true;
        $timeout(function(){vm.comments=vm.comments.concat(data.data)},0,true);
      })
    }
    vm.$on('$stateChangeSuccess', function(event, toState, toParams) {
      getDetail(toParams.id);
      vm.getCommentList(toParams.id)
    });
  }
})();

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('RecoverController', RecoverController);

    RecoverController.$inject = ['$scope', '$state','schoolResourceApi'];
    function RecoverController($scope, $state,schoolResourceApi) {
        var vm = this;
          vm.resetPassword = function() {
            vm.authMsg = '';
            console.log(vm)
            if(vm.recoverForm.$valid) {
              schoolResourceApi.ForgetCode({mobile:vm.recoverForm.phone}).$promise.then(function(data){
                switch(data.status){
                  case 422:vm.authMsg = '手机号码不存在';break;
                  case 200:$state.go('page.changepassword');break;
                  default:vm.authMsg = '请输入正确的手机号码';break;
                }
              })
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.authMsg = '请输入正确的手机号码'
            }
          };
    }
})();


(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope','$http', '$state','$timeout','md5','schoolResourceApi'];
    function RegisterController($scope,$http, $state,$timeout,md5,schoolResourceApi) {
        var vm = this,timer;
          // bind here all data from the form
          vm.account = {};
          vm.submited=false;
          vm.checkboxShow=true;
          vm.checkCode='';
          vm.code='';
          vm.account.phone='';
          vm.register={password:'',account_password_confirm:''};
          vm.time=0;
          // place the message if something goes wrong
          vm.authMsg = '';
          vm.getCheckCode=function(){
            vm.authMsg='';
            if(vm.account.phone!=''){
              vm.checkboxShow=false;
              if(vm.time<=0){
                vm.time=60;
                schoolResourceApi.SendCode({mobile:vm.account.phone},function(data){
                  console.log(data.status,typeof data.status)
                  $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 420:vm.authMsg='手机号不存在';break;
                  default:break;
                 }
                 console.log(vm.authMsg)
                 vm.registerForm.account_phone.$dirty = false;
                },0,true)
                })
                timer=setInterval(function(){if(vm.time!=0)$timeout(function(){vm.time--;},0,true);else{$timeout(function(){vm.checkboxShow=true;clearInterval(timer)},0,true);}},1000)
              }
            }          
            else
              document.querySelector('input[name=account_phone]').focus();
          }
          vm.register = function() {
            vm.authMsg = '';

            if(vm.registerForm.$valid) {
              schoolResourceApi.Register({mobile:vm.account.phone,verify_code:vm.checkCode,password:vm.register.password}).$promise.then(function(data){
                console.log(data)
                $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 420:vm.authMsg='手机号不存在';break;
                  case 200:vm.successMsg='注册成功';$timeout(function(){$state.go('page.login');},3000,true);break;
                  default:break;
                 }
                },0,true)
                
              })
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_phone.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_agreed.$dirty = true;
              
            }
          };
    }
})();

/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('secondadminController', secondadminCtrlFn);

    secondadminCtrlFn.$inject = ['$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function secondadminCtrlFn($filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        activate();
        function getAdminList(){
          adminResourceApi.AdminList(function(data){
            vm.users=data.data;
          })
        }
        function activate() {
          
          getAdminList();
          vm.loadColleges = function(id) {
            return vm.colleges? null : schoolResourceApi.CollegeQuery(function(data){
                   vm.colleges=data.data;
                   vm.loadMajors(data.data[0].school_id);
            })
          };
          vm.loadMajors=function(id){
            return id? schoolResourceApi.MajorQuery({school_id:id},function(data){
                   vm.majors=data.data;
            }):null;
          }
          vm.showColleges = function(user) {
            if(user.school_id && vm.colleges.length) {
              var selected = $filter('filter')(vm.colleges, {id: user.school_name});
              return selected.length ? selected[0].text : '暂无';
            } else {
              return user.school_name || '暂无';
            }
          };
          vm.showMajors = function(user) {
            if(user.major_id && vm.Majors.length) {
              var selected = $filter('filter')(vm.Majors, {id: user.major_name});
              return selected.length ? selected[0].text : '暂无';
            } else {
              return user.major_name || '暂无';
            }
          };

          vm.checkLoginname = function(data,name) {
            if (!data||data.length<6) {
              return '登录账号必须超过六位';
            }
            for(var i=0,len=vm.users.length-1;i<len;i++){
              if(data==vm.users[0].login_name)
                return '该用户名已存在';
            }
          };
          vm.checkName = function(data) {
            if (!data||data=='') {
              return '姓名不能为空';
            }
          };
          vm.checkPhone=function(data){
            var re= /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})$/;
            if (!data||data.length!==11||!re.test(data)) {
              return '请输入正确的手机号码';
            }
          }
          vm.checkID=function(data){
            if (!data) {
              return '请选择';
            }
          }
          vm.saveUser = function(user) {
            console.log(user)
            return adminResourceApi.AddAdmin({
              login_name:user.login_name,
              name:user.name,
              school_id:user.school_name,
              major_id:user.major_name,
              phone:user.phone,
              password:APP_PARMAS.DefaultPassword
            },function(data){
               getAdminList();
            })
          };


          // remove user
          vm.removeUser = function(index,id) {
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.RemoveAdmin({user_id:id});
              vm.users.splice(index, 1);
            }, function (reason) {
            });
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              login_name: '',
              name: '',
              school_name: '',
              major_name:'',
              phone:'',
              password:APP_PARMAS.DefaultPassword
            };
            vm.users.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter users to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          // cancel all changes
          vm.cancel = function(rowform) {
            console.log('cancel')
            rowform.$cancel();
            vm.users.pop();
          };

          // save edits
          vm.saveTable = function() {
            var results = [];
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // actually delete user
              if (user.isDeleted) {
                vm.users.splice(i, 1);
              }
              // mark as not new 
              if (user.isNew) {
                user.isNew = false;
              }

              // send on server
              // results.push($http.post('/saveUser', user));
              console.log('Saving Table...');
            }

            return $q.all(results);
          };

        }
    }
})();

/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('TablexEditableController', TablexEditableController);

    TablexEditableController.$inject = ['$filter', '$http', 'editableOptions', 'editableThemes','$q'];
    function TablexEditableController($filter, $http, editableOptions, editableThemes, $q) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // editable row
          // ----------------------------------- 
          vm.users = [
            {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
            {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
            {id: 3, name: 'awesome user3', status: 2, group: null}
          ];

          vm.statuses = [
            {value: 1, text: 'status1'},
            {value: 2, text: 'status2'},
            {value: 3, text: 'status3'},
            {value: 4, text: 'status4'}
          ];

          vm.groups = [];
          vm.loadGroups = function() {
            return vm.groups.length ? null : $http.get('server/xeditable-groups.json').success(function(data) {
              vm.groups = data;
            });
          };

          vm.showGroup = function(user) {
            if(user.group && vm.groups.length) {
              var selected = $filter('filter')(vm.groups, {id: user.group});
              return selected.length ? selected[0].text : 'Not set';
            } else {
              return user.groupName || 'Not set';
            }
          };

          vm.showStatus = function(user) {
            var selected = [];
            if(user.status) {
              selected = $filter('filter')(vm.statuses, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
          };

          vm.checkName = function(data, id) {
            if (id === 2 && data !== 'awesome') {
              return 'Username 2 should be `awesome`';
            }
          };

          vm.saveUser = function(data, id) {
            //vm.user not updated yet
            angular.extend(data, {id: id});
            console.log('Saving user: ' + id);
            // return $http.post('/saveUser', data);
          };

          // remove user
          vm.removeUser = function(index) {
            vm.users.splice(index, 1);
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              id: vm.users.length+1,
              name: '',
              status: null,
              group: null,
              isNew: true
            };
            vm.users.push(vm.inserted);
          };

          // editable column
          // ----------------------------------- 


          vm.saveColumn = function(column) {
            var results = [];
            angular.forEach(vm.users, function(/*user*/) {
              // results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
              console.log('Saving column: ' + column);
            });
            return $q.all(results);
          };

          // editable table
          // ----------------------------------- 

          // filter users to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          // cancel all changes
          vm.cancel = function() {
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // undelete
              if (user.isDeleted) {
                delete user.isDeleted;
              }
              // remove new 
              if (user.isNew) {
                vm.users.splice(i, 1);
              }
            }
          };

          // save edits
          vm.saveTable = function() {
            var results = [];
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // actually delete user
              if (user.isDeleted) {
                vm.users.splice(i, 1);
              }
              // mark as not new 
              if (user.isNew) {
                user.isNew = false;
              }

              // send on server
              // results.push($http.post('/saveUser', user));
              console.log('Saving Table...');
            }

            return $q.all(results);
          };

        }
    }
})();

/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamAccountController', TeamAccountController);

  TeamAccountController.$inject = ['$filter', '$http', '$scope', 'ngDialog', 'editableOptions', 'editableThemes', '$q', 'teamResourceApi'];

  function TeamAccountController($filter, $http, $scope, ngDialog, editableOptions, editableThemes, $q, teamResourceApi) {
    var vm = this;

    activate();
    $scope.openTimed = function (title,info) {
            var dialog = ngDialog.open({
              template: '<h3 class="text-center">'+title+'</h3><p class="text-center">'+info+'</p>',
              plain: true,
              closeByDocument: false,
              closeByEscape: false
            });
            setTimeout(function () {
              dialog.close();
            }, 2000);
    };
    $scope.DecreaseAllMoney = function() {
      ngDialog.openConfirm({
          template: 'AllDecrease',
          className: 'ngdialog-theme-default',
          controller: ['$scope',function($scope){
            $scope.Decrease={
              money:'',
              reason:''
            }
          }]
        })
        .then(function(value) {
          var info='',title='',ids=[];
          for(var i in vm.teams){
            ids.push(vm.teams[i].team_id)
          }
          ids.join(',');
          ids='['+ids+']';
          if(value.money!=''&&value.reason!='')
            teamResourceApi.DecreaseAllMoney({team_ids:ids,amount:value.money,reason:value.reason}).$promise.then(function(data){
              switch(data.status){
                case 200:title='操作成功';info='批量扣钱成功';break;
                case 464:title='操作失败';info='操作失败';break;
                case 112:title='操作失败';info='参数错误';break;
                default:title='操作失败';info='参数错误';break;
              }
              $scope.openTimed(title,info)
              activate();
            })
        }, function(value) {
          console.log('rejected:' + value);

        });
    };
    $scope.IncreaseAllMoney = function() {
      ngDialog.openConfirm({
          template: 'AllIncrease',
          className: 'ngdialog-theme-default',
          controller: ['$scope',function($scope){
            $scope.Increase={
              money:'',
              reason:''
            }
          }]
        })
        .then(function(value) {
          var info='',title='',ids=[];
          for(var i in vm.teams){
            ids.push(vm.teams[i].team_id)
          }
          ids.join(',');
          ids='['+ids+']';
          if(value.money!=''&&value.reason!='')
            teamResourceApi.IncreaseAllMoney({team_ids:ids,amount:value.money,reason:value.reason}).$promise.then(function(data){
              switch(data.status){
                case 200:title='操作成功';info='批量加钱成功';break;
                case 464:title='操作失败';info='操作失败';break;
                case 112:title='操作失败';info='参数错误';break;
                default:title='操作失败';info='参数错误';break;
              }
              $scope.openTimed(title,info)
              activate();
            })
        }, function(value) {
          console.log('rejected:' + value);
        });
    };
    $scope.DecreaseMoney = function(id) {
      ngDialog.openConfirm({
          template: 'Decrease',
          className: 'ngdialog-theme-default',
          controller: ['$scope',function($scope){
            $scope.Decrease={
              id:id,
              money:'',
              reason:''
            }
          }]
        })
        .then(function(value) {
          var info='',title='';
          if(!!value.id&&value.money!=''&&value.reason!='')
            teamResourceApi.DecreaseAccount({team_id:value.id,amount:value.money,reason:value.reason}).$promise.then(function(data){
              switch(data.status){
                case 200:title='操作成功';info='扣钱成功';break;
                case 464:title='操作失败';info='该团队不存在';break;
                case 112:title='操作失败';info='参数错误';break;
                default:title='操作失败';info='参数错误';break;
              }
              $scope.openTimed(title,info)
              activate();
            })
        }, function(value) {
          console.log('rejected:' + value);

        });
    };
    $scope.IncreaseMoney = function(id) {
      ngDialog.openConfirm({
          template: 'Increase',
          className: 'ngdialog-theme-default',
          controller: ['$scope',function($scope){
            $scope.Increase={
              id:id,
              money:'',
              reason:''
            }
          }]
        })
        .then(function(value) {
          var info='',title='';
          if(!!value.id&&value.money!=''&&value.reason!='')
            teamResourceApi.IncreaseAccount({team_id:value.id,amount:value.money,reason:value.reason}).$promise.then(function(data){
              switch(data.status){
                case 200:title='操作成功';info='加钱成功';break;
                case 464:title='操作失败';info='该团队不存在';break;
                case 112:title='操作失败';info='参数错误';break;
                default:title='操作失败';info='参数错误';break;
              }
              $scope.openTimed(title,info)
              activate();
            })
        }, function(value) {
          console.log('rejected:' + value);
        });
    };
    function activate() {
      teamResourceApi.AccountQuery(function(data) {
        console.log(data); 
        vm.teams = data.data;
      })
    }
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamCheckController', TeamCheckController)
    .filter('NowTime', NowTime)
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('ll');
      }
    }
  TeamCheckController.$inject = ['$scope', '$filter', 'ngDialog', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'adminResourceApi', 'APP_PARMAS'];

  function TeamCheckController($scope, $filter, ngDialog, editableOptions, editableThemes, $q, schoolResourceApi, adminResourceApi, APP_PARMAS) {
    var vm = this;
    $scope.passApply=function(id){
      ngDialog.openConfirm({
              template: 'passconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.PassTeamApply({application_id:id},function(data){
                getTeamList();
              })
            }, function (reason) {
      });
    }
    $scope.getExcel=function(id){
      adminResourceApi.GetTeamcheckExcel({application_id:id},function(data){
        window.open('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'+data.data.content);
      })
    }
    $scope.rejectApply=function(id){
      ngDialog.openConfirm({
              template: 'rejectconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.RejectTeamApply({application_id:id}).$promise.then(function(){
                getTeamList();
              })
            }, function (reason) {
      });
    }
    function getTeamList() {
      adminResourceApi.CreateTeamApplyQuery(function(data) {
        vm.teams = data.data;
      })
    }
    getTeamList();
    vm.showApplyDetail=function(id){
      ngDialog.open({
          template: 'ApplyDetail',
          data:{id:id},
          controller:DetailCtrl
      });
    } 
    DetailCtrl.$inject=['$scope'];  
    function DetailCtrl($scope){
      adminResourceApi.TeamApplyDetailQuery({application_id:$scope.ngDialogData.id}).$promise.then(function(data){
       $scope.detail=data.data.content;
      })
     }
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamListController', TeamListCtrlFn);

  TeamListCtrlFn.$inject = ['$scope', '$filter', '$http', 'ngDialog', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'adminResourceApi', 'APP_PARMAS'];

  function TeamListCtrlFn($scope, $filter, $http, ngDialog, editableOptions, editableThemes, $q, schoolResourceApi, adminResourceApi, APP_PARMAS) {
    var vm = this;
    vm.states = [{
      id: false,
      name: '软性入驻'
    }, {
      id: true,
      name: '硬性入驻'
    }]

    function getTeamList() {
      adminResourceApi.TeamListQuery(function(data) {
        vm.teams = data.data;
      })
    }
    vm.saveUser = function(data, id) {
      console.log(data, id)
      adminResourceApi.TeamSettleEdit({
        team_id: id,
        type: data.type ? 1 : 0
      }).$promise.then(function(data) {
        console.log(data);
      })
    }
    getTeamList();
    vm.removeTeam = function(name,id) {
      ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default',
              data:{name:name},
              controller:['$scope',function(scope){
                scope.deletedTeam=scope.ngDialogData.name;
              }]
            }).then(function (value) {
              adminResourceApi.RemoveTeam({team_id:id},function(data){
                getTeamList();
              });
            }, function (reason) {
      });
    }
    vm.showStates = function(user) {
      if (user.is_settled && vm.states.length) {
        var selected = $filter('filter')(vm.states, {
          id: user.is_settled
        });
        return selected.length ? selected[0].name : '暂无数据';
      } else {
        if (user.is_settled)
          return APP_PARMAS.TEAMSTATE[1] || '暂无数据';
        return APP_PARMAS.TEAMSTATE[0] || '暂无数据';
      }
    };

    vm.filterUser = function(user) {
      return user.isDeleted !== true;
    };

    // mark user as deleted
    vm.deleteUser = function(id) {
      var filtered = $filter('filter')(vm.teams, {
        id: id
      });
      if (filtered.length) {
        filtered[0].isDeleted = true;
      }
    };

    // cancel all changes
    vm.cancel = function(rowform) {
      console.log('cancel')
      rowform.$cancel();
      vm.teams.pop();
    };
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseTeamRecordController', BaseTeamRecordController)
    .filter('NowTime', NowTime)
    .filter('TypeFilter', TypeFilter)
    .filter('MoneyFilter', MoneyFilter);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('l');
    }
  }
  function MoneyFilter() {
    return function(input, params) {
      return input > 0 ? '+' + input : input;
    }
  }

  function TypeFilter() {
    return function(input, params) {
      return input == 0 ? '管理员加钱' : input == 1 ? '管理员扣钱' : '团队支出';
    }
  }

  BaseTeamRecordController.$inject = ['$scope', '$timeout', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'schoolResourceApi', 'teamResourceApi', 'adminResourceApi'];

  function BaseTeamRecordController($scope, $timeout, DTOptionsBuilder, DTColumnDefBuilder, schoolResourceApi, teamResourceApi, adminResourceApi) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3).notSortable(),
      DTColumnDefBuilder.newColumnDef(4)
    ];
    vm.exportExcel = function() {
      teamResourceApi.ExportFlowExecl({
        team_id: $scope.selectTeam,
        start_date: vm.starttimeunix,
        end_date: vm.endtimeunix
      }, function(data) {
        window.open(data.data.file_url);
      })
    }
    vm.checkChange = function() {
      vm.starttimeunix = new Date(new Date(vm.starttime).getFullYear() + '-' + (new Date(vm.starttime).getMonth() + 1)).getTime() / 1000,
        vm.endtimeunix = new Date(new Date(vm.endtime).getFullYear() + '-' + (new Date(vm.endtime).getMonth() + 1)).getTime() / 1000;
      if (!vm.starttimeunix || !vm.endtimeunix || vm.starttimeunix >= vm.endtimeunix)
        getRecordListWithOutTime($scope.selectTeam);
      else
        getRecordListWithTime($scope.selectTeam, vm.starttimeunix, vm.endtimeunix)
    }
    vm.changeList = function() {
      getRecordListWithOutTime($scope.selectTeam)
    }
    activate();

    function activate() {

      schoolResourceApi.TeamQuery(function(data) {
        vm.teams = data.data;
        $scope.selectTeam = data.data[0].team_id;
        getRecordListWithOutTime(data.data[0].team_id)
      })
    }

    function getRecordListWithTime(id, start, end) {
      schoolResourceApi.AdminRecordQuery({
        team_id: id,
        start_date: start,
        end_date: end,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }

    function getRecordListWithOutTime(id) {
      schoolResourceApi.AdminRecordQuery({
        team_id: id,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
    };

    // Disable weekend selection
    vm.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();

    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.startopened = true;
      }, 0, true)
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.endopened = true;
      }, 0, true)
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.dateOptions = {
      formatYear: '@',
      startingDay: 1,
      navigationAsDateFormat: true
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月';
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('usermanagementController', userManagementCtrlFn);

    userManagementCtrlFn.$inject = ['$scope','$timeout','$filter', '$http', 'editableOptions', 'editableThemes','$q','schoolResourceApi','teamResourceApi','adminResourceApi','APP_PARMAS'];
    function userManagementCtrlFn($scope,$timeout,$filter, $http, editableOptions, editableThemes, $q,schoolResourceApi,teamResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        activate();
        function activate() {

          schoolResourceApi.TeamQuery(function(data){
            vm.teams=data.data;
            $scope.selectTeam=data.data[0].team_id;
            vm.loadUserList();
          })
          vm.types=[
            {id:0,name:'主要负责人'},
            {id:1,name:'次要负责人'},
            {id:2,name:'普通成员'}           
          ]
          $scope.selectType=vm.types[0].id;
          vm.loadUserList=function(){
            adminResourceApi.TeamMemberListQuery({type:$scope.selectType,team_id:$scope.selectTeam},function(data){
              vm.users=data.data;
              console.log(data)
            })
          }

          vm.loadColleges = function(id) {
            return vm.colleges? null : schoolResourceApi.CollegeQuery(function(data){
                   vm.colleges=data.data;
                   vm.loadMajors(data.data[0].school_id);
            })
          };
          vm.loadMajors=function(id){
            return id? schoolResourceApi.MajorQuery({school_id:id},function(data){
                   vm.majors=data.data;
            }):null;
          }
          vm.showColleges = function(user) {
            if(user.school_name &&vm.colleges&& vm.colleges.length) {
              var selected = $filter('filter')(vm.colleges, {school_name: user.school_name});
              console.log(selected[0].school_name)
              return selected.length ? selected[0].school_name : '暂无';
            } else {
              return user.school_name || '暂无';
            }
          };
          vm.showRole = function(user) {
            if(user.type && vm.types.length) {
              var selected = $filter('filter')(vm.types, {id: user.type});
              return selected.length ? selected[0].name : '暂无';
            } else {
              return APP_PARMAS.TEAMROLENAME[user.type] || '暂无';
            }
          };
          vm.showMajors = function(user) {
            if(user.major_name && vm.majors&&vm.majors.length) {
              var selected = $filter('filter')(vm.majors, {major_name: user.major_name});
              return selected.length ? selected[0].major_name : '暂无';
            } else {
              return user.major_name || '暂无';
            }
          };

          vm.checkName = function(data) {
            if (!data||data=='') {
              return '姓名不能为空';
            }
          };
          vm.checkPhone=function(data){
            var re= /^(13[0-9]{9})|(15[0-9]{9})$/;
            if (!data||data.length!==11||!re.test(data)) {
              return '请输入正确的手机号码';
            }
          }
          vm.checkID=function(data){
            if (!data) {
              return '请选择';
            }
          }

          // remove user
          vm.removeUser = function(index) {
            vm.users.splice(index, 1);
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              name: '',
              school_name: '',
              major_name:'',
              team_name:'',
              type:'',
              password:APP_PARMAS.DefaultPassword
            };
            vm.users.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter users to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          // cancel all changes
          vm.cancel = function(rowform) {
            rowform.$cancel();
          };

          // save edits
          vm.saveTable = function() {
            var results = [];
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // actually delete user
              if (user.isDeleted) {
                vm.users.splice(i, 1);
              }
              // mark as not new 
              if (user.isNew) {
                user.isNew = false;
              }

              // send on server
              // results.push($http.post('/saveUser', user));
              console.log('Saving Table...');
            }

            return $q.all(results);
          };

        }
    }
})();

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ApplyThingController', ApplyThingController);

  ApplyThingController.$inject = ['$scope', '$http', '$timeout', '$state', 'teamResourceApi', 'ngDialog'];

  function ApplyThingController($scope, $http, $timeout, $state, teamResourceApi, ngDialog) {
    var vm = $scope,
    NOW=new Date();
    vm.apply = {
      applything: '',
      endtime:null,
      starttime:null,
      startMinue:NOW,
      endMinue:NOW
    };
    vm.apply.hstep = 1;
    vm.apply.mstep = 15;

    vm.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };
    vm.ismeridian = true;
    vm.toggleMode = function() {
      vm.ismeridian = !vm.ismeridian;
    };
    vm.update = function() {
      var d = new Date();
      d.setHours(14);
      d.setMinutes(0);
      vm.mytime = d;
    };

    vm.changed = function() {
      console.log('Time changed to: ' + vm.apply.startMinue);
    };

    vm.setApplyThing = function(value) {
      vm.apply.applything = value;
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
      vm.apply.startMinue=null;
      vm.apply.endMinue=null;
    };
    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();
    vm.startdisabled = function(date, mode) {
      return (mode === 'day' && (date.getTime() < (new Date().getTime())));
    };
    vm.enddisabled = function(date, mode) {
      return (mode === 'day' && (date.getTime() <= (new Date().getTime())));
    };
    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.apply.startopened = true;
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      console.log('open')
      vm.apply.minDate = vm.apply.starttime ? new Date(vm.apply.starttime) : new Date();
      vm.apply.endopened = true;
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.finishApply = function() {
      var starttime = Math.round(new Date(vm.apply.starttime).getTime() / 1000) + (new Date(vm.apply.startMinue).getHours()) * 3600 + (new Date(vm.apply.startMinue).getMinutes()) * 60,
        endtime = Math.round(new Date(vm.apply.endtime).getTime() / 1000) + (new Date(vm.apply.endMinue).getHours()) * 3600 + (new Date(vm.apply.endMinue).getMinutes()) * 60;
      if (starttime < endtime && vm.apply.applything != '')
        teamResourceApi.ApplyForThing({
          place_name: vm.apply.applything,
          start_time: starttime,
          end_time: endtime
        }, function(data) {
          if (data.status == 200)
            vm.openTimed('<h3 class="text-center text-success">申请成功</h3><p class="text-center">请耐心等候管理员审批</p>')
          $timeout(function() {
            $state.go('team.suportlist')
          }, 2000, true)
        })
      else
        vm.openTimed('<h3 class="text-center">时间填写有误</h3><p class="text-center">请认真核对起止时间，开始使用时间不能大于停止使用时间</p>')
    }
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月-dd日';
  }
})();
/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$http','$timeout', '$state','schoolResourceApi'];

  function ChangePasswordController($http,$timeout, $state,schoolResourceApi) {
    var vm = this;
    vm.account = {};
    vm.changePassword={};
    // place the message if something goes wrong
    vm.authMsg = '';

    vm.changePassword = function() {
      vm.authMsg = '';
      vm.successInfo='';
      if (vm.changePasswordForm.$valid) {
        schoolResourceApi.ChangeUserPassword({old_password:vm.account.old_password,new_password:vm.changePassword.password},function(data){
          switch(data.status){
            case 200:vm.successInfo='修改成功,请重新登录';$timeout(function(){$state.go('page.login')},3000,true);break;
            case 430:vm.authMsg='密码不正确';break;
            case 130:vm.authMsg='密码长度不合法';break;
            case 131:vm.authMsg='密码格式不合法';break;
            default:vm.authMsg='修改失败';break;
          }
        })
      } else {
        vm.registerForm.account_email.$dirty = true;
        vm.registerForm.account_password.$dirty = true;
        vm.registerForm.account_agreed.$dirty = true;

      }
    };
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('JoinerController', JoinerController)
    .filter('typeFormat', typeFormat)
  typeFormat.$inject = ['APP_PARMAS'];

  function typeFormat(APP_PARMAS) {
    return function(input, parmas) {
      return APP_PARMAS.TEAMROLENAME[input] || '';
    }
  }
  JoinerController.$inject = ['$scope', '$timeout', 'ngDialog', '$http', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'teamResourceApi', 'userResourceApi', 'APP_PARMAS'];

  function JoinerController($scope, $timeout, ngDialog, $http, editableOptions, editableThemes, $q, schoolResourceApi, teamResourceApi, userResourceApi, APP_PARMAS) {
    var vm = this;
    $scope.passApply = function(id) {
      ngDialog.openConfirm({
        template: 'passconfirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.PassNewWorker({
          request_id: id
        }, function(data) {
          getTeamList();
        })
      }, function(reason) {});
    }
    $scope.rejectApply = function(id) {
      ngDialog.openConfirm({
        template: 'rejectconfirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.RejectNewWorker({
          request_id: id
        }).$promise.then(function() {
          getTeamList();
        })
      }, function(reason) {});
    }
    getTeamList();
    function getTeamList(){
      teamResourceApi.JoinerQuery(function(data) {
        vm.joiners = data.data;
        // vm.joiners=[{request_id:1,user_id:1,name:"小明",recruit_id:1,title:"招聘标题",mobile:"12345678901",qq:"123466"}];
        console.log(vm.joiners)
      })
    }

  }
})();
(function() {
    'use strict';

    angular
      .module('app.controllers')
      .controller('RecruitCmpostController', RecruitCmpostController)
    RecruitCmpostController.$inject = ['$scope', '$timeout', '$state', 'teamResourceApi', 'ngDialog']

    function RecruitCmpostController($scope, $timeout, $state, teamResourceApi, ngDialog) {
      var vm = this;
      $scope.authMsg = '';
      $scope.header = '';
      vm.validateInput = function(name, type) {
        var input = vm.formValidate[name];
        return (input.$dirty || vm.submitted) && input.$error[type];
      };
      vm.openTimed = function (info) {
            var dialog = ngDialog.open({
              template: info,
              plain: true,
              closeByDocument: false,
              closeByEscape: false
            });
            setTimeout(function () {
              dialog.close();
            }, 2000);
      };
      vm.newRecruit = function() {
        vm.submitted = true;
        if(vm.post.content==''){
          vm.openTimed('<p class="text-center">请填写招聘内容</p>')
        }
        else if (vm.formValidate.$valid) {
              teamResourceApi.AddRecruit(vm.post,function(data){
                if(data.status==200){
                  vm.openTimed('<h3 class="text-center text-success">发布成功</h3>');
                  $state.go('team.recruit');
                }
                else
                  vm.openTimed('<h3 class="text-center text-danger">发布失败</h3>')
              })
            } else {
              vm.openTimed('<p class="text-center text-danger">请填写必要信息</p>')
              return false;
            }
        }
      }
      })();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('RecruitViewController', RecruitViewController)
    .filter('NowTime', NowTime)

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('ll');
    }
  }
  RecruitViewController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog']

  function RecruitViewController($scope, $timeout, $state, schoolResourceApi, ngDialog) {
    var vm = $scope;

    function getDetail(id) {
      schoolResourceApi.GetRecruitDetail({
        recruit_id: id
      }, function(data) {
        vm.recruit = data.data;
      })
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      getDetail(toParams.mid);
    });
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('SuportListController', SuportListController)
    .filter('NowTime', NowTime)
    .filter('statusFilter', statusFilter)
    function statusFilter(){
      return function(input,params){
        return input==0?'未审核':input==1?'已通过':'已否决';
      }
    }
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('lll');
      }
    }
  SuportListController.$inject = ['$scope', 'ngDialog', 'schoolResourceApi'];

  function SuportListController($scope, ngDialog, schoolResourceApi) {
    var vm = this;
    function getList(){
      schoolResourceApi.ApplyThingList(function(data){
        vm.applys=data.data;
      })
    }
    getList();
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamIntroduceCtroller', TeamIntroduceCtroller)

  TeamIntroduceCtroller.$inject = ['$scope', '$timeout', 'ngDialog', 'schoolResourceApi', 'APP_PARMAS', 'teamResourceApi']

  function TeamIntroduceCtroller($scope, $timeout, ngDialog, schoolResourceApi, PP_PARMAS, teamResourceApi) {
    var vm = this;
    $scope.content = '';
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.reset = function() {
      vm.myImage = '';
      vm.myCroppedImage = '';
      vm.myImage = '';
      vm.imgcropType = 'square';
      schoolResourceApi.TeamDetailGet(function(data) {
        $timeout(function() {
          $scope.content = data ? data.data.description : '';
          vm.myCroppedImage = data ? 'data:image/png;base64,' + data.data.logo_base64 : '';
        }, 0, true)
      })
    };

    function DataWrap(str) {
      console.log(str)
      return 'data:image/png;base64,' + str;
    }
    vm.reset();

    var handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function( /*$scope*/ ) {
          vm.myImage = evt.target.result;
        });
      };
      if (file)
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    vm.saveIntroduce = function() {
      var transition = vm.myCroppedImage.slice(22);
      var dialog = ngDialog.open({
        template: '<div class="panel-body loader-demo"><div class="sk-spinner sk-spinner-double-bounce"><div class="sk-double-bounce1"></div><div class="sk-double-bounce2"></div></div></div>',
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      teamResourceApi.UpdateIntroduce({
        team_logo: transition,
        description: $scope.content,
        project_description: ' '
      }, function(data) {
        dialog.close();
      })
    }
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamOrderController', TeamOrderController)
    .filter('NowTime', NowTime)
    .filter('TypeFilter', TypeFilter)
    .filter('MoneyFilter', MoneyFilter);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('l');
    }
  }

  function MoneyFilter() {
    return function(input, params) {
      return input > 0 ? '+' + input : input;
    }
  }

  function TypeFilter() {
    return function(input, params) {
      return input == 0 ? '管理员加钱' : input == 1 ? '管理员扣钱' : '团队支出';
    }
  }

  TeamOrderController.$inject = ['$scope', '$timeout', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'schoolResourceApi', 'teamResourceApi', 'adminResourceApi'];

  function TeamOrderController($scope, $timeout, DTOptionsBuilder, DTColumnDefBuilder, schoolResourceApi, teamResourceApi, adminResourceApi) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4).notSortable(),
      DTColumnDefBuilder.newColumnDef(5)
    ];
    vm.exportExcel = function() {
      adminResourceApi.TeamRecordExport({
        team_id: $scope.selectTeam,
        start_date: vm.starttimeunix,
        end_date: vm.endtimeunix
      }, function(data) {
        window.open(data.data.file_url);
      })
    }
    vm.checkChange = function() {
      vm.starttimeunix = new Date(new Date(vm.starttime).getFullYear() + '-' + (new Date(vm.starttime).getMonth() + 1)).getTime() / 1000,
        vm.endtimeunix = new Date(new Date(vm.endtime).getFullYear() + '-' + (new Date(vm.endtime).getMonth() + 1)).getTime() / 1000;
      if (!vm.starttimeunix || !vm.endtimeunix || vm.starttimeunix >= vm.endtimeunix)
        getRecordListWithOutTime($scope.selectTeam);
      else
        getRecordListWithTime($scope.selectTeam, vm.starttimeunix, vm.endtimeunix)
    }

    function getRecordListWithTime(id, start, end) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        start_date: start,
        end_date: end,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }

    function getRecordListWithOutTime(id) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
    };

    // Disable weekend selection
    vm.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();

    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.startopened = true;
      }, 0, true)
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.endopened = true;
      }, 0, true)
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.dateOptions = {
      formatYear: '@',
      startingDay: 1,
      navigationAsDateFormat: true
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月';
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      console.log(toParams)
      $scope.selectTeam = toParams.id;
      getRecordListWithOutTime(toParams.id)
    });
  }
})();
/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamPostController', TeamPostController)
    .filter('fromNow', fromNow)
    .filter('removeTag', removeTag);

  function fromNow() {
    return function(input, params) {
      return moment.unix(input).fromNow();
    }
  }

  function removeTag() {
    return function(input, params) {
      input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      input = input.replace(/ /ig, '');
      return input;
    }
  }
  TeamPostController.$inject = ['$timeout', '$state', '$q', 'teamResourceApi', 'paginationConfig', 'ngDialog']

  function TeamPostController($timeout, $state, $q, teamResourceApi, paginationConfig, ngDialog) {
    var vm = this;
    vm.maxSize = 1; //最大页码数
    vm.bigCurrentPage = 1;
    vm.selectAll = false;
    vm.delectAllPosts = function() {
      $timeout(function() {}, 0, true);
      console.log(vm.posts)
    }
    vm.gotoDetail = function(id) {
      $state.go('team.view', {
        mid: id
      });
    }
    vm.delectAllPosts = function() {
      var ids = [],
        promiseList = [];
      for (var i in vm.posts) {
        if (vm.posts[i].selected)
          ids.push(vm.posts[i].recruit_id)
      };
      if (ids.length > 0) {
        ngDialog.openConfirm({
          template: 'allconfirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          for (var i = 0, len = ids.length; i < len; i++)
            promiseList.push(teamResourceApi.DelectRecruit({
              recruit_id: ids[i]
            }).$promise);
          $q.all(promiseList).then(function(){
            vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
            vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
          })
        }, function(reason) {});
      } else
        vm.openTimed('<h3 class="text-center">请选择要删除的文章</h3>');
    }
    vm.checkAll = function(event) {
      event.stopPropagation();
      vm.selectAll = !vm.selectAll;
      $timeout(function() {
        for (var i in vm.posts) {
          vm.posts[i]['selected'] = vm.selectAll;
        };
      }, 0, true)
    }
    vm.delectPost = function(id) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.DelectRecruit({
          recruit_id: id
        }, function(data) {
          vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
          vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
        })
      }, function(reason) {});
    }
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.getPostList = function(num, size) {
      teamResourceApi.RecruitQuery({
        page_num: num,
        page_size: size
      }, function(data) {
        for (var i in data.data.recruit_list) {
          data.data.recruit_list[i]['selected'] = false;
        };
        $timeout(function() {
          vm.posts = data.data.recruit_list;
          vm.bigTotalItems = data.data.recruit_count;
        }, 0, true)
      })
    }
    vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)

    function activate() {
      vm.pageChanged = function() {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
      };

      vm.maxSize = 5;
    }
    activate();
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamRecordController', TeamRecordController);

  TeamRecordController.$inject = ['$scope', '$anchorScroll', '$location', 'teamResourceApi', 'schoolResourceApi', 'ngDialog'];

  function TeamRecordController($scope, $anchorScroll, $location, teamResourceApi, schoolResourceApi, ngDialog) {
    var vm = this;
    vm.dateList = [];
    vm.secondType = vm.firstType = '暂无';
    vm.typeList = {
      'out': [{
        item: '暂无类型',
        children: []
      }],
      'in': [{
        item: '暂无类型',
        children: []
      }]
    }
    vm.ColorRandom = function(i) {
      var color = ['timeline-badge primary', 'timeline-badge warning', 'timeline-badge danger', 'timeline-badge info', 'timeline-badge success'];
      return color[i];
    }
    vm.gotoEdit = function() {
      document.querySelector('input[name=amount]').focus();
    }
    vm.getTypeList = function() {
      schoolResourceApi.PaymentList(function(data) {
        vm.typeList = data.data ? angular.fromJson(data.data) : vm.typeList;
        vm.typeItems = vm.typeList[vm.todo.type];
        console.log(vm.typeItems)
        vm.firstType = vm.typeItems[0].item;
        vm.getSecondList();
      })
    }
    vm.getSecondList = function() {
      console.log(vm.typeItems)
      for (var i in vm.typeItems)
        if (vm.typeItems[i].item == vm.firstType)
          vm.secondTypeItems = vm.typeItems[i].children ? vm.typeItems[i].children : [{
            item: '暂无'
          }];
      vm.secondType = vm.secondTypeItems[0].item;
    }
    activate();

    function activate() {
      function haskey(obj, key) {
        for (var i in obj) {
          if (i == key)
            return true;
        }
        return false;
      }
      vm.gotoTarget = function(event, target) {
        vm.selectDate = target;
        $location.hash(target);
        $anchorScroll();
      }
      vm.isEmpty = function(obj) {
        var i = 0;
        for (var key in obj) {
          ++i;
        }
        return !!!i;
      }

      function getList() {
        vm.items = {};
        vm.getTypeList();
        teamResourceApi.FlowListQuery({
          page_num: 1,
          page_size: 100
        }, function(data) {
          for (var i in data.data.flow_list) {
            data.data.flow_list[i].add_time = moment.unix(data.data.flow_list[i].add_time).format('L');
            data.data.flow_list[i].class = vm.ColorRandom(i % 5);
          }
          for (var i in data.data.flow_list) {
            if (haskey(vm.items, data.data.flow_list[i].add_time))
              vm.items[data.data.flow_list[i].add_time].push(data.data.flow_list[i]);
            else {
              vm.items[data.data.flow_list[i].add_time] = [];
              vm.dateList.push(data.data.flow_list[i].add_time);
              vm.items[data.data.flow_list[i].add_time].push(data.data.flow_list[i])
            }
          }
          vm.selectDate = vm.dateList[0];
        })
      }
      vm.editingTodo = false;
      vm.todo = {
        type: 'in',
        description: '',
        amount: ''
      };
      getList();
      vm.addTodo = function() {

        if (vm.todo.amount === '') return;
        if (!vm.todo.description) vm.todo.description = '';

        if (vm.editingTodo) {
          vm.todo = {};
          vm.editingTodo = false;
        } else {
          teamResourceApi.AddFlow({
            description: vm.todo.description,
            payment_type_name: vm.todo.type == 'out' ? '支出类型' : '收入类型' + ':' + vm.firstType + '-' + vm.secondType,
            amount: parseInt((vm.todo.type == 'in' ? '+' : '-') + vm.todo.amount)
          }, function(data) {
            getList();
          })
          vm.todo.amount = '';
          vm.todo.description = '';
        }
      };

      vm.editTodo = function(index, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.todo = vm.items[index].todo;
        vm.editingTodo = true;
      };

      vm.removeTodo = function(id) {
        ngDialog.openConfirm({
          template: 'confirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          teamResourceApi.DeleteFlow({
            flow_id: id
          }, function(data) {
            getList();
          })
        }, function(reason) {});
      };


      vm.totalCompleted = function() {
        return $filter('filter')(vm.items, function(item) {
          return item.complete;
        }).length;
      };

      vm.totalPending = function() {
        return $filter('filter')(vm.items, function(item) {
          return !item.complete;
        }).length;
      };

    }
  }
})();
/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('teamworkerController', teamworkerController)
    .filter('typeFormat', typeFormat)

  typeFormat.$inject = ['APP_PARMAS'];

  function typeFormat(APP_PARMAS) {
    return function(input, parmas) {
      return APP_PARMAS.TEAMROLENAME[input] || '';
    }
  }
  teamworkerController.$inject = ['$scope', '$timeout','ngDialog', '$filter', '$http', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'teamResourceApi', 'userResourceApi', 'APP_PARMAS'];

  function teamworkerController($scope, $timeout,ngDialog, $filter, $http, editableOptions, editableThemes, $q, schoolResourceApi, teamResourceAp, userResourceApi, APP_PARMAS) {
    var vm = this;
    vm.users = [];

    function getList() {
      userResourceApi.TeamWorkerQuery(function(data) {
        vm.users = data.data;
      })
    }
    getList()
    vm.types = [{
      id: 1,
      name: '次要负责人'
    }, {
      id: 2,
      name: '普通成员'
    }]
    vm.showRole = function(user) {
      if (user.type && vm.types.length) {
        var selected = $filter('filter')(vm.types, {
          id: user.type
        });
        return selected.length ? selected[0].name : '暂无';
      } else {
        return APP_PARMAS.TEAMROLENAME[user.type] || '暂无';
      }
    };

    vm.checkName = function(data) {
      if (!data || data == '') {
        return '姓名不能为空';
      }
    };
    vm.checkID = function(data) {
      if (!data) {
        return '请选择';
      }
    }
    vm.saveUser = function(data, type, id) {
        if (data.type > type)
          schoolResourceApi.DegradeTeamer({
            user_id: id
          }, function(data) {
            getList()
          })
        else if (data.type < type)
          schoolResourceApi.UpgradeTeamer({
            user_id: id
          }, function(data) {
            getList()
          })
        else
          return;
      }
      // remove user
    vm.removeUser = function(index, id) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DeleteTeamer({
          user_id: id
        }, function() {
          getList()
        });

      }, function(reason) {});
    };


    // editable table
    // ----------------------------------- 

    // filter users to show
    vm.filterUser = function(user) {
      return user.isDeleted !== true;
    };

    // mark user as deleted
    vm.deleteUser = function(id) {
      var filtered = $filter('filter')(vm.users, {
        id: id
      });
      if (filtered.length) {
        filtered[0].isDeleted = true;
      }
    };

    // cancel all changes
    vm.cancel = function(rowform) {
      console.log('cancel')
      rowform.$cancel();
      vm.users.pop();
    };
  }
})();
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('UserInfoController', UserInfoController);
  UserInfoController.$inject=['schoolResourceApi']
  function UserInfoController(schoolResourceApi) {
    var vm = this;
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.getUserInfo=function(){
      schoolResourceApi.GetUserInfo(function(data){
        vm.user=data.data;
      })
      vm.loadColleges();
    }
    vm.loadColleges = function() {
            return vm.colleges? null : schoolResourceApi.CollegeQuery(function(data){
                   vm.colleges=data.data;
                   vm.loadMajors(data.data[0].school_id);
            })
    };
    vm.loadMajors=function(id){
            return id? schoolResourceApi.MajorQuery({school_id:id},function(data){
                   vm.majors=data.data;
            }):null;
    };
    vm.getUserInfo();
    vm.submitForm = function() {
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        vm.user['is_male']=1;
        for(var i in vm.user){
          if(!vm.user[i])
            delete vm.user[i];
        }
        schoolResourceApi.SetUserInfo(vm.user,function(data){
          console.log(data)
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    };
  }
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide'];
    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide){
      
      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

    }

})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('APP_MEDIAQUERY', {
      'desktopLG': 1200,
      'desktop': 992,
      'tablet': 768,
      'mobile': 480,
    })
    .constant('APP_PARMAS', {
      'DefaultPassword':'000000',
      'NOTICEITEM':1000,
      'ROLENAME':['基地管理员','二级管理员','主要负责人','次级负责人','','普通游客'],
      'TEAMROLENAME':['主要负责人','次级负责人','普通成员'],
      'TEAMSTATE':['软性入驻','硬性入驻'],
      'USERBLOCKNAME':'波纹科技',
      'USERBLOCKPICTURE':'app/img/user/01.jpg'
    })
    .constant('AUTH_EVENTS', {
      //--登录成功--
      loginSuccess: 'auth-login-success',
      //--登录失败--
      loginFailed: 'auth-login-failed',
      //--退出成功--
      logoutSuccess: 'auth-logout-success',
      //--认证超时--
      sessionTimeout: 'auth-session-timeout',
      //--未认证权限--
      notAuthenticated: 'auth-not-authenticated',
      //--未授权--
      notAuthorized: 'auth-not-authorized',
      //--服务器出错--
      systemError: 'something-wrong-system'
    })
    .constant('USER_ROLES', {
      visitor: '5',
      teamworker: '3',
      teamleader: '2',
      admin: '1',
      baseadmin: '0'
    })
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache', 'Colors'];
    
    function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors) {
      
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;
      // ngdialog-theme
      $rootScope.theme = 'ngdialog-theme-default';
      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $rootScope.colorByName = Colors.byName;

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });
      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };      

    }

})();


(function() {
	'use strict';
	
	angular.module('app.controllers')
	.filter('fromNow', fromNow)
	.filter('NowTime', NowTime)
	.filter('removeTag', removeTag);
	function NowTime(){
		return function(input,params){
			return moment.unix(input).format('ll');
		}
	}
	function fromNow(){
		return function(input,params){
			return moment.unix(input).fromNow();
		}
	}
	function removeTag(){
		return function(input,params){
			input = input.replace(/<\/?[^>]*>/g,''); //去除HTML tag
            input = input.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
            input = input.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            input =input.replace(/ /ig,'');
            return input;
		}
    }
});
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            'modernizr':          ['vendor/modernizr/modernizr.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'skycons':            ['vendor/skycons/skycons.js'],
            'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                                   'vendor/simple-line-icons/css/simple-line-icons.css'],
            'weather-icons':      ['vendor/weather-icons/css/weather-icons.min.css'],
            'sparklines':         ['app/vendor/sparklines/jquery.sparkline.min.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                   'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['app/vendor/gmap/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                   'vendor/Flot/jquery.flot.resize.js',
                                   'vendor/Flot/jquery.flot.pie.js',
                                   'vendor/Flot/jquery.flot.time.js',
                                   'vendor/Flot/jquery.flot.categories.js',
                                   'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                                  // jquery core and widgets
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js'],
                                   // loads only jquery required modules and touch support
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js',
                                   'vendor/jquery-ui/ui/mouse.js',
                                   'vendor/jquery-ui/ui/draggable.js',
                                   'vendor/jquery-ui/ui/droppable.js',
                                   'vendor/jquery-ui/ui/sortable.js',
                                   'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'md5' :               ['vendor/angular-md5/angular-md5.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                   'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/dist/parsley.min.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                   'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                                   'vendor/morris.js/morris.js',
                                   'vendor/morris.js/morris.css'],
            'loaders.css':          ['vendor/loaders.css/loaders.css'],
            'spinkit':              ['vendor/spinkit/css/spinkit.css']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                       'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                       'vendor/chosen_v1.2.0/chosen.min.css',
                                                       'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                       'vendor/ngDialog/css/ngDialog.min.css',
                                                       'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                        'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                        'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                        'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},
            {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                        'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                        'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                        'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'ngGrid',                    files: ['vendor/ng-grid/build/ng-grid.min.js',
                                                        'vendor/ng-grid/ng-grid.css' ]},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                        'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                        'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                        'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                        'vendor/textAngular/dist/textAngular-sanitize.js',
                                                        'vendor/textAngular/src/globals.js',
                                                        'vendor/textAngular/src/factories.js',
                                                        'vendor/textAngular/src/DOM.js',
                                                        'vendor/textAngular/src/validators.js',
                                                        'vendor/textAngular/src/taBind.js',
                                                        'vendor/textAngular/src/main.js',
                                                        'vendor/textAngular/dist/textAngularSetup.js'
                                                        ], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                                                        'vendor/rickshaw/rickshaw.js',
                                                        'vendor/rickshaw/rickshaw.min.css',
                                                        'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                                                        'vendor/chartist/dist/chartist.js',
                                                        'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'ueditor',                    files: ['vendor/ueditor/ueditor.config.js',
                                                          'vendor/ueditor/ueditor.all.min.js',
                                                          'vendor/ueditor/ueditor-derective.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                        'vendor/datatables/media/js/jquery.dataTables.js',
                                                        'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},
            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                        'vendor/jqcloud2/dist/jqcloud.js',
                                                        'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/angular-grid.css',
                                                        'vendor/ag-grid/dist/angular-grid.js',
                                                        'vendor/ag-grid/dist/theme-dark.css',
                                                        'vendor/ag-grid/dist/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                        'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']},
            {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                                        'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'bm.bsTour',                 files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                                                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                                                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true},
            {name: 'slider-h',                  files: ['vendor/angular-sidebar/sidebar-h.js']},
            {name: 'slider-l',                  files: ['vendor/angular-sidebar/sidebar-l.js']},
            {name: 'slider-m',                  files: ['vendor/angular-sidebar/sidebar-m.js']}
          ]
        })
        ;

})();

(function() {
	'use strict';

	angular.module('app.services')

	.factory('AuthInterceptor', AuthInterceptorFn)
	AuthInterceptorFn.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
	//错误码拦截
	function AuthInterceptorFn($rootScope, $q, AUTH_EVENTS) {
		return {
			response: function(response) {
				$rootScope.$broadcast({					
					401: AUTH_EVENTS.notAuthenticated,
					410: AUTH_EVENTS.notAuthorized,
					411: AUTH_EVENTS.notAuthenticated,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout,
					481: AUTH_EVENTS.notBaseadminAuth,
					700: AUTH_EVENTS.systemError
				}[response.status], response);
				return $q.reject(response);
			}
		};
	}
});
(function() {
	'use strict';

	angular
		.module('app.services')
		.factory('userResourceApi', userResourceApiFn)
		.factory('adminResourceApi',adminResourceApiFn)
		.factory('schoolResourceApi',schoolResourceApiFn)
		.factory('teamResourceApi',teamResourceApiFn);
 		teamResourceApiFn.$inject = ['$resource'];
 		schoolResourceApiFn.$inject = ['$resource'];
 		userResourceApiFn.$inject = ['$resource'];
 		adminResourceApiFn.$inject=['$resource'];
		//--用户权限--
		function userResourceApiFn($resource) {
		    return $resource('/user/:user/:param/:operate', {}, {
		    	//--登录--
		      	login: {method:'POST', params:{operate:'login'}},
		      	//--退出登录--
		      	logout:{method:'POST',params:{operate:'logout'}},
		      	//--获取团队成员列表--
		      	TeamWorkerQuery:{method:'POST',params:{param:'member',user:'team',operate:'list'}},
   
		    });
		}
		//--基地管理员权限
		function adminResourceApiFn($resource){
			return $resource('/admin/:user/:param/:operate/:others', {}, {
				//--团队补贴Excel导出--
				TeamRecordExport:{method:'POST',params:{user:'account',param:'record',operate:'excel',others:'export'}},
				//--帖子列表--
				PostListQuery:{method:'POST',params:{user:'community',param:'post',operate:'list'}},
				//--编辑记账本收支类型列表--
				PaymentEdit:{method:'POST',params:{user:'payment',param:'type',operate:'edit'}},
				//--获取版块列表（管理员）-- 
		      	ModuleQuery:{method:'POST',params:{user:'community',param:'section',operate:'list'}},
		      	//--获取团队审核申请excel--
		      	GetTeamcheckExcel:{method:'GET',params:{user:'team',param:'apply',operate:'excel',others:'get'}},
		    	//--获取管理员列表--
		      	AdminList: {method:'POST', params:{user:'admin',operate:'list'}},
		      	//--添加二级管理员--
		      	AddAdmin: {method:'POST', params:{user:'admin',operate:'add'}},
		      	//--删除二级管理员--
		      	RemoveAdmin: {method:'POST', params:{user:'admin',operate:'delete'}},
		      	//--获取基地用户列表--
		      	TeamMemberListQuery: {method:'POST', params:{user:'team',param:'member',operate:'list'}},
		      	//--获取创建新团队的申请列表--
		      	CreateTeamApplyQuery:{method:'POST',params:{user:'team',param:'apply',operate:'list'}},
		      	//--通过团队审核--				
		      	PassTeamApply:{method:'POST',params:{user:'team',param:'apply',operate:'approve'}},				
		      	//--否决团队审核--
		      	RejectTeamApply:{method:'POST',params:{user:'team',param:'apply',operate:'decline'}},				
		      	//--获取团体审核材料--
		      	TeamApplyDetailQuery:{method:'POST',params:{user:'team',param:'apply',operate:'detail',others:'get'}},
		      	//--团队入驻情况编辑--
		      	TeamSettleEdit:{method:'POST',params:{user:'team',param:'settle',operate:'edit'}},
		      	//--获取团队列表（管理员）--
		      	TeamListQuery:{method:'POST',params:{user:'team',operate:'list'}},
		      	//--获取基地通知的列表，支持分批加载-- 
		      	BaseInfoQuery: {method:'POST', params:{user:'info',param:'notice',operate:'list'}},
		      	//--获取活动展示的列表，支持分批加载--
		      	BaseActivityQuery: {method:'POST', params:{user:'info',param:'notice',operate:'list'}},
		      	//--获取比赛事项的列表，支持分批加载--
		      	BaseGameQuery: {method:'POST', params:{user:'info',param:'notice',operate:'list'}},
		      	//--添加商品--
		      	AddGoods: {method:'POST', params:{user:'goods',operate:'add'}},
		      	//--删除商品--
		      	DelectGoods: {method:'POST', params:{user:'goods',operate:'delete'}},
		      	//--编辑商品--				
		      	EditGoods: {method:'POST', params:{user:'goods',operate:'edit'}},		      	
		      	//--删除团队--
		      	RemoveTeam:{method:'POST',params:{user:'team',operate:'delete'}}
		    });
		}
		//--团队权限--
		function teamResourceApiFn($resource){
			return $resource('/team/:user/:param/:operate', {}, {
		    	//--编辑团队资料--
		      	UpdateIntroduce: {method:'POST', params:{param:'detail',operate:'edit'}},
		      	//--导出流水EXCEL--
		      	ExportFlowExecl: {method:'POST', params:{user:'flow',param:'excel',operate:'export'}},
		      	//--通过新成员申请团队--
		      	PassNewWorker: {method:'POST', params:{user:'recruit',param:'request',operate:'approve'}},
		      	//--否决新成员申请团队--
		      	RejectNewWorker: {method:'POST', params:{user:'recruit',param:'request',operate:'decline'}},
		      	//--流水列表--
		      	FlowListQuery: {method:'POST', params:{param:'flow',operate:'list'}},
		      	//--添加流水--
		      	AddFlow: {method:'POST', params:{param:'flow',operate:'add'}},
		      	//--编辑流水--
		      	EditFlow: {method:'POST', params:{param:'flow',operate:'edit'}},
		      	//--删除流水--
		      	DeleteFlow: {method:'POST', params:{param:'flow',operate:'delete'}},
		      	//--批量加钱--
		      	IncreaseAllMoney: {method:'POST', params:{user:'account',param:'batch',operate:'increase'}},
		      	//--批量扣钱--
		      	DecreaseAllMoney: {method:'POST', params:{user:'account',param:'batch',operate:'decrease'}},
		      	//--团队申请中心--
		      	ApplyForThing: {method:'POST', params:{user:'room',param:'apply',operate:'add'}},
		      	//--添加招聘--
		      	AddRecruit: {method:'POST', params:{param:'recruit',operate:'add'}},
		      	//--修改招聘--
		      	EditRecruit: {method:'POST', params:{param:'recruit',operate:'edit'}},
		      	//--删除招聘--
		      	DelectRecruit: {method:'POST', params:{param:'recruit',operate:'delete'}},
		      	//--查询招聘--
		      	RecruitQuery: {method:'POST', params:{param:'recruit',operate:'list'}},
		      	//--获取团队应聘申请列表--
		      	JoinerQuery: {method:'POST', params:{user:'recruit',param:'request',operate:'list'}},
		      	//--给某个团队扣钱--
		      	DecreaseAccount: {method:'POST', params:{user:'account',param:'decrease'}},
		      	//--给某个团队加钱--
		      	IncreaseAccount: {method:'POST', params:{user:'account',param:'increase'}},
		      	//--获取团队钱包列表信息--
		      	AccountQuery: {method:'POST', params:{param:'account',operate:'list'}}
 
		    });
		}
		//--公共权限--
		function schoolResourceApiFn($resource){
			return $resource('/:user/:param/:operate/:others', {}, {
				//--申请物资列表--
				ApplyThingList:{method:'POST',params:{user:'room',param:'apply',operate:'list'}},
				//--获取记账本收支类型列表--
				PaymentList:{method:'POST',params:{user:'payment',param:'type',operate:'list'}},
				//--获取回复列表--
				RepplyQuery:{method:'POST',params:{user:'community',param:'reply',operate:'list'}},
				//--发布回复--
				PostRepplyQuery:{method:'POST',params:{user:'community',param:'reply',operate:'add'}},
				//--获取帖子详情--
				GetPostDetail:{method:'POST',params:{user:'community',param:'post',operate:'detail',others:'get'}},
				//--团队成员升级--
				UpgradeTeamer:{method:'POST',params:{user:'user',param:'member',operate:'privilege',others:'upgrade'}},
				//--团队成员降级--
				DegradeTeamer:{method:'POST',params:{user:'user',param:'member',operate:'privilege',others:'degrade'}},
				//--剔除团队成员--
				DeleteTeamer:{method:'POST',params:{user:'user',param:'team',operate:'member',others:'delete'}},
				//--团队补贴列表--	
				TeamRecordList:{method:'POST',params:{user:'account',param:'record',operate:'list'}},	
				//--删除帖子--
				PostDelete:{method:'POST',params:{user:'community',param:'post',operate:'delete'}},	
				//--管理员获取流水列表--
				AdminRecordQuery:{method:'POST',params:{user:'account',param:'record',operate:'list'}},	
				//--团队LOGO--			
				TeamLogo:{method:'POST',params:{user:'base',param:'team',operate:'logo',others:'get'}},				
				//--团队介绍--
				TeamDetailGet:{method:'POST',params:{user:'base',param:'team',operate:'detail',others:'get'}},				
				//--获取招聘详情--
				GetRecruitDetail:{method:'POST',params:{user:'base',param:'recruit',operate:'detail',others:'get'}},				
				//--通过物资申请--
				PassThingApply:{method:'POST',params:{user:'room',param:'apply',operate:'approve'}},				
				//--否决物资申请--
				RejectThingApply:{method:'POST',params:{user:'room',param:'apply',operate:'decline'}},				
				//--获取活动报名EXCEL--
				DownloadActivityExcel:{method:'POST',params:{user:'activity',param:'apply',operate:'excel',others:'get'}},
				//--修改密码--
				ChangeUserPassword:{method:'POST',params:{user:'user',param:'password',operate:'change'}},
				//--获取用户信息--
				GetUserInfo:{method:'POST',params:{user:'user',param:'info',operate:'get'}},
				//--修改用户信息--
				SetUserInfo:{method:'POST',params:{user:'user',param:'info',operate:'set'}},
				//--添加模块--
				ModuleAdd:{method:'POST',params:{user:'community',param:'section',operate:'add'}},
				//--删除模块--
				ModuleDelect:{method:'POST',params:{user:'community',param:'section',operate:'delete'}},
				//--模块编辑--
				ModuleEdit:{method:'POST',params:{user:'community',param:'section',operate:'edit'}},
		    	//--获取学院列表--
		      	CollegeQuery: {method:'POST', params:{user:'school',param:'name',operate:'list'}},
		      	//--获取专业列表--
		      	MajorQuery: {method:'POST', params:{user:'major',param:'name',operate:'list'}},
		      	//--获取学院专业级联--
		      	CollegeMajorQuery: {method:'POST', params:{user:'school',param:'major',operate:'list'}},
		      	//--获取团队列表--
		      	TeamQuery: {method:'POST', params:{user:'team',param:'name',operate:'list'}},
		      	//--删除公告--
		      	DelectInfo: {method:'POST', params:{user:'info',param:'notice',operate:'delete'}},
		      	//--编辑基地介绍页面--/ base/description/get
		      	UpdateIntroduce: {method:'POST', params:{user:'base',param:'description',operate:'edit'}},
		      	//--获取基地介绍详情--
		      	IntroduceContentQuery: {method:'POST', params:{user:'base',param:'description',operate:'get'}},
		      	//--获取基地logo--
		      	IntroduceLogoQuery: {method:'GET', params:{user:'base',param:'logo',operate:'get'}},
		      	//--获取验证码--
		      	SendCode: {method:'POST', params:{user:'user',param:'verify',operate:'send'}},
		      	//--用户利用验证码来修改密码--
		      	ChangePasswordUseCode: {method:'POST', params:{user:'user',param:'password',operate:'verify'}},
		      	//--忘记密码--
		      	ForgetCode: {method:'POST', params:{user:'user',param:'password',operate:'forget'}},
		      	//--用户注册--
		      	Register: {method:'POST', params:{user:'user',param:'register'}},
		      	//--申请新团队--
		      	ApplyNewTeam: {method:'POST', params:{user:'team',param:'request',operate:'add'}},
		      	//--获取商品列表--
		      	GoodsQuery: {method:'POST', params:{user:'good',param:'info',operate:'list'}},
		      	//--发布新公告--
		      	BaseInfoAdd: {method:'POST', params:{user:'info',param:'notice',operate:'add'}}   
		    });
		}
})();
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.routes')
    .provider('RouteHelpers', RouteHelpersProvider)
    .factory('AuthInterceptor', AuthInterceptorFn)
  AuthInterceptorFn.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
  RouteHelpersProvider.$inject = ['APP_REQUIRES'];

  //错误码拦截
  function AuthInterceptorFn($rootScope, $q, AUTH_EVENTS) {
    return {
      response: function(response) {
        $rootScope.$broadcast({         
          401: AUTH_EVENTS.notAuthenticated,
          410: AUTH_EVENTS.notAuthorized,
          411: AUTH_EVENTS.notAuthenticated,
          700: AUTH_EVENTS.systemError
        }[response.data.status], response);
        return response;
      }
    };
  }

  function RouteHelpersProvider(APP_REQUIRES) {

    /* jshint validthis:true */
    return {
      // provider access level
      basepath: basepath,
      resolveFor: resolveFor,
      // controller access level
      $get: function() {
        return {
          basepath: basepath,
          resolveFor: resolveFor
        };
      }
    };

    // Set here the base of the relative path
    // for all app views
    function basepath(uri) {
      return 'app/views/' + uri;
    }

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    function resolveFor() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad', '$q', function($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for (var i = 0, len = _args.length; i < len; i++) {
            promise = andThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function andThen(_arg) {
            // also support a function that returns a promise
            if (typeof _arg === 'function')
              return promise.then(_arg);
            else
              return promise.then(function() {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load(whatToLoad);
              });
          }
          // check and returns required data
          // analyze module items with the form [name: '', files: []]
          // and also simple array of script files (for not angular js)
          function getRequired(name) {
            if (APP_REQUIRES.modules)
              for (var m in APP_REQUIRES.modules)
                if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                  return APP_REQUIRES.modules[m];
            return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
          }

        }]
      };
    } // resolveFor

  }


})();
/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
  'use strict';

  angular
    .module('app.routes')
    .config(routesConfig);

  routesConfig.$inject = ['$stateProvider', '$httpProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', 'USER_ROLES'];

  function routesConfig($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, helper, USER_ROLES) {

    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
      var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];


    $locationProvider.html5Mode(false);

    // defaults to dashboard
    $urlRouterProvider.otherwise('/login');

    // 
    // Application Routes
    // -----------------------------------   
    $stateProvider
    // 
    // 单独的页面
    // ----------------------------------- 
      .state('page', {
        abstract: true,
        templateUrl: helper.basepath('common/page.html'),
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        resolve: helper.resolveFor('modernizr', 'icons'),
        controller: ['$rootScope', function($rootScope) {
          $rootScope.app.layout.isBoxed = false;
        }]
      })
      .state('page.login', {
        url: '/login',
        title: '账号登录',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/login.html'),
      })
      .state('page.register', {
        url: '/register',
        title: '账号注册',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/register.html'),
        resolve: helper.resolveFor('md5')
      })
      .state('page.recover', {
        url: '/recover',
        title: '账号注册',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/recover.html')
      })
      .state('page.changepassword', {
        url: '/changepassword',
        title: '修改密码',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/changepassword.html')
      })
      // --基地管理员--
      // ------------------------
      .state('admin', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('ngDialog', 'spinkit', 'moment', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('admin.secondAdmin', {
        url: '/secondAdmin',
        title: '二级管理员',
        templateUrl: helper.basepath('custom/secondadmin.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.userManagement', {
        url: '/userManagement',
        title: '成员管理',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/usermanagement.html'),
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.teamList', {
        url: '/teamList',
        title: '团队列表',
        templateUrl: helper.basepath('custom/teamlist.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.teamCheck', {
        url: '/teamCheck',
        title: '团队审核',
        templateUrl: helper.basepath('custom/teamcheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog', 'xeditable', 'spinkit')
      })
      .state('admin.teamApplyCheck', {
        url: '/teamApplyCheck',
        title: '团队审核',
        templateUrl: helper.basepath('custom/teamapplycheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog', 'xeditable')
      })
      .state('admin.joinTeam', {
        url: '/joinTeam',
        title: '招聘管理',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/jointeam.html'),
        resolve: helper.resolveFor('ngDialog')
      })
      .state('admin.view', {
        url: '/recruit/{mid:[0-9]{1,4}}',
        title: '预览文章',
        templateUrl: helper.basepath('custom/adminpost-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.secondadmin]
        },
        resolve: helper.resolveFor('ngWig', 'moment')
      })
      .state('admin.postsview', {
        url: '/posts/{id:[0-9]{1,4}}',
        title: '预览帖子',
        templateUrl: helper.basepath('common/posts-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.secondadmin]
        },
        resolve: helper.resolveFor('ngWig', 'moment')
      })
      .state('admin.baseIntroduce', {
        url: '/baseintroduce',
        title: '基地介绍',
        templateUrl: helper.basepath('custom/baseintroduce.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog','ueditor', 'ngImgCrop', 'filestyle')
      })
      .state('admin.baseNotice', {
        url: '/baseNotice',
        title: '基地通知',
        templateUrl: helper.basepath('custom/basenotice.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.baseActivity', {
        url: '/baseActivity',
        title: '基地活动',
        templateUrl: helper.basepath('custom/baseactivities.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.base-post', {
        url: '/基地活动详情',
        title: '',
        templateUrl: helper.basepath('custom/basepost.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('angular-jqcloud')
      })
      .state('admin.baseactivity', {
        url: '/baseactivity/:id',
        templateUrl: helper.basepath('custom/baseactivity.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.baseGame', {
        url: '/game',
        title: '基地比赛',
        templateUrl: helper.basepath('custom/basegame.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.modules', {
        url: '/modules',
        title: '基地模块',
        templateUrl: helper.basepath('custom/modules.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.posts', {
        url: '/posts',
        title: '帖子管理',
        controller: 'BasePostController',
        controllerAs: 'pag',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/posts.html')
      })
      .state('admin.changepassword', {
        url: '/changepassword',
        title: 'changepassword',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/basechangepassword.html'),
      })
      .state('admin.teamorders', {
        url: '/teamorders/:id',
        title: '操作记录',
        controller: 'BaseTeamOrderController',
        controllerAs: 'table',
        templateUrl: helper.basepath('custom/team-orders.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('datatables')
      })
      .state('admin.nestable', {
        url: '/nestable',
        title: 'Nestable',
        templateUrl: helper.basepath('custom/nestable.html'),
        controller:'NestableController',
        controllerAs:'nest',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ng-nestable','ngDialog')
      })
      .state('admin.teamrecord', {
        url: '/teamrecord',
        title: '团队流水',
        templateUrl: helper.basepath('custom/teamrecord.html'),
        controller: 'BaseTeamRecordController',
        controllerAs: 'table',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('datatables')
      })
      .state('admin.teamaccount', {
        url: '/teamaccount',
        title: '团队钱包',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/teamaccount.html'),
        resolve: angular.extend(helper.resolveFor('ngDialog', 'xeditable'), {
          tpl: function() {
            return {
              path: helper.basepath('ngdialog-template.html')
            };
          }
        }),
        controller: 'TeamAccountController'
      })
      .state('admin.goods', {
        url: '/goods',
        title: '团队列表',
        templateUrl: helper.basepath('custom/basegoods.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('ngDialog', 'spinkit', 'fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('team.teamworker', {
        url: '/teamworker',
        title: '成员管理',
        templateUrl: helper.basepath('custom/teamworker.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader]
        },
        resolve: helper.resolveFor('xeditable', 'ngDialog')
      })
      .state('team.suportlist', {
        url: '/suportlist',
        title: '团队审核',
        templateUrl: helper.basepath('custom/suportlist.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable', 'moment', 'spinkit')
      })
      .state('team.suportcenter', {
        url: '/suportcenter',
        title: '申请中心',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamroomapply.html'),
        resolve: helper.resolveFor('parsley', 'inputmask', 'ngDialog')
      })
      .state('team.team', {
        url: '/m/teamworker',
        title: '成员管理',
        templateUrl: helper.basepath('custom/m.teamworker.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team.joinercheck', {
        url: '/joinercheck',
        title: '招聘成员',
        templateUrl: helper.basepath('custom/joinercheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team.teamintroduce', {
        url: '/teamintroduce',
        title: '基地介绍',
        templateUrl: helper.basepath('custom/teamintroduce.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('ueditor', 'ngImgCrop', 'filestyle', 'ngDialog')
      })
      .state('team.recruit', {
        url: '/recruit',
        title: '招聘管理',
        controller: 'TeamRecruitController',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teampost.html'),
        resolve: helper.resolveFor('moment', 'ngDialog')
      })
      .state('team.record', {
        url: '/record',
        title: '记账本',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamrecordlist.html'),
        controller: 'TeamRecordController',
        controllerAs: 'todo',
        resolve: helper.resolveFor('moment', 'ngDialog')
      })
      .state('team.compost', {
        url: '/compost',
        title: '发布新招聘',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teampost-compost.html'),
        resolve: helper.resolveFor('ueditor')
      })
      .state('team.view', {
        url: '/recruit/{mid:[0-9]{1,4}}',
        title: '预览文章',
        templateUrl: helper.basepath('custom/teampost-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('ngWig', 'moment')

      })
      .state('team.orders', {
        url: '/orders',
        title: '团队补贴',
        controller: 'TeamOrderController',
        controllerAs: 'table',
        templateUrl: helper.basepath('custom/teamorder.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('datatables', 'moment')
      })
      .state('team.changepassword', {
        url: '/password',
        title: '修改密码',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamchangepassword.html'),
      })
      .state('team.userinfo', {
        url: '/info',
        title: '个人信息',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamuserinfo.html'),
      })
      .state('visitor', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('visitor.info', {
        url: '/perfectinfo',
        title: '个人信息',
        templateUrl: helper.basepath('custom/visitorinfo.html'),
        data: {
          authorizedRoles: [USER_ROLES.visitor]
        }
      })
      .state('visitor.applyteam', {
        url: '/applyteam',
        title: '申请新团队',
        templateUrl: helper.basepath('custom/applyteam.html'),
        data: {
          authorizedRoles: [USER_ROLES.visitor]
        },
        resolve: helper.resolveFor('ueditor','angularFileUpload', 'ngDialog')
      })
      // 
      // CUSTOM RESOLVES
      //   Add your own resolves properties
      //   following this object extend
      //   method
      // ----------------------------------- 
      // .state('admin.someroute', {
      //   url: '/some_url',
      //   templateUrl: 'path_to_template.html',
      //   controller: 'someController',
      //   resolve: angular.extend(
      //     helper.resolveFor(), {
      //     // YOUR RESOLVES GO HERE
      //     }
      //   )
      // })
    ;

  } // routesConfig

})();
(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage){

      // Global Settings
      // ----------------------------------- 
      $rootScope.app = {
        name: '创业孵化基地',
        description: '广东工业大学创新创业孵化基地',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: 'app/css/theme-d.css'
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings
      if( angular.isDefined($localStorage.layout) )
        $rootScope.app.layout = $localStorage.layout;
      else
        $localStorage.layout = $rootScope.app.layout;

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();

/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .directive('sidebar', sidebar);

    sidebar.$inject = ['$rootScope', '$timeout', '$window', 'Utils'];
    function sidebar ($rootScope, $timeout, $window, Utils) {
        var $win = angular.element($window);
        var directive = {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
            // scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

          var currentState = $rootScope.$state.current.name;
          var $sidebar = element;

          var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
          var subNav = $();

          $sidebar.on( eventName, '.nav > li', function() {

            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

              subNav.trigger('mouseleave');
              subNav = toggleMenuItem( $(this), $sidebar);

              // Used to detect click and touch events outside the sidebar          
              sidebarAddBackdrop();

            }

          });

          scope.$on('closeSidebarMenu', function() {
            removeFloatingNav();
          });

          // Normalize state when resize to mobile
          $win.on('resize', function() {
            if( ! Utils.isMobile() )
          	asideToggleOff();
          });

          // Adjustment on route changes
          $rootScope.$on('$stateChangeStart', function(event, toState) {
            currentState = toState.name;
            // Hide sidebar automatically on mobile
            asideToggleOff();

            $rootScope.$broadcast('closeSidebarMenu');
          });

      	  // Autoclose when click outside the sidebar
          if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {
            
            var wrapper = $('.wrapper');
            var sbclickEvent = 'click.sidebar';
            
            $rootScope.$watch('app.asideToggled', watchExternalClicks);

          }

          //////

          function watchExternalClicks(newVal) {
            // if sidebar becomes visible
            if ( newVal === true ) {
              $timeout(function(){ // render after current digest cycle
                wrapper.on(sbclickEvent, function(e){
                  // if not child of sidebar
                  if( ! $(e.target).parents('.aside').length ) {
                    asideToggleOff();
                  }
                });
              });
            }
            else {
              // dettach event
              wrapper.off(sbclickEvent);
            }
          }

          function asideToggleOff() {
            $rootScope.app.asideToggled = false;
            if(!scope.$$phase) scope.$apply(); // anti-pattern but sometimes necessary
      	  }
        }
        
        ///////

        function sidebarAddBackdrop() {
          var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
          $backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
            removeFloatingNav();
          });
        }

        // Open the collapse sidebar submenu items when on touch devices 
        // - desktop only opens on hover
        function toggleTouchItem($element){
          $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // ----------------------------------- 
        function toggleMenuItem($listItem, $sidebar) {

          removeFloatingNav();

          var ul = $listItem.children('ul');
          
          if( !ul.length ) return $();
          if( $listItem.hasClass('open') ) {
            toggleTouchItem($listItem);
            return $();
          }

          var $aside = $('.aside');
          var $asideInner = $('.aside-inner'); // for top offset calculation
          // float aside uses extra padding on aside
          var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
          var subNav = ul.clone().appendTo( $aside );
          
          toggleTouchItem($listItem);

          var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
          var vwHeight = $win.height();

          subNav
            .addClass('nav-floating')
            .css({
              position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
              top:      itemTop,
              bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

          subNav.on('mouseleave', function() {
            toggleTouchItem($listItem);
            subNav.remove();
          });

          return subNav;
        }

        function removeFloatingNav() {
          $('.dropdown-backdrop').remove();
          $('.sidebar-subnav.nav-floating').remove();
          $('.sidebar li.open').removeClass('open');
        }
    }


})();


(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http','USER_ROLES'];
    function SidebarLoader($http,USER_ROLES) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(type,onReady, onError) {
          var menuJson,menuURL;
          switch(type){
            case USER_ROLES.baseadmin:menuJson = 'server/custom/baseadmin-sidebar-menu.json';break;
            case USER_ROLES.admin:menuJson = 'server/custom/admin-sidebar-menu.json';break;
            case USER_ROLES.teamleader:menuJson = 'server/custom/teamleader-sidebar-menu.json';break;
            case USER_ROLES.teamworker:menuJson = 'server/custom/teamworker-sidebar-menu.json';break;
            case USER_ROLES.visitor:menuJson = 'server/custom/visitor-sidebar-menu.json';break;
            default:menuJson = '';break;
          }          
          
          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get(menuURL)
            .success(onReady)
            .error(onError);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$rootScope'];
    function UserBlockController($rootScope) {

        activate();

        ////////////////

        function activate() {

          // Hides/show user avatar on sidebar
          $rootScope.toggleUserBlock = function(){
            $rootScope.$broadcast('toggleUserBlock');
          };

          $rootScope.userBlockVisible = true;
          
          $rootScope.$on('toggleUserBlock', function(/*event, args*/) {

            $rootScope.userBlockVisible = ! $rootScope.userBlockVisible;
            
          });
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('app.sidebar')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$rootScope', '$scope', '$cookieStore', '$state', '$timeout', 'SidebarLoader', 'Utils', 'USER_ROLES', 'AUTH_EVENTS', 'APP_PARMAS'];

  function SidebarController($rootScope, $scope, $cookieStore, $state, $timeout, SidebarLoader, Utils, USER_ROLES, AUTH_EVENTS, APP_PARMAS) {
    var collapseList = [];
    var type = {
        sessionID: 2,
        role: ''
      },
      newType;
    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal) {
      if (newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });

    $rootScope.user = {
      name: APP_PARMAS.USERBLOCKNAME,
      picture: APP_PARMAS.USERBLOCKPICTURE,
      job: ''
    };
    // Load menu from json file
    // ----------------------------------- 
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      newType = $cookieStore.get('session');
      if (newType && newType.sessionID !== type.sessionID) {
        type = newType;
        $timeout(function() {
          $rootScope.user.role=type.role?type.role:'';
          $rootScope.user.job = type.role ? APP_PARMAS.ROLENAME[parseInt(type.role)] : '';
        }, 0, true)
        SidebarLoader.getMenu(type ? type.role : '', sidebarReady);
      }
    });

    function sidebarReady(items) {
      $timeout(function() {
        $scope.menuItems = items;
      }, 0, true)
    }

    // Handle sidebar and collapse items
    // ----------------------------------

    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
        (isActive(item) ? ' active' : '');
    };

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {

      // collapsed sidebar doesn't toggle drodopwn
      if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

      // make sure the item index exists
      if (angular.isDefined(collapseList[$index])) {
        if (!$scope.lastEventFromChild) {
          collapseList[$index] = !collapseList[$index];
          closeAllBut($index);
        }
      } else if (isParentItem) {
        closeAllBut(-1);
      }

      $scope.lastEventFromChild = isChild($index);

      return true;

    };

    // Controller helpers
    // ----------------------------------- 

    // Check item and children active state
    function isActive(item) {

      if (!item) return;

      if (!item.sref || item.sref === '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value) {
          if (isActive(value)) foundActive = true;
        });
        return foundActive;
      } else
        return $state.is(item.sref) || $state.includes(item.sref);
    }

    function closeAllBut(index) {
      index += '';
      for (var i in collapseList) {
        if (index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

    function isChild($index) {
      /*jshint -W018*/
      return (typeof $index === 'string') && !($index.indexOf('-') < 0);
    }

  }
})();