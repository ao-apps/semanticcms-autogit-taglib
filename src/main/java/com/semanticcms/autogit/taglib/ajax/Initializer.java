/*
 * semanticcms-autogit-taglib - SemanticCMS automatic Git in a JSP environment.
 * Copyright (C) 2016, 2017, 2019, 2020, 2021, 2022, 2023, 2025, 2026  AO Industries, Inc.
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

package com.semanticcms.autogit.taglib.ajax;

import com.semanticcms.core.servlet.SemanticCMS;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * Registers the scripts and "{@link Initializer#HEAD_INCLUDE}" head include in {@link SemanticCMS}.
 */
@WebListener("Registers the scripts and \"" + Initializer.HEAD_INCLUDE + "\" head include in SemanticCMS.")
public class Initializer implements ServletContextListener {

  static final String HEAD_INCLUDE = "/semanticcms-autogit-taglib/head.inc.jspx";

  @Override
  public void contextInitialized(ServletContextEvent event) {
    SemanticCMS semanticCms = SemanticCMS.getInstance(event.getServletContext());
    semanticCms.addHeadInclude(HEAD_INCLUDE);
  }

  @Override
  public void contextDestroyed(ServletContextEvent event) {
    // Do nothing
  }
}
