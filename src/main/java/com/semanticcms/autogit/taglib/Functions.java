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
package com.semanticcms.autogit.taglib;

import static com.aoindustries.servlet.filter.FunctionContext.getRequest;
import static com.aoindustries.servlet.filter.FunctionContext.getServletContext;
import com.semanticcms.autogit.model.GitStatus;
import com.semanticcms.autogit.model.State;
import com.semanticcms.autogit.model.UncommittedChange;
import com.semanticcms.autogit.servlet.AutoGitContextListener;
import java.util.Collections;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

final public class Functions {

	private static final String GIT_STATUS_CACHE_KEY = Functions.class.getName() + ".getGitStatus.cache";

	public static GitStatus getGitStatus() {
		HttpServletRequest request = getRequest();
		// Look for cached value
		GitStatus gitStatus = (GitStatus)request.getAttribute(GIT_STATUS_CACHE_KEY);
		if(gitStatus == null) {
			AutoGitContextListener gitContext = AutoGitContextListener.getInstance(getServletContext());
			if(gitContext == null) {
				// Java 1.8: Inline this
				List<UncommittedChange> emptyList = Collections.emptyList();
				gitStatus = new GitStatus(System.currentTimeMillis(), State.DISABLED, emptyList);
			} else {
				gitStatus = gitContext.getGitStatus();
			}
			request.setAttribute(GIT_STATUS_CACHE_KEY, gitStatus);
		}
		return gitStatus;
	}

	/**
	 * Make no instances.
	 */
	private Functions() {
	}
}
