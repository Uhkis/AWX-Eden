/*
 *  AWX - Ajax based Webinterface for XBMC
 *  Copyright (C) 2010  MKay
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */



var awx = {};



(function($) {

	/*************
	 * AWX stuff *
	 *************/
	$.extend(awx, {

		init: function() {
			var dialogHandle = mkf.dialog.show({content:'<h1 class="loading" id="loadingAWXHint">Loading AWXi ...</h1>', closeButton: false});
			$('body').append('<div id="initAWX"></div>');
			$('#initAWX').hide();

			// init-Object contains each init-step as a function
			var init = {
				// --- STEP 1: Set Language
				step1 : function() {
					mkf.lang.setLanguage(mkf.cookieSettings.get('lang', 'en'));
					init.step2();
				},

				// --- STEP 2: Load UI-Script
				step2 : function() {
					$('#loadingAWXHint').text(mkf.lang.get('message_setup_ui'));

					var ui = mkf.cookieSettings.get('ui');
					var uiScript = '';

					if (ui == 'light') {
						uiScript = 'ui.light/ui.light.js';
					} else if (ui == 'default') {
						uiScript = 'ui.default/ui.default.js';
					} else if (ui == 'lightDark') {
						uiScript = 'ui.lightDark/ui.lightDark.js';
					} else {
						uiScript = 'ui.uni/ui.uni.js';
					}

					mkf.scriptLoader.load({
						script: uiScript,
						onload: init.step3,
						onerror: function() {
							alert(mkf.lang.get('message_failed_ui'));
							init.step5();
						}
					});
				},

				// --- STEP 3: Init xbmc-lib
				step3: function() {
					$('#loadingAWXHint').text(mkf.lang.get('message_init_xbmc'));
					xbmc.init($('#initAWX'), init.step4);
				},

				// --- STEP 4: Init UI
				step4 : function() {
					awxUI.init();
                                        $(document.documentElement).keypress(function (event) {
                                          // handle cursor keys
                                          if (event.keyCode == 37) {
                                            xbmc.input({type: 'Left'}); return false;
                                          } else if (event.keyCode == 38) {
                                            xbmc.input({type: 'Up'}); return false;
                                          } else if (event.keyCode == 40) {
                                            xbmc.input({type: 'Down'}); return false;
                                          } else if (event.keyCode == 13) {
                                            xbmc.input({type: 'Select'}); return false;
                                          } else if (event.keyCode == 39) {
                                            xbmc.input({type: 'Right'}); return false;
                                          }
                                        });

					init.step5();
				},

				// --- STEP 5: Cleanup
				step5 : function(errorText) {
					if (errorText) {
						mkf.messageLog.show(errorText, mkf.messageLog.status.error, 5000);
					}

					$('#initAWX').remove();
					mkf.dialog.close(dialogHandle);
				}
			};

			// Begin with step 1
			init.step1();
		}

	});

})(jQuery);

