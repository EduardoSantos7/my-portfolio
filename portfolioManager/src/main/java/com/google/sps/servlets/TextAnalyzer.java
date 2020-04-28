// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

/**
 * Servlet that returns the sentiment in the text added in the parameters
 * comments data
 */
@WebServlet("/sentiment")
public class TextAnalyzer extends HttpServlet {

  

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    try(LanguageServiceClient languageService = LanguageServiceClient.create()){
      String message = request.getParameter("message");

      Document doc = Document.newBuilder().setContent(message).setType(Document.Type.PLAIN_TEXT).build();
      Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
      float score = sentiment.getScore();
      languageService.close();

      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      response.getWriter().println(convertToJson(score));
    }
  }

  private String convertToJson(Float comments) {
    Gson gson = new Gson();
    return gson.toJson(comments);
  }
}
