/*
 * semanticcms-autogit-taglib - SemanticCMS automatic Git in a JSP environment.
 * Copyright (C) 2016  AO Industries, Inc.
 *     support@aoindustries.com
 *     7262 Bull Pen Cir
 *     Mobile, AL 36695
 *
 * This file is part of semanticcms-autogit-taglib.
 *
 * semanticcms-autogit-taglib is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * semanticcms-autogit-taglib is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with semanticcms-autogit-taglib.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * After including this script, be sure to set the getGitStatusUrl to a correct value.
 */
semanticcms_autogit_taglib = {
	/*
	 * The number of milliseconds between Git status polling.
	 */
	GIT_STATUS_POLL_INTERVAL : 1000, // One second

	/*
	 * The number of milliseconds between Git status polling after an error.
	 */
	GIT_STATUS_POLL_INTERVAL_ERROR : 10000, // Ten seconds

	/*
	 * The getGitStatusUrl of the application.  This is set by JSP just after this
	 * script is included.
	 */
	getGitStatusUrl : "",

	/*
	 * Handles error messages from Ajax calls.
	 */
	handleAjaxError : function(message, jqXHR, errorThrown) {
		window.alert(
			message + "\n"
			+ "Status Code = " + jqXHR.status + "\n"
			+ "Error Thrown = " + errorThrown
		);
	},

	/*
	 * Gets the current Git status.
	 *
	 * Once the status is available, calls onComplete(result).
	 *
	 * If an error occurs, calls onError(textStatus, errorThrown) if provided, otherwise uses default error handler.
	 */
	getGitStatus : function(onComplete, onError) {
		$.ajax({
			cache : false,
			type : "GET", // GET because has no side-effects
			timeout : 60000,
			url : semanticcms_autogit_taglib.getGitStatusUrl,
			dataType : "xml",
			success : function(data, textStatus, jqXHR) {
				// Parse the response
				var resultXml = $(data).children('result');
				var states={};
				$(resultXml).children('states').children('state').each(function(){
					var name = $(this).attr('name');
					var toString = $(this).attr('toString');
					states[name] = {
						name: name,
						toString: function() {
							return toString;
						},
						cssClass : $(this).attr('cssClass')
					};
				});
				var changes={};
				$(resultXml).children('changes').children('change').each(function(){
					var name = $(this).attr('name');
					changes[name] = {
						name: name,
						cssClass : $(this).attr('cssClass')
					};
				});
				var meanings={};
				$(resultXml).children('meanings').children('meaning').each(function(){
					var name = $(this).attr('name');
					var toString = $(this).attr('toString');
					meanings[name] = {
						name: name,
						toString: function() {
							return toString;
						},
						state : states[$(this).attr('state')],
						change : changes[$(this).attr('change')],
					};
				});
				var gitStatusXml = $(resultXml).children('gitStatus');
				var uncommittedChanges=new Array();
				$(gitStatusXml).children('uncommittedChanges').children('uncommittedChange').each(function(){
					uncommittedChanges.push(
						{
							x: $(this).attr('x'),
							y: $(this).attr('y'),
							meaning : meanings[$(this).attr('meaning')],
							module: $(this).attr('module'),
							from: $(this).attr('from'),
							to: $(this).attr('to')
						}
					);
				});
				var result = {
					states : states,
					changes : changes,
					meanings : meanings,
					gitStatus : {
						statusTime : $(gitStatusXml).attr('statusTime'),
						state : states[$(gitStatusXml).attr('state')],
						uncommittedChanges : uncommittedChanges
					}
				}
				// console.log(result);
				if(onComplete) onComplete(result);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if(onError) {
					onError(textStatus, errorThrown);
				} else {
					semanticcms_autogit_taglib.handleAjaxError(
						"Unable to get Git status",
						jqXHR,
						errorThrown
					);
				}
			}
		});
	},

	/**
	 * The set of listeners that will be notified whenever new Git status is available
	 * from the background polling.
	 * On successful status retrieval, each object's <code>onComplete(result)</code> method, if present, will be called.
	 */
	gitStatusListeners : new Array(),

	/**
	 * Method that implements the Git status polling.  This should not be used directly.
	 * Polls in the background for updated Git status as long as there are any registered status listeners.
	 */
	pollGitStatus : function() {
		if(semanticcms_autogit_taglib.gitStatusListeners.length > 0) {
			semanticcms_autogit_taglib.getGitStatus(
				function(result) {
					// console.log(result);
					// Call all listeners
					var gitStatusListeners = semanticcms_autogit_taglib.gitStatusListeners;
					var len = gitStatusListeners.length;
					for(var i=0; i<len; i++) {
						var gitStatusListener = gitStatusListeners[i];
						if(typeof gitStatusListener.onComplete === 'function') {
							gitStatusListener.onComplete.call(gitStatusListener, result);
						}
					}
					setTimeout(
						semanticcms_autogit_taglib.pollGitStatus,
						semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL
					);
				},
				function(textStatus, errorThrown) {
					// console.log(textStatus);
					// console.log(errorThrown);
					// Call all listeners
					var gitStatusListeners = semanticcms_autogit_taglib.gitStatusListeners;
					var len = gitStatusListeners.length;
					for(var i=0; i<len; i++) {
						var gitStatusListener = gitStatusListeners[i];
						if(typeof gitStatusListener.onError === 'function') {
							gitStatusListener.onError.call(gitStatusListener, textStatus, errorThrown);
						}
					}
					setTimeout(
						semanticcms_autogit_taglib.pollGitStatus,
						semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL_ERROR
					);
				}
			);
		} else {
			console.log("No listeners");
			// Could optimize this and stop polling when last listener is removed
			setTimeout(
				semanticcms_autogit_taglib.pollGitStatus,
				semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL
			);
		}
	}
};

/*
 * Kick-off the Git status polling.
 */
$(document).ready(function(){
	// Could optimize this and only begin the polling when first listener is added
	setTimeout(
		semanticcms_autogit_taglib.pollGitStatus,
		semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL
	);
});
