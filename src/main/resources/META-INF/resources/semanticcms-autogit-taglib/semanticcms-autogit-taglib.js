/*
 * semanticcms-autogit-taglib - SemanticCMS automatic Git in a JSP environment.
 * Copyright (C) 2016, 2019, 2022, 2023  AO Industries, Inc.
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
 * along with semanticcms-autogit-taglib.  If not, see <https://www.gnu.org/licenses/>.
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
   * The getGitStatusUrl of the application.  This is set by JSP in a script onload event.
   */
  getGitStatusUrl : "",

  /*
   * Handles error messages from Ajax calls.
   */
  handleAjaxError : function(message, errorThrown) {
    window.alert(
      message + "\n"
      + "Error Thrown = " + errorThrown
    );
  },

  /*
   * Gets the current Git status.
   *
   * Once the status is available, calls onComplete(result).
   *
   * If an error occurs, calls onError(errorThrown) if provided, otherwise uses default error handler.
   */
  getGitStatus : async function(onComplete, onError) {
    // See https://saturncloud.io/blog/how-to-make-an-ajax-call-without-jquery/
    // See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    // See https://developer.mozilla.org/en-US/docs/Web/API/fetch
    // See https://developer.mozilla.org/en-US/docs/Web/API/Response
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
    try {
      const response = await fetch(semanticcms_autogit_taglib.getGitStatusUrl, {
        method : "GET", // GET because has no side-effects
        mode : "same-origin",
        cache : "no-store",
        redirect : "error"
      });
      if (response.ok) {
        // Parse the response
        let result = await response.json();
        Object.values(result.states).forEach((state) => {
          // Replace toStringValue with toString functions
          let toStringValue = state.toStringValue;
          state.toString = () => toStringValue;
          delete state.toStringValue;
        });
        Object.values(result.meanings).forEach((meaning) => {
          // Replace toStringValue with toString functions
          let toStringValue = meaning.toStringValue;
          meaning.toString = () => toStringValue;
          delete meaning.toStringValue;
          // Replace values with objects
          meaning.state = result.states[meaning.state];
          meaning.change = result.changes[meaning.change];
        });
        Object.values(result.gitStatus.uncommittedChanges).forEach((uncommittedChange) => {
          // Replace values with objects
          uncommittedChange.meaning = result.meanings[uncommittedChange.meaning];
        });
        // Replace values with objects
        result.gitStatus.state = result.states[result.gitStatus.state];
        // console.log(JSON.stringify(result, null, 2));
        if (onComplete) onComplete(result);
      } else {
        throw new Error("Request failed: " + response.status + " " + response.statusText);
      }
    } catch (errorThrown) {
      if (onError) {
        onError(errorThrown);
      } else {
        semanticcms_autogit_taglib.handleAjaxError(
          "Unable to get Git status",
          errorThrown
        );
      }
    }
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
    if (semanticcms_autogit_taglib.gitStatusListeners.length > 0) {
      semanticcms_autogit_taglib.getGitStatus(
        function(result) {
          // console.log(result);
          // Call all listeners
          var gitStatusListeners = semanticcms_autogit_taglib.gitStatusListeners;
          var len = gitStatusListeners.length;
          for (var i=0; i<len; i++) {
            var gitStatusListener = gitStatusListeners[i];
            if (typeof gitStatusListener.onComplete === 'function') {
              gitStatusListener.onComplete.call(gitStatusListener, result);
            }
          }
          setTimeout(
            semanticcms_autogit_taglib.pollGitStatus,
            semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL
          );
        },
        function(errorThrown) {
          // console.log(errorThrown);
          // Call all listeners
          var gitStatusListeners = semanticcms_autogit_taglib.gitStatusListeners;
          var len = gitStatusListeners.length;
          for (var i=0; i<len; i++) {
            var gitStatusListener = gitStatusListeners[i];
            if (typeof gitStatusListener.onError === 'function') {
              gitStatusListener.onError.call(gitStatusListener, errorThrown);
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
(function() {
  // See https://youmightnotneedjquery.com/#ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  ready(function() {
    // Could optimize this and only begin the polling when first listener is added
    setTimeout(
      semanticcms_autogit_taglib.pollGitStatus,
      semanticcms_autogit_taglib.GIT_STATUS_POLL_INTERVAL
    );
  });
})();
