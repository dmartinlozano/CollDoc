package org.collDoc

import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.Field.Store
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
import org.apache.lucene.index.Term
import org.apache.lucene.store.Directory
import org.apache.lucene.store.FSDirectory
import org.apache.lucene.util.Version
import org.apache.tika.Tika

//deprecated
class IndexerFS {

	private static htmlPathString = ''
	private static IndexWriter iwriter

	private static IndexerFS instance
	private IndexerFS(){
	}
	public static IndexerFS getInstance(){
		if (instance == null){
			instance = new IndexerFS()
		}
		return instance;
	}
	public static setIndexer(indexDirStr, dataDirStr){
		if (!new File(indexDirStr).exists()){
			new File(indexDirStr).mkdirs()
		}
		Directory dataDir = FSDirectory.open(new File(dataDirStr))
		Directory indexDir = FSDirectory.open(new File(indexDirStr))
		
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_CURRENT, new StandardAnalyzer(Version.LUCENE_CURRENT))
		iwriter = new IndexWriter(indexDir, config)
		iwriter.deleteAll()
		def tika = new Tika()
		Document doc
		
		dataDir.getDirectory().eachFileRecurse {
			if (it.name =~ /.html$/) {
				
				println "|Adding file to solr index: " + it.getPath()
				doc = new Document()
				doc.add(new Field("filename", it.getPath(), Field.Store.YES, Field.Index.NOT_ANALYZED))
				doc.add(new Field("contents", tika.parseToString(it), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
				
				iwriter.addDocument(doc)
			}
		}
		iwriter.commit()
	}
	
	public static updateIndexer(absolutePath){
		if (iwriter != null){
			Document doc = new Document();
			def tika = new Tika()
			doc.add(new Field("filename", absolutePath, Field.Store.YES, Field.Index.NOT_ANALYZED))
			doc.add(new Field("contents", tika.parseToString(new File(absolutePath)), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iwriter.updateDocument(new Term("filename", absolutePath), doc)
			iwriter.commit()
		}
	}
	
	public static addIndexer(absolutePath){
		if (iwriter != null){
			Document doc = new Document()
			def tika = new Tika()
			doc.add(new Field("filename", absolutePath, Field.Store.YES, Field.Index.NOT_ANALYZED))
			doc.add(new Field("contents", tika.parseToString(new File(absolutePath)), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.WITH_POSITIONS_OFFSETS))
			iwriter.addDocument(doc)
			iwriter.commit()
		}
	}
	
	public static deleteIndexer(absolutePath){
		if (iwriter != null){
			iwriter.deleteDocuments(new Term("filename", absolutePath.getCanonicalPath()))
			iwriter.commit()
		}
	}
	
	public static close(){
		if (iwriter != null){
			iwriter.close()
		}
	}
	
}
