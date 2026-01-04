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

package com.semanticcms.autogit.taglib.book;

import com.aoapps.lang.validation.ValidationException;
import com.aoapps.net.DomainName;
import com.aoapps.net.Path;
import com.semanticcms.core.model.BookRef;
import com.semanticcms.core.model.ResourceRef;
import com.semanticcms.tagreference.TagReferenceInitializer;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.servlet.ServletContainerInitializer;

/**
 * Initializes a tag reference during {@linkplain ServletContainerInitializer application start-up}.
 */
public class SemanticCmsAutoGitTldInitializer extends TagReferenceInitializer {

  /**
   * Parses the TLD file.
   */
  @SuppressFBWarnings("CT_CONSTRUCTOR_THROW")
  public SemanticCmsAutoGitTldInitializer() throws ValidationException {
    super(
        Maven.properties.getProperty("documented.name") + " Reference",
        "Taglib Reference",
        new ResourceRef(
            new BookRef(
                DomainName.valueOf("semanticcms.com"),
                Path.valueOf("/autogit/taglib")
            ),
            Path.valueOf("/semanticcms-autogit.tld")
        ),
        true,
        Maven.properties.getProperty("documented.javadoc.link.javase"),
        Maven.properties.getProperty("documented.javadoc.link.javaee"),
        // Self
        "com.semanticcms.autogit.taglib", Maven.properties.getProperty("project.url") + "apidocs/com.semanticcms.autogit.taglib/",
        // Dependencies
        "com.semanticcms.autogit.model", "https://semanticcms.com/autogit/model/apidocs/com.semanticcms.autogit.model/"
    );
  }
}
