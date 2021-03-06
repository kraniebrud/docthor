# Work in progress
> **Author & maintainer:** Lasse Bjørck Volkmann, **Language:** NodeJs

### Short about
This is generally a spare time project which goal is to make it possible to "generate" a documentation page from a wiki-mercurial repository.
It uses Node and to make an Node package that can be installed via npm (private registry) and from there be able to create the resources in a static manor.
That way we can hopefully build documentation pages with ease and with a seamless layout.

### Todo 
- Add the possibility to add pages (About.html, ..etc) that would be rendered fro markdown.
- Try to make hbs helper that can fetch details about endpoint in a given swagger.json 
	like http://go-live-backend-test.cirque-udv.dk/swagger.json