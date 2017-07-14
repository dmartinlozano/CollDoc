package org.collDoc

import java.awt.RenderingHints
import java.nio.charset.Charset

import org.apache.commons.io.FileUtils
import org.apache.xmlbeans.impl.store.Saver.TextReader
import org.collDoc.domain.Page

import com.aspose.cells.ImageFormat
import com.aspose.cells.Workbook
import com.aspose.slides.FillType
import com.aspose.slides.IAutoShape
import com.aspose.slides.ISlide
import com.aspose.slides.Presentation
import com.aspose.slides.ShapeType
import com.aspose.words.Document

class DocParser {
	
	private static IAutoShape  ashape = null;

	public static Page parseDoc2Html(Page page, InputStream stream){

		Document doc = new Document(stream)
		com.aspose.words.HtmlSaveOptions saveOptions = new com.aspose.words.HtmlSaveOptions(com.aspose.words.SaveFormat.HTML)
		File temp = File.createTempFile("aux", ".html")
		saveOptions.setExportImagesAsBase64(true)
		doc.save(temp.getAbsolutePath(), saveOptions)

		String htmlContent = FileUtils.readFileToString(temp)
		htmlContent = htmlContent.replaceAll(~/<p style(.*?)Evaluation Only(.*?)<\/p>/,'')

		//To parse commentaries:
		Map<String, String> commentaries = new HashMap<String, String>()
		(htmlContent =~ /<a href="#_cmntref(.*?)">(.*?)<span (.*?)>(.*?)<\/span>/).each {match, number,ignore1,ignore2,commentary ->
			commentaries.putAt(number, commentary)
		}
		htmlContent = htmlContent.replaceAll('<div id(.*?)#_cmntref(.*?)</div>','')
		(htmlContent =~ /<a href="#_cmnt(.*?)">(.*?)<\/a>/).each {match, number,ignore ->
			def commentary = commentaries[number]
			htmlContent = htmlContent.replaceAll('<a href=\"#_cmnt'+number+'\">(.*?)</a>','<a class="btn btn-warning loading disabled">'+commentary+'</a>')
		}

		//parse tables
		htmlContent = htmlContent.replaceAll('<table (.*?)>', '<table class=\"table table-list-search\">')

		temp.delete()
		page.htmlContent += htmlContent
		return page
	}

	public static Page parseXls2Html(Page page, InputStream stream){

		File temp = File.createTempFile("aux", ".html")
		Workbook book = new Workbook(stream)

		com.aspose.cells.HtmlSaveOptions saveOptions = new com.aspose.cells.HtmlSaveOptions(com.aspose.cells.SaveFormat.HTML)
		saveOptions.setExportImagesAsBase64(true)
		saveOptions.getImageOptions().setImageFormat(ImageFormat.getPng())
		saveOptions.getImageOptions().setTransparent(false)
		saveOptions.getImageOptions().setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON)
		saveOptions.getImageOptions().setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON)
		book.save(temp.getAbsolutePath(), saveOptions)

		File parentFile = new File(temp.getParent() + File.separator + temp.getName().replace(".html", "_files"))
		File tabstripFile = new File(parentFile.getAbsolutePath() + File.separator + "tabstrip.htm")

		//Map of files
		List<SheetAux> sheetsList = new ArrayList<SheetAux>()
		String htmlContent = FileUtils.readFileToString(tabstripFile)

		(htmlContent =~ /<a href="(.*?)"(.*?)>(.*?)>(.*?)<\/font><\/a>/).each {match, sheetPage,ignore1,ignore2,sheetName ->

			SheetAux sheet = new SheetAux()
			sheet.id = sheetPage
			sheet.name = sheetName
			sheet.table = ""

			def sheetFile = new File(parentFile.getAbsolutePath() + File.separator + sheetPage)
			String tableContent = FileUtils.readFileToString(sheetFile)

			def initTable = tableContent.indexOf("<table")
			def endTable = tableContent.lastIndexOf("</table>")
			def tableString = tableContent.substring(initTable+ 6, endTable)
			tableString = "<table class=\"table table-list-search\" "+tableString+"</table>"
			sheet.table = tableString

			sheetsList.add(sheet)
		}
		sheetsList.remove(sheetsList.size() - 1)

		//The html result is the tables with format
		String result = ''
		def table
		sheetsList.each{
			result += '<h1>'+it.name+'</h1>'+it.table
		}

		result = result.replaceAll('\n','')
		result = result.replaceAll('<![if supportMisalignedColumns]>(.*?)<![endif]>','')
		result = result.replaceAll('mso-width-source:userset;','')
		result = result.replaceAll('<col (.*?)>','')
		result = result.replaceAll('<td (.*?)>','<td>')
		result = result.replaceAll('<tr (.*?)>','<tr>')
		result = result.replaceAll('null','')

		page.htmlContent += result
		parentFile.delete()
		temp.delete()
		return page
	}

	public static Page parsePpt2Html(Page page, InputStream stream){

		File temp = File.createTempFile("aux", ".html")
		Presentation slides = new Presentation(stream)
		slides.save(temp.getAbsolutePath(), com.aspose.slides.SaveFormat.Html)
		String htmlContent = FileUtils.readFileToString(temp)
		htmlContent = htmlContent.replaceAll('\n','')
		htmlContent = htmlContent.replaceAll('<text(.*?)Evaluation only(.*?)text>','')
		page.htmlContent += htmlContent
		temp.delete()
		return page
	}

	public static File parseHtml2Doc(Page page){
		File tempHtml = File.createTempFile("aux", ".html")
		File tempXdoc = File.createTempFile("aux", ".docx")
		FileUtils.writeStringToFile(tempHtml, page.htmlContent)

		com.aspose.words.LoadOptions loadOptions = new com.aspose.words.LoadOptions()
		loadOptions.setLoadFormat(com.aspose.words.LoadFormat.HTML)
		loadOptions.setEncoding(Charset.forName("utf-8"))
		Document doc = new Document(tempHtml.getAbsolutePath(), loadOptions)
		doc.save(tempXdoc.getAbsolutePath())
		tempHtml.delete()
		return tempXdoc
	}

	static class SheetAux{
		String id
		String name
		String table
	}
}
