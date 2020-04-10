/*
 * semanticcms-autogit-taglib - SemanticCMS automatic Git in a JSP environment.
 * Copyright (C) 2016, 2017, 2019  AO Industries, Inc.
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
package com.semanticcms.autogit.taglib.book;

import com.semanticcms.tagreference.TagReferenceInitializer;
import java.util.LinkedHashMap;
import java.util.Map;

public class SemanticCmsAutoGitTldInitializer extends TagReferenceInitializer {

	private static final Map<String,String> additionalApiLinks = new LinkedHashMap<String,String>();
	static {
		// Self
		additionalApiLinks.put("com.semanticcms.autogit.taglib.", Maven.properties.getProperty("project.url") + "apidocs/");
		// Dependencies
		additionalApiLinks.put("com.semanticcms.autogit.model.", "https://semanticcms.com/autogit/model/apidocs/");
	}

	public SemanticCmsAutoGitTldInitializer() {
		super(
			"AutoGit Taglib Reference",
			"Taglib Reference",
			"/autogit/taglib",
			"/semanticcms-autogit.tld",
			Maven.properties.getProperty("documented.javadoc.link.javase"),
			Maven.properties.getProperty("documented.javadoc.link.javaee"),
			additionalApiLinks
		);
	}
}
