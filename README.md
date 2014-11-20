Technology of the Month
======================

This is the Github repo that backs the [Technology of the Month](http://pshendry.github.io/totm/) site.

Contributing
-------

## Writing posts

A post can be written (without publishing it) by creating a new file in the
`_drafts` directory. It's easiest to copy `_drafts/template.md` to a new file
with a filename of the form `yyyy-mm-dd-name-of-the-post.md`; the template
contains the header (the stuff within the triple dashes) that every post file
needs. From there you can add all the Markdown content you need. When you're
done, just submit a pull request to have your drafts pushed up to the
deployment branch (`gh-pages`).

By taking advantage of drafts, you can write several weeks' worth of content in advance.

## Publishing posts

Unfortunately there's no automated publishing system in place, so it has to be
done manually :(.

### Without collaborator privileges

Coordinate with [pshendry](https://github.com/pshendry) or another collaborator
on this one. All that needs to happen (assuming that your draft is complete) is
for the draft to be moved into the `_posts` directory, so you could make a pull
request yourself for making this change, but someone would likely be happy to
publish it for you at the appropriate time.

### Obtaining collaborator privileges

If you've got collaborator privileges you can publish your posts without a
pull request, so talk to [pshendry](https://github.com/pshendry) if you're making
several contributions and want to save yourself some trouble.

## Content Authoring Resources

This site uses [Jekyll](http://jekyllrb.com/), which will create HTML pages out
of Markdown content.

 - [Markdown basics](https://help.github.com/articles/markdown-basics/)
