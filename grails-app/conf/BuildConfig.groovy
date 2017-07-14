grails.servlet.version = "3.0" // Change depending on target container compliance (2.5 or 3.0)
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.work.dir = "target/work"
grails.project.target.level = 1.6
grails.project.source.level = 1.6
grails.project.war.file = "target/ROOT.war"

grails.project.fork = [
    // configure settings for compilation JVM, note that if you alter the Groovy version forked compilation is required
    //  compile: [maxMemory: 256, minMemory: 64, debug: false, maxPerm: 256, daemon:true],

    // configure settings for the test-app JVM, uses the daemon by default
    test: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, daemon:true],
    // configure settings for the run-app JVM
    run: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
    // configure settings for the run-war JVM
    war: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
    // configure settings for the Console UI JVM
    console: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256]
]

grails.project.dependency.resolver = "maven" // or ivy
grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // specify dependency exclusions here; for example, uncomment this to disable ehcache:
        // excludes 'ehcache'
    }
    log "error" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    checksums true // Whether to verify checksums on resolve
    legacyResolve false // whether to do a secondary resolve on plugin installation, not advised and here for backwards compatibility

    repositories {
        inherits true // Whether to inherit repository definitions from plugins

        grailsPlugins()
        grailsHome()
        mavenLocal()
        grailsCentral()
        mavenCentral()
        // uncomment these (or add new ones) to enable remote dependency resolution from public Maven repositories
        //mavenRepo "http://repository.codehaus.org"
        //mavenRepo "http://download.java.net/maven/2/"
        //mavenRepo "http://repository.jboss.com/maven2/"
		mavenRepo "http://maven.aspose.com/artifactory/simple/ext-release-local"
    }

    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes e.g.
        // runtime 'mysql:mysql-connector-java:5.1.29'
        // runtime 'org.postgresql:postgresql:9.3-1101-jdbc41'
		
		compile "net.sf.ehcache:ehcache-core:2.4.8"
		compile "org.apache.lucene:lucene-core:4.9.0"
		compile "org.apache.lucene:lucene-spatial:4.9.0"
		compile 'org.apache.lucene:lucene-analyzers-common:4.9.0'
		compile 'org.apache.lucene:lucene-queryparser:4.9.0', {
			excludes: 'spring-sandbox'
		}
		compile 'org.apache.lucene:lucene-join:4.9.0'
		
		compile group: 'org.apache.lucene', name: 'lucene-core', version: '4.8.1'
		compile group: 'org.apache.lucene', name: 'lucene-spatial', version: '4.8.1'
		compile group: 'org.apache.lucene', name: 'lucene-analyzers-common', version: '4.8.1'
		compile('org.apache.lucene:lucene-queryparser:4.8.1') {
			exclude group: 'org.apache.lucene', module: 'lucene-sandbox'
		}
		compile 'org.apache.lucene:lucene-join:4.8.1'
		compile 'org.apache.lucene:lucene-highlighter:4.9.0'
		
		compile 'org.apache.tika:tika-core:1.5'
		compile 'org.apache.tika:tika-parsers:1.5'
		
//		compile('org.docx4j:docx4j:3.2.0'){
//			exclude group: 'org.slf4j', module: 'slf4j-log4j12'
//		}
		compile "com.aspose:aspose-words:14.5.0"
		compile "com.aspose:aspose-cells:8.2.1"
		compile "com.aspose:aspose-slides:14.6.1"
//		compile "com.aspose:aspose-pdf:9.3.1:jar:jdk16"

        test "org.grails:grails-datastore-test-support:1.0-grails-2.4"
    }

    plugins {
        // plugins for the build system only
        build ":tomcat:7.0.54"

        // plugins for the compile step
        compile ":scaffolding:2.1.2"
        compile ':cache:1.1.7'
        compile ":asset-pipeline:1.8.11"
		compile ":angular-annotate-asset-pipeline:1.1.2"
		
		compile ":cloud-bees:0.6.2"
		compile ":create-domain-uml:0.5"
		compile ":mongodb:3.0.1"
		
		compile ":asset-pipeline:1.9.0"
		compile ":spring-security-core:2.0-RC3"
		compile ":spring-security-rest:1.4.0.RC3", {
			excludes: 'spring-security-core'
		}
		
		compile ":feeds:1.6"
		
		//	compile ":docx4j:3.2.0"

		// plugins needed at runtime but not for compilation
		runtime ":jquery:1.11.1"
		
		test ":code-coverage:2.0.3-2"

        // Uncomment these to enable additional asset-pipeline capabilities
        //compile ":sass-asset-pipeline:1.7.4"
        //compile ":less-asset-pipeline:1.7.0"
        //compile ":coffee-asset-pipeline:1.7.0"
        //compile ":handlebars-asset-pipeline:1.3.0.3"
		
		
    }
}
