package org.collDoc

import java.nio.charset.StandardCharsets

import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.Field.Store
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.index.Term
import org.apache.lucene.search.TermQuery
import org.apache.lucene.store.Directory
import org.apache.lucene.store.FSDirectory
import org.apache.lucene.util.Version
import org.apache.tika.Tika
import org.collDoc.domain.Page


class Indexer {

	private static IndexWriter iWriterPage
	private static IndexWriter iWriterComments

	private static Indexer instance
	private Indexer(){
	}
	public static Indexer getInstance(){
		if (instance == null){
			instance = new Indexer()
		}
		return instance;
	}
	//store a page for indexer
	public static setPageIndexer(indexDirStr){
		println "Indexer path of pages: "+indexDirStr
		if (!new File(indexDirStr).exists()){
			new File(indexDirStr).mkdirs()
		}
		Directory indexDir = FSDirectory.open(new File(indexDirStr))
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_CURRENT, new StandardAnalyzer(Version.LUCENE_CURRENT))
		iWriterPage = new IndexWriter(indexDir, config)
		iWriterPage.deleteAll()
		def tika = new Tika()
		Document doc
		Page.list().each { 
			println "|Adding page to solr index: " + it.path
			doc = new Document()
			doc.add(new Field("path", it.getPath(), Field.Store.YES, Field.Index.NOT_ANALYZED))
			def htmlContent = new ByteArrayInputStream(it.htmlContent.getBytes(StandardCharsets.UTF_8))
			doc.add(new Field("htmlContent", tika.parseToString(htmlContent), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iWriterPage.addDocument(doc)
		}
		iWriterPage.commit()
	}
	//store comments by page for indexer
	public static setCommentsIndexer(indexDirStr){
		println "Indexer path of comments: "+indexDirStr
		if (!new File(indexDirStr).exists()){
			new File(indexDirStr).mkdirs()
		}
		Directory indexDir = FSDirectory.open(new File(indexDirStr))
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_CURRENT, new StandardAnalyzer(Version.LUCENE_CURRENT))
		iWriterComments = new IndexWriter(indexDir, config)
		iWriterComments.deleteAll()
		def tika = new Tika()
		Document doc
		Page.list().each {
			println "|Adding coments to solr index: " + it.path
			for ( com in it.comments.toArray() ) {
				doc = new Document()
				doc.add(new Field("path&IdRaw", it.getPath()+"@"+com.idRaw+"", Field.Store.YES, Field.Index.NOT_ANALYZED))
				doc.add(new Field("username", com.user.username, Field.Store.YES, Field.Index.NOT_ANALYZED))
				def htmlContent = new ByteArrayInputStream(com.commentary.getBytes(StandardCharsets.UTF_8))
				doc.add(new Field("commentary", tika.parseToString(htmlContent), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
				iWriterComments.addDocument(doc)
			}			
		}
		iWriterComments.commit()
	}

	//update page for indexer
	public static updatePageIndexer(path, htmlContent){
		if (iWriterPage != null){
			Document doc = new Document();
			def tika = new Tika()
			doc.add(new Field("path", path, Field.Store.YES, Field.Index.NOT_ANALYZED))
			def htmlContentParsed = new ByteArrayInputStream(htmlContent.getBytes(StandardCharsets.UTF_8))
			doc.add(new Field("htmlContent", tika.parseToString(htmlContentParsed), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iWriterPage.updateDocument(new Term("path", path), doc)
			iWriterPage.commit()
		}
	}
	//update page by page for indexer
	public static updateCommentIndexer(path, idRaw, username, commentary){
		if (iWriterComments != null){
			Document doc = new Document()
			def tika = new Tika()
			doc.add(new Field("path&IdRaw", path+"@"+idRaw+"", Field.Store.YES, Field.Index.NOT_ANALYZED))
			doc.add(new Field("username", username, Field.Store.YES, Field.Index.ANALYZED))
			def htmlContent = new ByteArrayInputStream(commentary.getBytes(StandardCharsets.UTF_8))
			doc.add(new Field("commentary", tika.parseToString(htmlContent), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iWriterComments.updateDocument(new Term("path&IdRaw", path+"@"+idRaw+""), doc)
			iWriterComments.commit()
		}
	}

	//add a new page for indexer
	public static addPageIndexer(path, htmlContent){
		if (iWriterPage != null){
			Document doc = new Document();
			def tika = new Tika()
			doc.add(new Field("path", path, Field.Store.YES, Field.Index.NOT_ANALYZED))
			def htmlContentParsed = new ByteArrayInputStream(htmlContent.getBytes(StandardCharsets.UTF_8))
			doc.add(new Field("htmlContent", tika.parseToString(htmlContentParsed), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iWriterPage.addDocument(doc)
			iWriterPage.commit()
		}
	}
	
	//add a new comment for indexer
	public static addCommentIndexer(path, idRaw, username, commentary){
		if (iWriterComments != null){
			Document doc = new Document()
			def tika = new Tika()
			doc.add(new Field("path&IdRaw", path+"@"+idRaw+"", Field.Store.YES, Field.Index.NOT_ANALYZED))
			doc.add(new Field("username", username, Field.Store.YES, Field.Index.ANALYZED))
			def htmlContent = new ByteArrayInputStream(commentary.getBytes(StandardCharsets.UTF_8))
			doc.add(new Field("commentary", tika.parseToString(htmlContent), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iWriterComments.addDocument(doc)
			iWriterComments.commit()
		}
	}

	//delete a page from indexer
	public static deletePageIndexer(path){
		if (iWriterPage != null){
			iWriterPage.deleteDocuments(new Term("path", path))
			iWriterPage.commit()
		}
	}
	
	//delete comments by page from indexer
	public static deleteCommentIndexer(path, idRaw){
		if (iWriterComments != null){
			iWriterComments.deleteDocuments(new Term("path&IdRaw", path+"@"+idRaw+""))
			iWriterComments.commit()
		}
	}

	public static close(){
		if (iWriterPage != null){
			iWriterPage.close()
		}
		if (iWriterComments != null){
			iWriterComments.close()
		}
	}
}
