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

import static com.aoindustries.servlet.filter.FunctionContext.getServletContext;
import com.semanticcms.autogit.model.GitStatus;
import com.semanticcms.autogit.servlet.AutoGitContextListener;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

final public class Functions {

	public static GitStatus getGitStatus() {
		AutoGitContextListener gitContext = AutoGitContextListener.getInstance(getServletContext());
		if(gitContext == null) {
			// Java 1.8: Inline this
			List<GitStatus.UncommittedChange> emptyList = Collections.emptyList();
			return new GitStatus(Instant.now(), GitStatus.State.DISABLED, emptyList);
		}
		return gitContext.getGitStatus();
	}

	/**
	 * Make no instances.
	 */
	private Functions() {
	}
}
