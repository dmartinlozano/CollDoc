package org.collDoc.controller

import groovy.json.JsonBuilder

import org.apache.lucene.analysis.TokenStream
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexReader
import org.apache.lucene.queryparser.classic.QueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.Query
import org.apache.lucene.search.highlight.Highlighter
import org.apache.lucene.search.highlight.QueryScorer
import org.apache.lucene.search.highlight.SimpleHTMLFormatter
import org.apache.lucene.search.highlight.TextFragment
import org.apache.lucene.search.highlight.TokenSources
import org.apache.lucene.store.FSDirectory
import org.apache.lucene.util.Version

class FindController {

	def get(){
		String action = request.getParameter("action")

		//default action
		if (action == null){
			render(view: "/find")
		}

		//find in pages
		if (action.equals("queryPages")){

			def q = request.getParameter("q") // Query string
			if (q == null || q == "" || q == "undefined"){
				render(status: 500, text: "The Search can not be empty")
			}
			def path = request.getSession().getServletContext().getRealPath("/")
			if (path == null){
				path = System.getProperty("user.dir")
			}

			def fullPagePath = path + File.separator + "solrIndexPage"
			println "prueba de path de find: " + path + File.separator + "solrIndexPage"
			IndexReader reader = DirectoryReader.open(FSDirectory.open(new File(fullPagePath)))
			IndexSearcher is = new IndexSearcher(reader)
			StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_CURRENT)

			QueryParser parser = new QueryParser(Version.LUCENE_CURRENT, "htmlContent", analyzer)
			Query query = parser.parse(q)

			def hits = is.search(query, 100000) // Search index
			def resultList = []
			Highlighter highlighter = new Highlighter( new SimpleHTMLFormatter(), new QueryScorer(query));

			for ( i in 0 ..< hits.totalHits ) {
				int id = hits.scoreDocs[i].doc
				Document doc = is.doc(id)
				TokenStream tokenStream = TokenSources.getAnyTokenStream(is.getIndexReader(), id, "htmlContent", analyzer)
				TextFragment[] frag = highlighter.getBestTextFragments(tokenStream, doc.get("htmlContent"), false, 4)
				def fragmentList = []
				for (int j = 0; j < frag.length; j++) {
					if ((frag[j] != null) && (frag[j].getScore() > 0)) {
						fragmentList << frag[j].toString()
					}
				}
				def bean = new PageResult(doc.get("path"), fragmentList)
				resultList << bean
			}
			def json = new JsonBuilder(resultList)
			render(status: 200, text: json.toPrettyString(), contentType: "application/json", encoding: "UTF-8")
		}

		//find in comments
		if (action.equals("queryComments")){

			def q = request.getParameter("q") // Query string
			if (q == null || q == "" || q == "undefined"){
				render(status: 500, text: "The Search can not be empty")
			}
			def path = request.getSession().getServletContext().getRealPath("/")
			if (path == null){
				path = System.getProperty("user.dir")
			}

			def fullPagePath = path + File.separator + "solrIndexComments"
			IndexReader reader = DirectoryReader.open(FSDirectory.open(new File(fullPagePath)))
			IndexSearcher is = new IndexSearcher(reader)
			StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_CURRENT)

			QueryParser parser = new QueryParser(Version.LUCENE_CURRENT, "commentary", analyzer)
			Query query = parser.parse(q)

			def hits = is.search(query, 100000) // Search index
			def resultList = []
			Highlighter highlighter = new Highlighter( new SimpleHTMLFormatter(), new QueryScorer(query));

			for ( i in 0 ..< hits.totalHits ) {
				int id = hits.scoreDocs[i].doc
				Document doc = is.doc(id)
				TokenStream tokenStream = TokenSources.getAnyTokenStream(is.getIndexReader(), id, "commentary", analyzer)
				TextFragment[] frag = highlighter.getBestTextFragments(tokenStream, doc.get("commentary"), false, 4)
				def fragmentList = []
				for (int j = 0; j < frag.length; j++) {
					if ((frag[j] != null) && (frag[j].getScore() > 0)) {
						fragmentList << frag[j].toString()
					}
				}

				def pathIdRaw = doc.get("path&IdRaw")
				def path2 = pathIdRaw.split("@")[0]
				def idRaw = pathIdRaw.split("@")[1]
				def bean = new CommentResult(path2,idRaw, fragmentList)
				resultList << bean
			}
			def json = new JsonBuilder(resultList)
			render(status: 200, text: json.toPrettyString(), contentType: "application/json", encoding: "UTF-8")
		}
	}

	class PageResult{
		def path //html path
		def result //line where the query find is ok
		PageResult(def path, def result){
			this.path = path
			this.result = result
		}
	}

	class CommentResult{
		def path //html path
		def idRaw //line where the query find is ok
		def result
		CommentResult(def path, def idRaw, def result){
			this.path = path
			this.idRaw = idRaw
			this.result = result
		}
	}
}
