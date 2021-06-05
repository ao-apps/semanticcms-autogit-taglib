/*
 * semanticcms-autogit-taglib - SemanticCMS automatic Git in a JSP environment.
 * Copyright (C) 2016, 2017, 2019, 2020, 2021  AO Industries, Inc.
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
package com.semanticcms.autogit.taglib.ajax;

import com.aoapps.net.URIEncoder;
import com.semanticcms.core.renderer.html.HtmlRenderer;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener("Registers the scripts and \"" + Initializer.HEAD_INCLUDE + "\" head include in HtmlRenderer.")
public class Initializer implements ServletContextListener {

	static final String HEAD_INCLUDE = "/semanticcms-autogit-taglib/head.inc.jspx";

	@Override
	public void contextInitialized(ServletContextEvent event) {
		HtmlRenderer htmlRenderer = HtmlRenderer.getInstance(event.getServletContext());
		// TODO: Return a Script object type instead, with a follow-up of "jQuery.noConflict();"
		htmlRenderer.addScript("jquery", "/webjars/jquery/" + URIEncoder.encodeURIComponent(Maven.jqueryVersion) + "/dist/jquery.min.js");
		htmlRenderer.addHeadInclude(HEAD_INCLUDE);
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		// Do nothing
	}
}
