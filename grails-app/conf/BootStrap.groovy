import org.collDoc.Indexer
import org.collDoc.IndexerFS
import org.collDoc.domain.Page
import org.collDoc.domain.RssCommentary
import org.collDoc.domain.RssPage
import org.collDoc.domain.Settings
import org.collDoc.domain.security.AuthenticationToken
import org.collDoc.domain.security.Role
import org.collDoc.domain.security.User


class BootStrap {

	def init = { servletContext ->
		environments {
			development {

				def tokens = AuthenticationToken.list()
				tokens.each {
					it.delete(flush: true)
				}
				Role adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN', pageView: true, pageEdit4All: true, pageEdit4Creator: true, discussionView: true, discussionEdit4All: true, discussionEdit4Creator: true, settingsView: true, settingsEdit4All: true, settingsEdit4Creator: true).save(flush: true, failOnError: true)
				Role userRole = Role.findByAuthority('ROLE_USER') ?: new Role(authority: 'ROLE_USER', pageView: true, pageEdit4All: false, pageEdit4Creator: true, discussionView: true, discussionEdit4All: false, discussionEdit4Creator: true, settingsView: true, settingsEdit4All: false, settingsEdit4Creator: true).save(flush: true, failOnError: true)
				Role viewerRole = Role.findByAuthority('ROLE_VIEWER') ?: new Role(authority: 'ROLE_VIEWER', pageView: false, pageEdit4All: false, pageEdit4Creator: false, discussionView: false, discussionEdit4All: false, discussionEdit4Creator: false, settingsView: false, settingsEdit4All: false, settingsEdit4Creator: false).save(flush: true, failOnError: true)
				User adminUser = User.findByUsername("admin") ?: new User(username: 'admin', password: 'admin', role: adminRole).save(flush: true, failOnError: true)
				User userUser = User.findByUsername("user") ?: new User(username: 'user', password: 'user', role: userRole).save(flush: true, failOnError: true)
				User viewerUser = User.findByUsername("viewer") ?: new User(username: 'viewer', password: 'viewer', role: viewerRole).save(flush: true, failOnError: true)
				Settings settings = Settings.findByProjectName("demoProject") ?: new Settings(projectName: "demoProject",treeViewJS: "[]").save(flush: true, failOnError: true)
				Page indexPage = Page.findByPath("/")  ?: new Page(label: "/index",htmlContent: "<h1>Default main page</h1>",path:"/",creator: adminRole).save(flush: true, failOnError: true)
				def path = servletContext.getRealPath("/")
				if (path == null){
					path = System.getProperty("user.dir")
				}
				Indexer.getInstance().setPageIndexer(path + File.separator +  "solrIndexPage")
				Indexer.getInstance().setCommentsIndexer(path + File.separator +  "solrIndexComments")

				println "|Done"
			}
		}
	}
	def destroy = {
		Indexer.getInstance().close()
	}
}
